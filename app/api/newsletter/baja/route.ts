import { NextResponse } from 'next/server'
import { unsubscribeNewsletterInDb } from '@/lib/db'
import { escapeHtml, getAppUrl, verifyUnsubscribeToken } from '@/lib/email'
import { isValidEmail, normalizeEmail } from '@/lib/security'

export const dynamic = 'force-dynamic'

function renderUnsubscribePage(options: {
  title: string
  message: string
  isError?: boolean
  status: number
}): Response {
  const appUrl = escapeHtml(getAppUrl())
  const title = escapeHtml(options.title)
  const message = escapeHtml(options.message)
  const accentColor = options.isError ? '#CC0000' : '#C4822A'

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — STENCIL2</title>
</head>
<body style="margin:0;padding:0;background-color:#080808;color:#F5F2EB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:520px;background-color:#111111;border:1px solid #262420;padding:36px 32px;text-align:left;">
          <tr>
            <td>
              <p style="margin:0 0 10px 0;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:3px;color:${accentColor};text-transform:uppercase;">
                STENCIL2 · COMUNICACIONES
              </p>
              <h1 style="margin:0 0 16px 0;font-size:24px;color:#F5F2EB;line-height:1.25;">
                ${title}
              </h1>
              <p style="margin:0 0 28px 0;font-size:14px;color:#B8B2A6;line-height:1.6;">
                ${message}
              </p>
              <a href="${appUrl}" style="display:inline-block;padding:12px 24px;background-color:#F5F2EB;color:#080808;font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;letter-spacing:2px;text-decoration:none;text-transform:uppercase;">
                VOLVER A STENCIL2
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return new Response(html, {
    status: options.status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

async function handleUnsubscribe(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const rawEmail = searchParams.get('email') || ''
  const rawToken = searchParams.get('token') || ''
  const wantsJson =
    (req.headers.get('accept') || '').includes('application/json') &&
    !(req.headers.get('accept') || '').includes('text/html')

  if (!isValidEmail(rawEmail) || !rawToken) {
    if (wantsJson) {
      return NextResponse.json({ error: 'Enlace de baja incompleto o inválido' }, { status: 400 })
    }
    return renderUnsubscribePage({
      title: 'Enlace de baja no válido',
      message:
        'El enlace que has utilizado está incompleto o no es válido. Si deseas darte de baja, escríbenos a pedidos@stencil2.com.',
      isError: true,
      status: 400,
    })
  }

  const normalized = normalizeEmail(rawEmail)

  if (!verifyUnsubscribeToken(normalized, rawToken)) {
    if (wantsJson) {
      return NextResponse.json({ error: 'Firma de baja inválida' }, { status: 403 })
    }
    return renderUnsubscribePage({
      title: 'Firma de seguridad no válida',
      message:
        'No hemos podido verificar la firma de este enlace de baja. Puedes solicitar la baja escribiendo directamente a pedidos@stencil2.com.',
      isError: true,
      status: 403,
    })
  }

  const result = await unsubscribeNewsletterInDb(normalized)
  if (!result.ok || !result.persisted) {
    if (wantsJson) {
      return NextResponse.json(
        { error: 'No se pudo procesar la baja en este momento' },
        { status: 500 }
      )
    }
    return renderUnsubscribePage({
      title: 'No se pudo completar la baja',
      message:
        'Ha ocurrido un problema temporal al actualizar tu preferencia. Por favor, inténtalo de nuevo en unos minutos o escríbenos a pedidos@stencil2.com.',
      isError: true,
      status: 500,
    })
  }

  if (wantsJson) {
    return NextResponse.json({ ok: true, email: normalized, is_active: false })
  }

  return renderUnsubscribePage({
    title: 'Te has dado de baja correctamente',
    message: `Hemos desactivado el envío de comunicaciones comerciales para ${normalized}. No volverás a recibir correos del newsletter a menos que confirmes expresamente tu reactivación en nuestra web.`,
    status: 200,
  })
}

export async function GET(req: Request) {
  return handleUnsubscribe(req)
}

export async function POST(req: Request) {
  return handleUnsubscribe(req)
}
