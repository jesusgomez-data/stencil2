import { NextResponse } from 'next/server'
import { createContactMessageInDb, createDistributorLeadInDb } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, email, name, message, companyName, phone, notes, privacyAccepted } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Introduce un correo electrónico válido' },
        { status: 400 }
      )
    }

    if (!privacyAccepted) {
      return NextResponse.json(
        { error: 'Debes aceptar la Política de Privacidad' },
        { status: 400 }
      )
    }

    if (type === 'distributor') {
      const result = await createDistributorLeadInDb({
        email,
        companyName,
        phone,
        notes,
        privacyAccepted: Boolean(privacyAccepted),
      })

      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }

      return NextResponse.json({
        ok: true,
        persisted: result.persisted,
        id: result.id,
      })
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'El mensaje es obligatorio' },
        { status: 400 }
      )
    }

    const result = await createContactMessageInDb({
      email,
      name,
      message,
      privacyAccepted: Boolean(privacyAccepted),
    })

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      persisted: result.persisted,
      id: result.id,
    })
  } catch (error: any) {
    console.error('[API /contacto POST] Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Error al enviar el formulario' },
      { status: 500 }
    )
  }
}
