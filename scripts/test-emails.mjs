// Script local de prueba de correos transaccionales y flujos E2E (sin exponer rutas públicas).
// Uso:
//   npm run email:test                       -> Envía 1 correo de prueba directo con Resend a EMAIL_ADMIN_TO
//   node scripts/test-emails.mjs --to=a@b.es -> Envía correo de prueba al destinatario indicado
//   node scripts/test-emails.mjs --e2e       -> Prueba E2E completa (arranca servidor local si no está activo, prueba contacto, distribuidor, newsletter, baja HMAC, webhook Stripe firmado + reintento idempotente y limpia registros de prueba)

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawn } from 'node:child_process'
import { Resend } from 'resend'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) continue
    const key = line.slice(0, eqIdx).trim()
    let val = line.slice(eqIdx + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) {
      process.env[key] = val
    }
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env.local'))
loadEnvFile(path.resolve(process.cwd(), '.env'))

const args = process.argv.slice(2)
const isE2E = args.includes('--e2e')
const shouldCleanup = !args.includes('--no-cleanup')
const toArg = args.find((a) => a.startsWith('--to='))?.split('=')[1]
const urlArg = args.find((a) => a.startsWith('--url='))?.split('=')[1]

const EMAIL_FROM = process.env.EMAIL_FROM?.trim() || 'STENCIL2 <pedidos@stencil2.com>'
const EMAIL_ADMIN_TO = toArg || process.env.EMAIL_ADMIN_TO?.trim() || 'pedidos@stencil2.com'
const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim()

async function runDirectSmokeTest() {
  if (!RESEND_API_KEY) {
    console.error(
      '[email:test] RESEND_API_KEY está vacía en .env.local. Guarda tu clave en .env.local y vuelve a ejecutar.'
    )
    process.exit(1)
  }

  const resend = new Resend(RESEND_API_KEY)
  const idempotencyKey = `test-smoke-${Date.now()}`

  console.log(`Enviando correo de prueba desde "${EMAIL_FROM}" hacia "${EMAIL_ADMIN_TO}"...`)
  const { data, error } = await resend.emails.send(
    {
      from: EMAIL_FROM,
      to: EMAIL_ADMIN_TO,
      replyTo: 'pedidos@stencil2.com',
      subject: '[TEST] Verificación de correo transaccional — STENCIL2',
      html: `<div style="background:#080808;color:#F5F2EB;padding:28px;font-family:sans-serif;border:1px solid #262420;">
        <p style="color:#C4822A;font-family:monospace;letter-spacing:2px;font-size:11px;margin:0 0 8px;">STENCIL2 · DIAGNÓSTICO RESEND</p>
        <h2 style="margin:0 0 12px;color:#F5F2EB;">Configuración de correo operativa</h2>
        <p style="color:#B8B2A6;font-size:14px;line-height:1.5;margin:0;">Este es un correo de prueba enviado desde el script CLI protegido <code>scripts/test-emails.mjs</code>.</p>
      </div>`,
      text: 'STENCIL2 — Diagnóstico Resend: Configuración de correo operativa.',
    },
    { idempotencyKey }
  )

  if (error) {
    console.error('[email:test] Error devuelto por Resend:', error)
    process.exit(1)
  }

  console.log(`[email:test] OK — Correo enviado con ID: ${data?.id}`)
}

const LOCAL_TEST_UNSUB_SECRET =
  process.env.UNSUBSCRIBE_SECRET?.trim() || 'stencil2-dev-unsubscribe-secret-local-only'

function createUnsubscribeTokenLocal(email) {
  return crypto
    .createHmac('sha256', LOCAL_TEST_UNSUB_SECRET)
    .update(`unsubscribe:${email.trim().toLowerCase()}`)
    .digest('hex')
}

async function isServerReachable(baseUrl) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(`${baseUrl}/api/products`, { signal: controller.signal })
    clearTimeout(timer)
    return res.ok
  } catch {
    return false
  }
}

