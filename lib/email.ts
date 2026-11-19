import crypto from 'node:crypto'
import { Resend } from 'resend'
import type { DbOrder, OrderItemJson, ShippingAddressJson } from '@/types/database'

const DEFAULT_FROM = 'STENCIL2 <pedidos@stencil2.com>'
const DEFAULT_ADMIN_TO = 'pedidos@stencil2.com'
const DEFAULT_REPLY_TO = 'pedidos@stencil2.com'
const DEFAULT_APP_URL = 'https://www.stencil2.com'

let cachedResend: Resend | null = null
let cachedApiKey: string | undefined
let missingKeyWarned = false

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    if (!missingKeyWarned) {
      console.warn(
        '[Email] RESEND_API_KEY no está configurada. El envío de correos quedará omitido sin interrumpir el flujo.'
      )
      missingKeyWarned = true
    }
    return null
  }
  if (!cachedResend || cachedApiKey !== apiKey) {
    cachedResend = new Resend(apiKey)
    cachedApiKey = apiKey
  }
  return cachedResend
}

export function getAppUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim() || DEFAULT_APP_URL
  return raw.replace(/\/+$/, '')
}

function getEmailFrom(): string {
  return process.env.EMAIL_FROM?.trim() || DEFAULT_FROM
}

function getEmailAdminTo(): string {
  return process.env.EMAIL_ADMIN_TO?.trim() || DEFAULT_ADMIN_TO
}

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function sanitizeHeader(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).replace(/[\r\n]+/g, ' ').trim()
}

function formatEur(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0
  return `${safe.toFixed(2)} €`
}

function shortHash(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 24)
}

function getUnsubscribeSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET?.trim()
  if (secret) return secret
  if (process.env.NODE_ENV !== 'production') {
    return 'stencil2-dev-unsubscribe-secret-local-only'
  }
  console.error('[Email] UNSUBSCRIBE_SECRET no está configurado en producción.')
  return ''
}

