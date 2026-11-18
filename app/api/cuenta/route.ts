import { NextResponse } from 'next/server'
import { getProfileByEmailFromDb } from '@/lib/db'

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

    // Seguridad (RGPD): sin login no se puede verificar que el email pertenece a
    // quien hace la petición, así que no se devuelven datos personales ni pedidos.
    // Solo el saldo de puntos. Cuando exista login (Supabase Auth) se ampliará.
    const profile = await getProfileByEmailFromDb(email)

    return NextResponse.json({
      profile: null,
      loyaltyPoints: profile?.loyalty_points ?? null,
      orders: [],
      source: profile ? 'supabase' : 'fallback',
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

    // Seguridad: sin login, cualquiera podría modificar el perfil o gastar los
    // puntos de otra persona conociendo solo su email. Desactivado en servidor
    // hasta implementar Supabase Auth; la página mantiene el guardado local.
    if (action === 'update_profile' || action === 'redeem_points') {
      return NextResponse.json(
        { error: 'Requiere iniciar sesión (próximamente)' },
        { status: 403 }
      )
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
