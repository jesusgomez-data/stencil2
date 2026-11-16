import { NextResponse } from 'next/server'
import {
  getProfileByEmailFromDb,
  upsertProfileInDb,
  getOrdersByEmailFromDb,
  redeemLoyaltyPointsInDb,
} from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Correo electrónico inválido' },
        { status: 400 }
      )
    }

    const [profile, ordersResult] = await Promise.all([
      getProfileByEmailFromDb(email),
      getOrdersByEmailFromDb(email),
    ])

    return NextResponse.json({
      profile,
      loyaltyPoints: profile?.loyalty_points ?? null,
      orders: ordersResult.orders,
      source: profile || ordersResult.source === 'supabase' ? 'supabase' : 'fallback',
    })
  } catch (error: any) {
    console.error('[API /cuenta GET] Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Error al cargar los datos de cuenta' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, email } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Se requiere un correo electrónico válido' },
        { status: 400 }
      )
    }

    if (action === 'update_profile') {
      const { fullName, name, phone, defaultShippingAddress } = body
      const result = await upsertProfileInDb({
        email,
        fullName: fullName ?? name ?? null,
        phone: phone ?? null,
        defaultShippingAddress,
      })

      return NextResponse.json({
        ok: true,
        profile: result.profile,
        persisted: result.persisted,
      })
    }

    if (action === 'redeem_points') {
      const pointsNeeded = Number(body.pointsNeeded)
      const rewardCode = String(body.code || body.rewardCode || '').trim().toUpperCase()

      if (!Number.isFinite(pointsNeeded) || pointsNeeded <= 0 || !rewardCode) {
        return NextResponse.json(
          { error: 'Datos de canje inválidos' },
          { status: 400 }
        )
      }

      const result = await redeemLoyaltyPointsInDb(email, pointsNeeded, rewardCode)
      if (!result.ok && result.persisted) {
        return NextResponse.json(
          { error: result.error || 'Puntos insuficientes' },
          { status: 400 }
        )
      }

      return NextResponse.json({
        ok: true,
        loyaltyPoints: result.loyaltyPoints,
        code: rewardCode,
        persisted: result.persisted,
      })
    }

    return NextResponse.json(
      { error: 'Acción no reconocida' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('[API /cuenta POST] Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Error interno en cuenta' },
      { status: 500 }
    )
  }
}
