import { NextResponse } from 'next/server'
import { createContactMessageInDb, createDistributorLeadInDb } from '@/lib/db'
import {
  sendContactAlert,
  sendContactAutoreply,
  sendDistributorAlert,
} from '@/lib/email'
import {
  checkRateLimit,
  FIELD_LIMITS,
  isHoneypotTriggered,
  isValidEmail,
  normalizeEmail,
  validateOptionalText,
} from '@/lib/security'

export async function POST(req: Request) {
  try {
    const rate = checkRateLimit(req, {
      namespace: 'api-contacto',
      limit: 6,
      windowMs: 10 * 60 * 1000,
    })

    if (!rate.allowed) {
      return NextResponse.json(
        {
          error:
            'Has enviado demasiadas solicitudes seguidas. Por favor, espera unos minutos antes de intentarlo de nuevo.',
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rate.retryAfterSeconds) },
        }
      )
    }

    const body = await req.json()

    // Honeypot anti-bots: si el campo oculto viene relleno, respondemos 200 sin guardar ni enviar correo
    if (isHoneypotTriggered(body)) {
      console.warn('[API /contacto] Honeypot activado; solicitud descartada silenciosamente.')
      return NextResponse.json({ ok: true, persisted: true })
    }

    const { type, email, name, message, companyName, phone, notes, privacyAccepted } = body || {}

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Introduce un correo electrónico válido (máx. 254 caracteres)' },
        { status: 400 }
      )
    }

    if (privacyAccepted !== true) {
      return NextResponse.json(
        { error: 'Debes aceptar la Política de Privacidad' },
        { status: 400 }
      )
    }

    const normalizedEmail = normalizeEmail(email)

    if (type === 'distributor') {
      const companyCheck = validateOptionalText(companyName, FIELD_LIMITS.companyName)
      if (!companyCheck.valid) {
        return NextResponse.json(
          { error: `El nombre de empresa no puede superar ${FIELD_LIMITS.companyName} caracteres` },
          { status: 400 }
        )
      }

      const phoneCheck = validateOptionalText(phone, FIELD_LIMITS.phone)
      if (!phoneCheck.valid) {
        return NextResponse.json(
          { error: `El teléfono no puede superar ${FIELD_LIMITS.phone} caracteres` },
          { status: 400 }
        )
      }

      const notesCheck = validateOptionalText(notes, FIELD_LIMITS.notes)
      if (!notesCheck.valid) {
        return NextResponse.json(
          { error: `Las notas no pueden superar ${FIELD_LIMITS.notes} caracteres` },
          { status: 400 }
        )
      }

      const result = await createDistributorLeadInDb({
        email: normalizedEmail,
        companyName: companyCheck.cleaned,
        phone: phoneCheck.cleaned,
        notes: notesCheck.cleaned,
        privacyAccepted: true,
      })

      if (!result.ok || !result.persisted) {
        const status = result.status || 500
        return NextResponse.json(
          {
            error:
              status === 400
                ? result.error || 'Datos de solicitud inválidos'
                : 'No se pudo registrar tu solicitud en este momento. Inténtalo de nuevo más tarde.',
          },
          { status }
        )
      }

      const emailRes = await sendDistributorAlert({
        id: result.id,
        email: normalizedEmail,
        companyName: companyCheck.cleaned,
        phone: phoneCheck.cleaned,
        notes: notesCheck.cleaned,
      })

      if (!emailRes.ok) {
        console.error('[API /contacto] Error enviando aviso de distribuidor:', emailRes.error)
      }

      return NextResponse.json({
        ok: true,
        persisted: true,
        id: result.id,
        emailSent: emailRes.ok,
      })
    }

    const nameCheck = validateOptionalText(name, FIELD_LIMITS.name)
    if (!nameCheck.valid) {
      return NextResponse.json(
        { error: `El nombre no puede superar ${FIELD_LIMITS.name} caracteres` },
        { status: 400 }
      )
    }

    if (typeof message !== 'string') {
      return NextResponse.json({ error: 'El mensaje es obligatorio' }, { status: 400 })
    }

    const cleanMessage = message.trim()
    if (cleanMessage.length < FIELD_LIMITS.messageMin) {
      return NextResponse.json(
        { error: `El mensaje debe tener al menos ${FIELD_LIMITS.messageMin} caracteres` },
        { status: 400 }
      )
    }
    if (cleanMessage.length > FIELD_LIMITS.messageMax) {
      return NextResponse.json(
        { error: `El mensaje no puede superar ${FIELD_LIMITS.messageMax} caracteres` },
        { status: 400 }
      )
    }

    const result = await createContactMessageInDb({
      email: normalizedEmail,
      name: nameCheck.cleaned,
      message: cleanMessage,
      privacyAccepted: true,
    })

    if (!result.ok || !result.persisted) {
      const status = result.status || 500
      return NextResponse.json(
        {
          error:
            status === 400
              ? result.error || 'Datos del formulario inválidos'
              : 'No se pudo enviar tu mensaje en este momento. Inténtalo de nuevo más tarde.',
        },
        { status }
      )
    }

    const [alertRes, autoreplyRes] = await Promise.all([
      sendContactAlert({
        id: result.id,
        email: normalizedEmail,
        name: nameCheck.cleaned,
        message: cleanMessage,
      }),
      sendContactAutoreply({
        id: result.id,
        email: normalizedEmail,
        name: nameCheck.cleaned,
        message: cleanMessage,
      }),
    ])

    if (!alertRes.ok) {
      console.error('[API /contacto] Error enviando aviso interno de contacto:', alertRes.error)
    }
    if (!autoreplyRes.ok) {
      console.error('[API /contacto] Error enviando autorrespuesta de contacto:', autoreplyRes.error)
    }

    return NextResponse.json({
      ok: true,
      persisted: true,
      id: result.id,
      emailSent: alertRes.ok && autoreplyRes.ok,
    })
  } catch (error) {
    console.error('[API /contacto POST] Error inesperado:', error)
    return NextResponse.json(
      { error: 'No se pudo procesar tu solicitud en este momento. Inténtalo más tarde.' },
      { status: 500 }
    )
  }
}