export function createUnsubscribeToken(email: string): string {
  const secret = getUnsubscribeSecret()
  if (!secret) return ''
  const normalized = email.trim().toLowerCase()
  return crypto.createHmac('sha256', secret).update(`unsubscribe:${normalized}`).digest('hex')
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  if (!email || !token || typeof email !== 'string' || typeof token !== 'string') {
    return false
  }
  const expected = createUnsubscribeToken(email)
  if (!expected) return false

  try {
    const a = Buffer.from(expected, 'hex')
    const b = Buffer.from(token.trim(), 'hex')
    if (a.length === 0 || a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export function buildUnsubscribeUrl(email: string): string {
  const normalized = email.trim().toLowerCase()
  const token = createUnsubscribeToken(normalized)
  const appUrl = getAppUrl()
  if (!token) {
    return `${appUrl}/contacto`
  }
  return `${appUrl}/api/newsletter/baja?email=${encodeURIComponent(normalized)}&token=${encodeURIComponent(token)}`
}

export interface EmailSendResult {
  ok: boolean
  id?: string
  skipped?: boolean
  error?: string
}

async function dispatchEmail(params: {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
  idempotencyKey: string
  headers?: Record<string, string>
}): Promise<EmailSendResult> {
  const resend = getResendClient()
  if (!resend) {
    return { ok: false, skipped: true, error: 'RESEND_API_KEY no configurada' }
  }

  try {
    const { data, error } = await resend.emails.send(
      {
        from: getEmailFrom(),
        to: params.to,
        replyTo: params.replyTo || DEFAULT_REPLY_TO,
        subject: sanitizeHeader(params.subject),
        html: params.html,
        text: params.text,
        headers: params.headers,
      },
      {
        idempotencyKey: sanitizeHeader(params.idempotencyKey).slice(0, 256),
      }
    )

    if (error) {
      console.error(`[Email] Error de Resend (${params.idempotencyKey}):`, error)
      return { ok: false, error: error.message || 'Error de Resend' }
    }

    return { ok: true, id: data?.id }
  } catch (err: any) {
    console.error(`[Email] Excepción enviando correo (${params.idempotencyKey}):`, err)
    return { ok: false, error: err?.message || 'Excepción al enviar correo' }
  }
}

// Los logos se sirven desde /public. Se fuerza el host con "www" para evitar la
// redirección del apex (algunos clientes de correo no siguen redirecciones en imágenes).
function getAssetBaseUrl(): string {
  return getAppUrl().replace(/^https:\/\/stencil2\.com/i, 'https://www.stencil2.com')
}

function renderEmailShell(options: {
  preheader: string
  eyebrow: string
  title: string
  bodyHtml: string
  footerExtraHtml?: string
}): string {
  const appUrl = escapeHtml(getAppUrl())
  const assetUrl = escapeHtml(getAssetBaseUrl())
  const preheader = escapeHtml(options.preheader)
  const eyebrow = escapeHtml(options.eyebrow)
  const title = escapeHtml(options.title)
  const mono = "'Courier New',Courier,monospace"
  const navLink = `style="color:#B8B2A6;text-decoration:none;font-family:${mono};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;"`

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;color:#F5F2EB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${preheader}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#050505" style="background-color:#050505;width:100%;margin:0;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#0E0E0E" style="width:100%;max-width:600px;background-color:#0E0E0E;border:1px solid #232120;">
          <!-- Franja de marca -->
          <tr>
            <td height="4" style="height:4px;line-height:4px;font-size:0;background-color:#CC0000;">&nbsp;</td>
          </tr>

          <!-- Cabecera con logo oficial -->
          <tr>
            <td align="center" bgcolor="#080808" style="padding:36px 32px 28px 32px;background-color:#080808;border-bottom:1px solid #232120;">
              <a href="${appUrl}" style="text-decoration:none;">
                <img src="${assetUrl}/images/logo-script-white.png" alt="STENCIL2" width="190" height="96" style="display:block;border:0;outline:none;width:190px;height:auto;max-width:100%;color:#F5F2EB;font-family:${mono};font-size:24px;letter-spacing:4px;" />
              </a>
              <p style="margin:14px 0 0 0;font-family:${mono};font-size:10px;letter-spacing:4px;color:#C8B89A;text-transform:uppercase;">
                JOINING CULTURE
              </p>
            </td>
          </tr>

          <!-- Título principal -->
          <tr>
            <td style="padding:36px 36px 8px 36px;">
              <p style="margin:0 0 10px 0;font-family:${mono};font-size:11px;letter-spacing:3px;color:#C8B89A;text-transform:uppercase;">
                ${eyebrow}
              </p>
              <h1 style="margin:0;font-size:26px;line-height:1.25;font-weight:700;color:#F5F2EB;letter-spacing:0.3px;">
                ${title}
              </h1>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;">
                <tr><td width="48" height="2" style="width:48px;height:2px;line-height:2px;font-size:0;background-color:#CC0000;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Cuerpo -->
          <tr>
            <td style="padding:20px 36px 36px 36px;color:#EAE5D9;font-size:14px;line-height:1.65;">
              ${options.bodyHtml}
            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td align="center" bgcolor="#080808" style="padding:32px 32px 28px 32px;background-color:#080808;border-top:1px solid #232120;color:#8E8A80;font-size:12px;line-height:1.6;">
              <a href="${appUrl}" style="text-decoration:none;">
                <img src="${assetUrl}/images/logo-grenade-white.png" alt="S2" width="34" height="55" style="display:block;margin:0 auto 18px auto;border:0;width:34px;height:auto;opacity:0.9;" />
              </a>
              <p style="margin:0 0 18px 0;">
                <a href="${appUrl}/tienda" ${navLink}>Tienda</a>
                <span style="color:#3A3733;">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                <a href="${appUrl}/envio" ${navLink}>Envíos</a>
                <span style="color:#3A3733;">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                <a href="${appUrl}/faq" ${navLink}>FAQ</a>
                <span style="color:#3A3733;">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                <a href="${appUrl}/contacto" ${navLink}>Contacto</a>
              </p>
              ${options.footerExtraHtml || ''}
              <p style="margin:0 0 8px 0;color:#757168;font-size:11px;">
                ¿Necesitas ayuda? Responde a este correo o escríbenos a <a href="mailto:pedidos@stencil2.com" style="color:#C8B89A;text-decoration:none;">pedidos@stencil2.com</a>.
              </p>
              <p style="margin:0;font-family:${mono};font-size:10px;letter-spacing:1.5px;color:#5E5A52;text-transform:uppercase;">
                STENCIL2 · España · <a href="${appUrl}/privacidad" style="color:#757168;text-decoration:underline;">Privacidad</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export interface OrderEmailPayload {
  orderNumber: string
  customerEmail: string
  customerName?: string | null
  customerPhone?: string | null
  stripeId?: string | null
  items: OrderItemJson[]
  subtotal: number
  discount: number
  taxableBase: number
  tax: number
  shipping: number
  total: number
  promoCode?: string | null
  pointsEarned: number
  shippingAddress?: ShippingAddressJson
  createdAt?: string
}

export function dbOrderToEmailPayload(row: DbOrder): OrderEmailPayload {
  const total = Number(row.total) || 0
  const subtotal = Number(row.subtotal) || total
  const discount = Number(row.discount) || 0
  const shipping = Number(row.shipping) || 0
  // Si la base imponible o el IVA vienen a 0, calculamos el desglose del 21% incluido
  const rawTaxable = Number(row.taxable_base) || 0
  const rawTax = Number(row.tax) || 0
  const taxableBase = rawTaxable > 0 ? rawTaxable : Number((total / 1.21).toFixed(2))
  const tax = rawTax > 0 ? rawTax : Number((total - taxableBase).toFixed(2))

  return {
    orderNumber: row.order_number,
    customerEmail: row.customer_email,
    customerName: row.customer_name || row.shipping_address?.name || null,
    customerPhone: row.customer_phone || row.shipping_address?.phone || null,
    stripeId: row.stripe_id,
    items: Array.isArray(row.items) ? row.items : [],
    subtotal,
    discount,
    taxableBase,
    tax,
    shipping,
    total,
    promoCode: row.promo_code,
    pointsEarned: Number(row.points_earned) || Math.round(total),
    shippingAddress: row.shipping_address || {},
    createdAt: row.created_at,
  }
}

function buildOrderItemsTableHtml(items: OrderItemJson[]): string {
  if (!items || items.length === 0) {
    return `<p style="margin:12px 0;color:#B8B2A6;font-size:13px;">Pedido registrado en STENCIL2.</p>`
  }

  const rows = items
    .map((item) => {
      const qty = Math.max(1, Number(item.quantity) || 1)
      const unit = Number(item.price) || 0
      const lineTotal = unit * qty
      const name = escapeHtml(item.name || 'Gafas STENCIL2')
      const code = item.code ? ` <span style="color:#8E8A80;font-size:11px;">(${escapeHtml(item.code)})</span>` : ''
      const color = item.colorLabel ? `<div style="color:#B8B2A6;font-size:12px;margin-top:2px;">Color: ${escapeHtml(item.colorLabel)}</div>` : ''

      return `<tr>
        <td style="padding:12px 0;border-bottom:1px solid #22201C;color:#F5F2EB;font-size:13px;">
          <strong>${name}</strong>${code}
          ${color}
        </td>
        <td align="center" style="padding:12px 8px;border-bottom:1px solid #22201C;color:#EAE5D9;font-family:'Courier New',Courier,monospace;font-size:13px;">
          x${qty}
        </td>
        <td align="right" style="padding:12px 0;border-bottom:1px solid #22201C;color:#F5F2EB;font-family:'Courier New',Courier,monospace;font-size:13px;white-space:nowrap;">
          ${formatEur(lineTotal)}
        </td>
      </tr>`
    })
    .join('')

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin:16px 0;">
    <thead>
      <tr>
        <th align="left" style="padding:8px 0;border-bottom:1px solid #33302A;font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:2px;color:#8E8A80;text-transform:uppercase;">Producto</th>
        <th align="center" style="padding:8px 8px;border-bottom:1px solid #33302A;font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:2px;color:#8E8A80;text-transform:uppercase;">Cant.</th>
        <th align="right" style="padding:8px 0;border-bottom:1px solid #33302A;font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:2px;color:#8E8A80;text-transform:uppercase;">Importe</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>`
}

function buildOrderTotalsHtml(order: OrderEmailPayload): string {
  const promoLabel = order.promoCode ? ` (${escapeHtml(order.promoCode)})` : ''
  const discountRow =
    order.discount > 0
      ? `<tr>
          <td style="padding:4px 0;color:#C8B89A;font-size:13px;">Descuento${promoLabel}</td>
          <td align="right" style="padding:4px 0;color:#C8B89A;font-family:'Courier New',Courier,monospace;font-size:13px;">-${formatEur(order.discount)}</td>
        </tr>`
      : ''

  const shippingText = order.shipping <= 0 ? 'GRATIS' : formatEur(order.shipping)

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:12px;background-color:#161513;border:1px solid #262420;padding:16px;">
    <tr>
      <td style="padding:4px 0;color:#B8B2A6;font-size:13px;">Subtotal</td>
      <td align="right" style="padding:4px 0;color:#F5F2EB;font-family:'Courier New',Courier,monospace;font-size:13px;">${formatEur(order.subtotal)}</td>
    </tr>
    ${discountRow}
    <tr>
      <td style="padding:4px 0;color:#B8B2A6;font-size:13px;">Envío</td>
      <td align="right" style="padding:4px 0;color:#F5F2EB;font-family:'Courier New',Courier,monospace;font-size:13px;">${shippingText}</td>
    </tr>
    <tr>
      <td style="padding:4px 0;color:#8E8A80;font-size:12px;">Base imponible (sin IVA)</td>
      <td align="right" style="padding:4px 0;color:#8E8A80;font-family:'Courier New',Courier,monospace;font-size:12px;">${formatEur(order.taxableBase)}</td>
    </tr>
    <tr>
      <td style="padding:4px 0;color:#8E8A80;font-size:12px;">IVA (21% incluido)</td>
      <td align="right" style="padding:4px 0;color:#8E8A80;font-family:'Courier New',Courier,monospace;font-size:12px;">${formatEur(order.tax)}</td>
    </tr>
    <tr>
      <td style="padding:12px 0 4px 0;border-top:1px solid #2C2924;color:#F5F2EB;font-size:15px;font-weight:700;">TOTAL (IVA incluido)</td>
      <td align="right" style="padding:12px 0 4px 0;border-top:1px solid #2C2924;color:#F5F2EB;font-family:'Courier New',Courier,monospace;font-size:16px;font-weight:700;">${formatEur(order.total)}</td>
    </tr>
  </table>`
}

function buildShippingAddressHtml(order: OrderEmailPayload): string {
  const addr = order.shippingAddress || {}
  const name = escapeHtml(addr.name || order.customerName || 'Cliente STENCIL2')
  const street = escapeHtml(addr.address || '—')
  const postalCity = [addr.postalCode, addr.city].filter(Boolean).map(escapeHtml).join(' · ')
  const phone = escapeHtml(addr.phone || order.customerPhone || '')
  const email = escapeHtml(addr.email || order.customerEmail)

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:20px;background-color:#0D0D0C;border:1px solid #262420;padding:16px;">
    <tr>
      <td>
        <p style="margin:0 0 8px 0;font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:2px;color:#C8B89A;text-transform:uppercase;">
          DIRECCIÓN DE ENVÍO
        </p>
        <p style="margin:0;color:#F5F2EB;font-size:13px;line-height:1.5;">
          <strong>${name}</strong><br />
          ${street}<br />
          ${postalCity ? `${postalCity}<br />` : ''}
          ${phone ? `Tel: ${phone}<br />` : ''}
          Email: ${email}
        </p>
      </td>
    </tr>
  </table>`
}

function buildOrderPlainText(order: OrderEmailPayload, isAdmin: boolean): string {
  const lines: string[] = []
  lines.push(
    isAdmin
      ? `NUEVO PEDIDO RECIBIDO EN STENCIL2 — #${order.orderNumber}`
      : `CONFIRMACIÓN DE TU PEDIDO STENCIL2 — #${order.orderNumber}`
  )
  lines.push('============================================================')
  lines.push(`Nº de pedido: ${order.orderNumber}`)
  if (isAdmin && order.stripeId) {
    lines.push(`Stripe PaymentIntent: ${order.stripeId}`)
  }
  lines.push(`Cliente: ${order.customerName || order.shippingAddress?.name || 'Cliente'}`)
  lines.push(`Email: ${order.customerEmail}`)
  if (order.customerPhone || order.shippingAddress?.phone) {
    lines.push(`Teléfono: ${order.customerPhone || order.shippingAddress?.phone}`)
  }
  lines.push('')
  lines.push('ARTÍCULOS:')
  if (order.items.length === 0) {
    lines.push('- Pedido registrado en STENCIL2')
  } else {
    for (const item of order.items) {
      const qty = Math.max(1, Number(item.quantity) || 1)
      const unit = Number(item.price) || 0
      const color = item.colorLabel ? ` [${item.colorLabel}]` : ''
      const code = item.code ? ` (${item.code})` : ''
      lines.push(`- ${item.name}${code}${color} x${qty}: ${formatEur(unit * qty)}`)
    }
  }
  lines.push('')
  lines.push(`Subtotal: ${formatEur(order.subtotal)}`)
  if (order.discount > 0) {
    lines.push(
      `Descuento${order.promoCode ? ` (${order.promoCode})` : ''}: -${formatEur(order.discount)}`
    )
  }
  lines.push(`Envío: ${order.shipping <= 0 ? 'GRATIS' : formatEur(order.shipping)}`)
  lines.push(`Base imponible (sin IVA): ${formatEur(order.taxableBase)}`)
  lines.push(`IVA (21% incluido): ${formatEur(order.tax)}`)
  lines.push(`TOTAL (IVA incluido): ${formatEur(order.total)}`)
  lines.push(`Puntos S2 ganados: +${order.pointsEarned} PTS`)
  lines.push('')
  lines.push('DIRECCIÓN DE ENVÍO:')
  lines.push(order.shippingAddress?.name || order.customerName || '—')
  lines.push(order.shippingAddress?.address || '—')
  lines.push(
    [order.shippingAddress?.postalCode, order.shippingAddress?.city].filter(Boolean).join(' ') ||
      '—'
  )
  lines.push('')
  lines.push(`Tienda oficial: ${getAppUrl()}`)
  lines.push('Soporte: pedidos@stencil2.com')
  return lines.join('\n')
}

export async function sendOrderConfirmation(
  order: OrderEmailPayload
): Promise<EmailSendResult> {
  const customerName = escapeHtml(
    order.customerName || order.shippingAddress?.name || 'Cliente'
  )
  const orderNumber = escapeHtml(order.orderNumber)
  const appUrl = escapeHtml(getAppUrl())

  const bodyHtml = `
    <p style="margin:0 0 16px 0;color:#EAE5D9;">
      Hola <strong>${customerName}</strong>, hemos recibido tu pago correctamente y nuestro equipo ya está preparando tu pedido.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#0D0D0C;border:1px solid #2C2924;padding:14px 16px;margin-bottom:16px;">
      <tr>
        <td style="font-family:'Courier New',Courier,monospace;font-size:11px;color:#8E8A80;letter-spacing:1.5px;text-transform:uppercase;">
          Nº DE PEDIDO
        </td>
        <td align="right" style="font-family:'Courier New',Courier,monospace;font-size:14px;color:#C8B89A;font-weight:700;letter-spacing:1px;">
          #${orderNumber}
        </td>
      </tr>
    </table>

    ${buildOrderItemsTableHtml(order.items)}
    ${buildOrderTotalsHtml(order)}
    ${buildShippingAddressHtml(order)}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:20px;background-color:#161410;border:1px solid #3D3220;padding:14px 16px;">
      <tr>
        <td style="color:#EAE5D9;font-size:13px;">
          <strong style="color:#C8B89A;font-family:'Courier New',Courier,monospace;">+${escapeHtml(order.pointsEarned)} PUNTOS S2</strong> añadidos a tu cuenta de fidelidad con esta compra.
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
      <tr>
        <td align="center" style="background-color:#F5F2EB;">
          <a href="${appUrl}/cuenta" style="display:inline-block;padding:14px 28px;font-family:'Courier New',Courier,monospace;font-size:12px;font-weight:700;letter-spacing:2px;color:#080808;text-decoration:none;text-transform:uppercase;">
            VER MI CUENTA
          </a>
        </td>
      </tr>
    </table>
  `

  const html = renderEmailShell({
    preheader: `Tu pedido #${order.orderNumber} en STENCIL2 está confirmado.`,
    eyebrow: 'PEDIDO CONFIRMADO',
    title: `Gracias por tu compra (#${order.orderNumber})`,
    bodyHtml,
  })

  return dispatchEmail({
    to: order.customerEmail,
    replyTo: DEFAULT_REPLY_TO,
    subject: `Confirmación de tu pedido #${order.orderNumber} — STENCIL2`,
    html,
    text: buildOrderPlainText(order, false),
    idempotencyKey: `order-confirm-${order.orderNumber}`,
  })
}

export async function sendNewOrderAlert(
  order: OrderEmailPayload
): Promise<EmailSendResult> {
  const orderNumber = escapeHtml(order.orderNumber)
  const stripeId = escapeHtml(order.stripeId || '—')
  const customerEmail = escapeHtml(order.customerEmail)

  const bodyHtml = `
    <p style="margin:0 0 16px 0;color:#EAE5D9;">
      Se ha confirmado un nuevo pago en <strong>STENCIL2</strong>.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#0D0D0C;border:1px solid #2C2924;padding:14px 16px;margin-bottom:16px;">
      <tr>
        <td style="padding:4px 0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#8E8A80;">PEDIDO:</td>
        <td align="right" style="padding:4px 0;font-family:'Courier New',Courier,monospace;font-size:13px;color:#C8B89A;font-weight:700;">#${orderNumber}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#8E8A80;">CLIENTE:</td>
        <td align="right" style="padding:4px 0;font-family:'Courier New',Courier,monospace;font-size:12px;color:#F5F2EB;">${customerEmail}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#8E8A80;">STRIPE ID:</td>
        <td align="right" style="padding:4px 0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#B8B2A6;">${stripeId}</td>
      </tr>
    </table>

    ${buildOrderItemsTableHtml(order.items)}
    ${buildOrderTotalsHtml(order)}
    ${buildShippingAddressHtml(order)}
  `

  const html = renderEmailShell({
    preheader: `Nuevo pedido pagado #${order.orderNumber} (${formatEur(order.total)})`,
    eyebrow: 'AVISO INTERNO · VENTAS',
    title: `Nuevo pedido #${order.orderNumber} — ${formatEur(order.total)}`,
    bodyHtml,
  })

  return dispatchEmail({
    to: getEmailAdminTo(),
    replyTo: order.customerEmail || DEFAULT_REPLY_TO,
    subject: `[NUEVO PEDIDO] #${order.orderNumber} — ${formatEur(order.total)}`,
    html,
    text: buildOrderPlainText(order, true),
    idempotencyKey: `order-admin-${order.orderNumber}`,
  })
}

export interface ContactEmailPayload {
  id?: string
  email: string
  name?: string
  message: string
}

export async function sendContactAlert(
  payload: ContactEmailPayload
): Promise<EmailSendResult> {
  const safeEmail = escapeHtml(payload.email)
  const safeName = escapeHtml(payload.name || 'Sin nombre especificado')
  const safeMessage = escapeHtml(payload.message).replace(/\r?\n/g, '<br />')
  const keySuffix = payload.id || shortHash(`${payload.email}:${payload.message}`)

  const bodyHtml = `
    <p style="margin:0 0 16px 0;color:#EAE5D9;">
      Nuevo mensaje recibido desde el formulario de contacto de <strong>STENCIL2</strong>:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#0D0D0C;border:1px solid #262420;padding:16px;margin-bottom:16px;">
      <tr>
        <td style="padding:4px 0;color:#8E8A80;font-size:12px;">Nombre:</td>
        <td style="padding:4px 0;color:#F5F2EB;font-size:13px;font-weight:600;">${safeName}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#8E8A80;font-size:12px;">Email:</td>
        <td style="padding:4px 0;color:#C8B89A;font-size:13px;"><a href="mailto:${safeEmail}" style="color:#C8B89A;text-decoration:underline;">${safeEmail}</a></td>
      </tr>
    </table>
    <div style="background-color:#161513;border-left:3px solid #C8B89A;padding:16px;color:#F5F2EB;font-size:13px;line-height:1.6;">
      ${safeMessage}
    </div>
  `

  const html = renderEmailShell({
    preheader: `Mensaje de contacto de ${payload.name || payload.email}`,
    eyebrow: 'SOPORTE · FORMULARIO WEB',
    title: 'Nuevo mensaje de atención al cliente',
    bodyHtml,
  })

  const text = [
    'NUEVO MENSAJE DE CONTACTO — STENCIL2',
    '====================================',
    `Nombre: ${payload.name || 'Sin nombre especificado'}`,
    `Email: ${payload.email}`,
    '',
    'Mensaje:',
    payload.message,
  ].join('\n')

  return dispatchEmail({
    to: getEmailAdminTo(),
    replyTo: payload.email,
    subject: `[CONTACTO WEB] Mensaje de ${payload.name || payload.email}`,
    html,
    text,
    idempotencyKey: `contact-alert-${keySuffix}`,
  })
}

export async function sendContactAutoreply(
  payload: ContactEmailPayload
): Promise<EmailSendResult> {
  const safeName = escapeHtml(payload.name || 'Hola')
  const safeMessage = escapeHtml(payload.message).replace(/\r?\n/g, '<br />')
  const keySuffix = payload.id || shortHash(`${payload.email}:${payload.message}`)

  const bodyHtml = `
    <p style="margin:0 0 16px 0;color:#EAE5D9;">
      ${payload.name ? `Hola <strong>${safeName}</strong>,` : 'Hola,'} hemos recibido tu consulta correctamente. Nuestro equipo de atención al cliente la revisará y te responderá en un plazo máximo de <strong>24 a 48 horas laborables</strong>.
    </p>
    <p style="margin:0 0 8px 0;font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:2px;color:#8E8A80;text-transform:uppercase;">
      COPIA DE TU MENSAJE
    </p>
    <div style="background-color:#161513;border-left:3px solid #C8B89A;padding:16px;color:#EAE5D9;font-size:13px;line-height:1.6;">
      ${safeMessage}
    </div>
  `

  const html = renderEmailShell({
    preheader: 'Hemos recibido tu mensaje en STENCIL2. Te responderemos pronto.',
    eyebrow: 'ATENCIÓN AL CLIENTE',
    title: 'Hemos recibido tu mensaje',
    bodyHtml,
  })

  const text = [
    'HEMOS RECIBIDO TU MENSAJE — STENCIL2',
    '====================================',
    'Gracias por contactar con STENCIL2. Nuestro equipo te responderá en un plazo máximo de 24 a 48 horas laborables.',
    '',
    'Copia de tu mensaje:',
    payload.message,
    '',
    `Web oficial: ${getAppUrl()}`,
  ].join('\n')

  return dispatchEmail({
    to: payload.email,
    replyTo: DEFAULT_REPLY_TO,
    subject: 'Hemos recibido tu mensaje — STENCIL2',
    html,
    text,
    idempotencyKey: `contact-autoreply-${keySuffix}`,
  })
}

export interface DistributorEmailPayload {
  id?: string
  email: string
  companyName?: string
  phone?: string
  notes?: string
}

export async function sendDistributorAlert(
  payload: DistributorEmailPayload
): Promise<EmailSendResult> {
  const safeEmail = escapeHtml(payload.email)
  const safeCompany = escapeHtml(payload.companyName || 'No especificada')
  const safePhone = escapeHtml(payload.phone || 'No especificado')
  const safeNotes = payload.notes
    ? escapeHtml(payload.notes).replace(/\r?\n/g, '<br />')
    : 'Sin notas adicionales'
  const keySuffix = payload.id || shortHash(`distributor:${payload.email}`)

  const bodyHtml = `
    <p style="margin:0 0 16px 0;color:#EAE5D9;">
      Se ha registrado una nueva solicitud para ser <strong>Distribuidor Oficial B2B</strong> de STENCIL2:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#0D0D0C;border:1px solid #262420;padding:16px;margin-bottom:16px;">
      <tr>
        <td style="padding:4px 0;color:#8E8A80;font-size:12px;">Email:</td>
        <td style="padding:4px 0;color:#C8B89A;font-size:13px;"><a href="mailto:${safeEmail}" style="color:#C8B89A;text-decoration:underline;">${safeEmail}</a></td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#8E8A80;font-size:12px;">Empresa / Óptica:</td>
        <td style="padding:4px 0;color:#F5F2EB;font-size:13px;font-weight:600;">${safeCompany}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#8E8A80;font-size:12px;">Teléfono:</td>
        <td style="padding:4px 0;color:#F5F2EB;font-size:13px;">${safePhone}</td>
      </tr>
    </table>
    <div style="background-color:#161513;border-left:3px solid #C8B89A;padding:16px;color:#EAE5D9;font-size:13px;line-height:1.6;">
      ${safeNotes}
    </div>
  `

  const html = renderEmailShell({
    preheader: `Nueva solicitud de distribuidor B2B: ${payload.companyName || payload.email}`,
    eyebrow: 'B2B · DISTRIBUIDORES',
    title: 'Nueva solicitud de Distribuidor Oficial',
    bodyHtml,
  })

  const text = [
    'NUEVA SOLICITUD DE DISTRIBUIDOR B2B — STENCIL2',
    '==============================================',
    `Email: ${payload.email}`,
    `Empresa: ${payload.companyName || 'No especificada'}`,
    `Teléfono: ${payload.phone || 'No especificado'}`,
    '',
    'Notas:',
    payload.notes || 'Sin notas adicionales',
  ].join('\n')

  return dispatchEmail({
    to: getEmailAdminTo(),
    replyTo: payload.email,
    subject: `[DISTRIBUIDOR B2B] Solicitud de ${payload.companyName || payload.email}`,
    html,
    text,
    idempotencyKey: `distributor-alert-${keySuffix}`,
  })
}

export async function sendNewsletterWelcome(
  email: string,
  promoCode: string
): Promise<EmailSendResult> {
  const normalized = email.trim().toLowerCase()
  const safeCode = escapeHtml(promoCode)
  const appUrl = escapeHtml(getAppUrl())
  const unsubscribeUrl = buildUnsubscribeUrl(normalized)
  const safeUnsubscribeUrl = escapeHtml(unsubscribeUrl)

  const bodyHtml = `
    <p style="margin:0 0 16px 0;color:#EAE5D9;">
      Bienvenido a la comunidad de <strong>STENCIL2</strong>. A partir de ahora tendrás acceso anticipado a nuestros lanzamientos de edición limitada y colecciones urbanas.
    </p>
    <p style="margin:0 0 12px 0;color:#EAE5D9;">
      Como regalo de bienvenida, aquí tienes tu código de <strong>10% de descuento</strong> para tu primer pedido:
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:20px 0;background-color:#0B0B0A;border:1px dashed #C8B89A;padding:20px;text-align:center;">
      <tr>
        <td align="center">
          <span style="display:block;font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:2.5px;color:#8E8A80;text-transform:uppercase;margin-bottom:6px;">
            CÓDIGO PROMOCIONAL
          </span>
          <span style="font-family:'Courier New',Courier,monospace;font-size:24px;font-weight:700;letter-spacing:4px;color:#F5F2EB;">
            ${safeCode}
          </span>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 24px 0;color:#B8B2A6;font-size:13px;">
      Introdúcelo en tu carrito antes de finalizar la compra. Recuerda que tienes <strong>envío gratuito en pedidos a partir de 50 €</strong>.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="background-color:#F5F2EB;">
          <a href="${appUrl}/tienda" style="display:inline-block;padding:14px 28px;font-family:'Courier New',Courier,monospace;font-size:12px;font-weight:700;letter-spacing:2px;color:#080808;text-decoration:none;text-transform:uppercase;">
            EXPLORAR COLECCIÓN
          </a>
        </td>
      </tr>
    </table>
  `

  const footerExtraHtml = `
    <p style="margin:0 0 12px 0;color:#757168;font-size:11px;">
      Recibes este correo porque te has suscrito al club STENCIL2 en nuestra web. Si no deseas recibir más comunicaciones comerciales, puedes <a href="${safeUnsubscribeUrl}" style="color:#B8B2A6;text-decoration:underline;">darte de baja aquí con un clic</a>.
    </p>
  `

  const html = renderEmailShell({
    preheader: `Tu código de 10% de descuento en STENCIL2: ${promoCode}`,
    eyebrow: 'COMUNIDAD STENCIL2',
    title: 'Bienvenido a JOINING CULTURE',
    bodyHtml,
    footerExtraHtml,
  })

  const text = [
    'BIENVENIDO A STENCIL2 — JOINING CULTURE',
    '=======================================',
    'Gracias por unirte a la comunidad de STENCIL2.',
    '',
    `Tu código de 10% de descuento para tu primer pedido: ${promoCode}`,
    '',
    `Explora la colección en: ${getAppUrl()}/tienda`,
    '',
    `Para darte de baja de nuestras comunicaciones: ${unsubscribeUrl}`,
  ].join('\n')

  return dispatchEmail({
    to: normalized,
    replyTo: DEFAULT_REPLY_TO,
    subject: `Bienvenido a STENCIL2 — Tu código 10% OFF (${promoCode})`,
    html,
    text,
    idempotencyKey: `newsletter-welcome-${normalized}`,
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
    },
  })
}
