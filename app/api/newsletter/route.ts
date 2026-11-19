import { NextResponse } from 'next/server'
import { subscribeNewsletterInDb } from '@/lib/db'
import { sendNewsletterWelcome } from '@/lib/email'
import {
  checkRateLimit,
  isHoneypotTriggered,
  isValidEmail,
  normalizeEmail,
} from '@/lib/security'

export async function POST(req: Request) {
  try {
    const rate = checkRateLimit(req, {
      namespace: 'api-newsletter',
      limit: 6,
      windowMs: 10 * 60 * 1000,
    })

    if (!rate.allowed) {
      return NextResponse.json(
        {
          error:
            'Demasiados intentos seguidos. Por favor, espera unos minutos antes de volver a intentarlo.',
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rate.retryAfterSeconds) },
        }
      )
    }

    const body = await req.json()

    // Honeypot anti-bots
    if (isHoneypotTriggered(body)) {
      console.warn('[API /newsletter] Honeypot activado; solicitud descartada silenciosamente.')
      return NextResponse.json({
        ok: true,
        promoCode: 'S2-WELCOME10',
        persisted: true,
        alreadySubscribed: false,
      })
    }

    const { email, source, confirmReactivate } = body || {}

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Introduce un correo electrónico válido (máx. 254 caracteres)' },
        { status: 400 }
      )
    }

    const normalizedEmail = normalizeEmail(email)
    const safeSource =
      typeof source === 'string' && source.trim().length <= 40 ? source.trim() : 'footer'

    const result = await subscribeNewsletterInDb(normalizedEmail, safeSource, {
      confirmReactivate: confirmReactivate === true,
    })

    if (!result.ok || !result.persisted) {
      if (result.requiresConfirmation) {
        return NextResponse.json(
          {
            error:
              result.error ||
              'Este correo se dio de baja anteriormente. Confirma si deseas reactivar tu suscripción.',
            requiresConfirmation: true,
          },
          { status: 409 }
        )
      }

      const status = result.status || 500
      return NextResponse.json(
        {
          error:
            status === 400
              ? result.error || 'Correo electrónico inválido'
              : 'No se pudo completar la suscripción en este momento. Inténtalo más tarde.',
        },
        { status }
      )
    }

    let emailSent = false
    if (!result.alreadySubscribed) {
      const emailRes = await sendNewsletterWelcome(normalizedEmail, result.promoCode)
      emailSent = emailRes.ok
      if (!emailRes.ok) {
        console.error(
          '[API /newsletter] Suscriptor guardado, pero falló el envío del correo de bienvenida:',
          emailRes.error
        )
      }
    }

    return NextResponse.json({
      ok: true,
      promoCode: result.promoCode,
      persisted: true,
      alreadySubscribed: result.alreadySubscribed ?? false,
      emailSent,
    })
  } catch (error) {
    console.error('[API /newsletter POST] Error inesperado:', error)
    return NextResponse.json(
      { error: 'No se pudo procesar tu suscripción en este momento. Inténtalo más tarde.' },
      { status: 500 }
    )
  }
}