async function ensureLocalServer() {
  if (urlArg) {
    return { baseUrl: urlArg.replace(/\/+$/, ''), stop: async () => {} }
  }
  if (await isServerReachable('http://localhost:3000')) {
    return { baseUrl: 'http://localhost:3000', stop: async () => {} }
  }

  const port = 3099
  const baseUrl = `http://localhost:${port}`
  const nextBin = path.resolve(process.cwd(), 'node_modules/next/dist/bin/next')
  console.log(`Arrancando servidor Next.js temporal en ${baseUrl}...`)

  const child = spawn(process.execPath, [nextBin, 'start', '-p', String(port)], {
    env: {
      ...process.env,
      NODE_ENV: 'production',
      UNSUBSCRIBE_SECRET: LOCAL_TEST_UNSUB_SECRET,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  child.stderr.on('data', (chunk) => {
    const text = chunk.toString().trim()
    if (text) console.log(`   [server] ${text}`)
  })

  for (let i = 0; i < 30; i++) {
    if (await isServerReachable(baseUrl)) {
      return {
        baseUrl,
        stop: async () => {
          child.kill()
        },
      }
    }
    await new Promise((r) => setTimeout(r, 500))
  }

  child.kill()
  throw new Error('No se pudo arrancar el servidor Next.js temporal en el puerto 3099')
}

async function runE2ETests() {
  const server = await ensureLocalServer()
  const BASE_URL = server.baseUrl

  try {
    console.log(`=== Iniciando verificación E2E contra ${BASE_URL} ===`)
    console.log(
      `RESEND_API_KEY configurada: ${RESEND_API_KEY ? `SÍ (${RESEND_API_KEY.slice(0, 6)}...)` : 'NO (vacía en .env.local)'}`
    )

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabase =
      supabaseUrl && supabaseKey
        ? createClient(supabaseUrl, supabaseKey, {
            auth: { autoRefreshToken: false, persistSession: false },
          })
        : null

    const testEmail = EMAIL_ADMIN_TO
    const testNewsletterEmail = `test.newsletter.${Date.now()}@stencil2.com`
    const testOrderNum = `S2-TEST-${Date.now().toString().slice(-6)}`
    const testPiId = `pi_test_${Date.now()}`

    // 1. Flujo de Contacto (Soporte)
    console.log('\n1) Probando POST /api/contacto (Soporte)...')
    const contactRes = await fetch(`${BASE_URL}/api/contacto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'support',
        email: testEmail,
        name: 'Prueba E2E Soporte',
        message: 'Hola, este es un mensaje de prueba E2E con <script>alert(1)</script> escapado.',
        privacyAccepted: true,
      }),
    })
    const contactJson = await contactRes.json()
    console.log(`   Status: ${contactRes.status}`, contactJson)

    // 2. Flujo de Distribuidor B2B
    console.log('\n2) Probando POST /api/contacto (Distribuidor B2B)...')
    const distRes = await fetch(`${BASE_URL}/api/contacto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'distributor',
        email: testEmail,
        companyName: 'Óptica Test E2E S.L.',
        phone: '+34 600 000 000',
        notes: 'Interesados en distribuir la colección en Madrid.',
        privacyAccepted: true,
      }),
    })
    const distJson = await distRes.json()
    console.log(`   Status: ${distRes.status}`, distJson)

    // 3. Flujo de Newsletter + Baja firmada + Bloqueo de reactivación automática
    if (supabase) {
      await supabase.from('newsletter_subscribers').delete().eq('email', testEmail)
    }
    console.log(`\n3) Probando POST /api/newsletter (${testEmail})...`)
    const newsRes = await fetch(`${BASE_URL}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        source: 'e2e-test',
        confirmReactivate: true,
      }),
    })
    const newsJson = await newsRes.json()
    console.log(`   Status: ${newsRes.status}`, newsJson)

    console.log(
      `\n3b) Probando ciclo de suscripción + baja HMAC + bloqueo de reactivación con ${testNewsletterEmail}...`
    )
    await fetch(`${BASE_URL}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testNewsletterEmail, source: 'e2e-cycle' }),
    })
    const token = createUnsubscribeTokenLocal(testNewsletterEmail)
    const unsubRes = await fetch(
      `${BASE_URL}/api/newsletter/baja?email=${encodeURIComponent(testNewsletterEmail)}&token=${encodeURIComponent(token)}`,
      { headers: { Accept: 'application/json' } }
    )
    const unsubJson = await unsubRes.json()
    console.log(`   Baja GET /api/newsletter/baja -> Status: ${unsubRes.status}`, unsubJson)

    const reactivateAttempt = await fetch(`${BASE_URL}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testNewsletterEmail, source: 'e2e-cycle' }),
    })
    const reactivateJson = await reactivateAttempt.json()
    console.log(
      `   Re-suscripción sin confirmación -> Status: ${reactivateAttempt.status} (esperado 409):`,
      reactivateJson
    )

    // 4. Flujo de Webhook Stripe firmado + Reintento idempotente
    console.log(`\n4) Probando POST /api/webhooks/stripe con pedido ${testOrderNum}...`)
    const orderCreateRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: testOrderNum,
        stripeId: testPiId,
        items: [
          {
            id: 'onyx-black',
            code: 'GLT6642-C1',
            name: 'IBZEN -SOIRESNAES',
            slug: 'ibzen-soires-naes',
            price: 49,
            colorLabel: 'Carey Ambar',
            quantity: 1,
          },
        ],
        shippingAddress: {
          name: 'Cliente Prueba E2E',
          address: 'Calle Gran Vía 1',
          city: 'Madrid',
          postalCode: '28013',
          email: testEmail,
          phone: '+34 600 123 456',
        },
      }),
    })
    const orderCreateJson = await orderCreateRes.json()
    console.log(`   Pre-registro /api/orders -> Status: ${orderCreateRes.status}`, orderCreateJson)

    const stripePayloadObj = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      api_version: '2024-12-18.acacia',
      created: Math.floor(Date.now() / 1000),
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: testPiId,
          object: 'payment_intent',
          amount: 4900,
          currency: 'eur',
          status: 'succeeded',
          receipt_email: testEmail,
          metadata: {
            orderId: testOrderNum,
            customerName: 'Cliente Prueba E2E',
            customerEmail: testEmail,
            promoCode: 'NONE',
            subtotal: '49.00',
            discount: '0.00',
            taxableBase: '40.50',
            tax: '8.50',
            shipping: '0.00',
            total: '49.00',
            pointsEarned: '49',
          },
        },
      },
    }

    const payloadString = JSON.stringify(stripePayloadObj)
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')
    const signature = webhookSecret
      ? stripe.webhooks.generateTestHeaderString({
          payload: payloadString,
          secret: webhookSecret,
        })
      : ''

    const whRes1 = await fetch(`${BASE_URL}/api/webhooks/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(signature ? { 'stripe-signature': signature } : {}),
      },
      body: payloadString,
    })
    const whJson1 = await whRes1.json()
    console.log(`   1ª entrega webhook -> Status: ${whRes1.status}`, whJson1)

    const whRes2 = await fetch(`${BASE_URL}/api/webhooks/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(signature ? { 'stripe-signature': signature } : {}),
      },
      body: payloadString,
    })
    const whJson2 = await whRes2.json()
    console.log(`   2ª entrega (reintento idempotente) -> Status: ${whRes2.status}`, whJson2)

    if (shouldCleanup && supabase) {
      console.log('\nLimpiando registros temporales de prueba en Supabase...')
      if (contactJson?.id) {
        await supabase.from('contact_messages').delete().eq('id', contactJson.id)
      }
      if (distJson?.id) {
        await supabase.from('distributor_leads').delete().eq('id', distJson.id)
      }
      await supabase.from('newsletter_subscribers').delete().eq('email', testNewsletterEmail)
      await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('email', testEmail)
        .eq('source', 'e2e-test')
      const { data: ord } = await supabase
        .from('orders')
        .select('id')
        .eq('order_number', testOrderNum)
        .maybeSingle()
      if (ord?.id) {
        await supabase.from('loyalty_transactions').delete().eq('order_id', ord.id)
        await supabase.from('order_items').delete().eq('order_id', ord.id)
        await supabase.from('orders').delete().eq('id', ord.id)
      }
      console.log('Limpieza completada.')
    }
  } finally {
    await server.stop()
  }
}

if (isE2E) {
  runE2ETests().catch((err) => {
    console.error('[email:test --e2e] Error:', err)
    process.exit(1)
  })
} else {
  runDirectSmokeTest().catch((err) => {
    console.error('[email:test] Error:', err)
    process.exit(1)
  })
}
