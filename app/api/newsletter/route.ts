import { NextResponse } from 'next/server'
import { subscribeNewsletterInDb } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, source } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Introduce un correo electrónico válido' },
        { status: 400 }
      )
    }

    const result = await subscribeNewsletterInDb(email, source || 'footer')

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error || 'No se pudo completar la suscripción' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      ok: true,
      promoCode: result.promoCode,
      persisted: result.persisted,
      alreadySubscribed: result.alreadySubscribed ?? false,
    })
  } catch (error: any) {
    console.error('[API /newsletter POST] Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Error al suscribirse al newsletter' },
      { status: 500 }
    )
  }
}
