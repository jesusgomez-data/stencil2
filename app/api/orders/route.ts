import { NextResponse } from 'next/server'
import { createOrderInDb, orderExistsInDb } from '@/lib/db'
import { calculateCartTotals } from '@/lib/pricing'
import { getProductById, getProductBySlug } from '@/lib/products'
import { FIELD_LIMITS, isValidEmail, normalizeEmail } from '@/lib/security'
import type { OrderItemJson } from '@/types/database'

// Seguridad (RGPD): listar pedidos por email sin login expone datos personales
// de terceros. Desactivado hasta implementar Supabase Auth.
export async function GET() {
  return NextResponse.json(
    { error: 'Requiere iniciar sesión (próximamente)' },
    { status: 403 }
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      orderNumber,
      id,
      items,
      shippingAddress,
      promoCode,
      stripeId,
    } = body || {}

    const rawOrderNum = String(
      orderNumber || id || `S2-ORD-${Math.floor(100000 + Math.random() * 900000)}`
    ).trim()

    if (rawOrderNum.length > FIELD_LIMITS.orderNumber) {
      return NextResponse.json({ error: 'Número de pedido inválido' }, { status: 400 })
    }

    // Seguridad: este endpoint es público. Si el pedido ya existe (lo pre-registra
    // create-payment-intent), no se modifica. El estado 'paid' y los puntos solo
    // los asigna el webhook firmado de Stripe.
    if (await orderExistsInDb(rawOrderNum)) {
      return NextResponse.json({ ok: true, orderNumber: rawOrderNum, persisted: true })
    }

    const customerEmail = shippingAddress?.email || body?.customerEmail

    if (!isValidEmail(customerEmail)) {
      return NextResponse.json(
        { error: 'Correo electrónico del cliente válido requerido' },
        { status: 400 }
      )
    }

    const normalizedEmail = normalizeEmail(customerEmail)
    const rawName = String(shippingAddress?.name || body?.customerName || '').trim()
    const rawPhone = String(shippingAddress?.phone || body?.customerPhone || '').trim()
    const rawAddress = String(shippingAddress?.address || '').trim()
    const rawCity = String(shippingAddress?.city || '').trim()
    const rawPostal = String(shippingAddress?.postalCode || '').trim()

    if (
      rawName.length > FIELD_LIMITS.name ||
      rawPhone.length > FIELD_LIMITS.phone ||
      rawAddress.length > FIELD_LIMITS.address ||
      rawCity.length > FIELD_LIMITS.city ||
      rawPostal.length > FIELD_LIMITS.postalCode
    ) {
      return NextResponse.json(
        { error: 'Uno o más campos de envío superan la longitud máxima permitida' },
        { status: 400 }
      )
    }

    const rawItems = Array.isArray(items) ? items.slice(0, 50) : []
    const normalizedItems: OrderItemJson[] = rawItems.map((item: any) => {
      const product =
        getProductById(item.id) ||
        getProductBySlug(item.slug || item.id)
      return {
        id: String(item.id || product?.id || '').slice(0, 80),
        code: String(item.code || product?.code || '').slice(0, 40),
        name: String(item.name || product?.name || 'Gafas STENCIL2').slice(0, 120),
        slug: String(item.slug || product?.slug || item.id || '').slice(0, 100),
        price: product ? product.price : (Number(item.price) || 44.90),
        image: String(item.image || product?.image || '').slice(0, 250),
        model: String(item.model || product?.model || 'wayfarer').slice(0, 40),
        color: String(item.color || product?.frameColor || '#1a1a1a').slice(0, 40),
        colorLabel: String(item.colorLabel || 'Estándar').slice(0, 60),
        quantity: Math.max(1, Math.min(10, Number(item.quantity) || 1)),
      }
    })

    const cleanPromo =
      typeof promoCode === 'string' && promoCode.trim().length <= FIELD_LIMITS.promoCode
        ? promoCode.trim().toUpperCase()
        : undefined

    const breakdown =
      normalizedItems.length > 0
        ? calculateCartTotals(
            normalizedItems.map((i) => ({ id: i.id, price: i.price, quantity: i.quantity })),
            cleanPromo
          )
        : {
            subtotal: Number(body.subtotal) || 0,
            discount: Number(body.discount) || 0,
            taxableBase: Number(body.taxableBase) || 0,
            tax: Number(body.tax) || 0,
            shippingCost: Number(body.shipping) || 0,
            total: Number(body.total) || 0,
            pointsEarned: Number(body.pointsEarned) || 0,
          }

    const result = await createOrderInDb({
      orderNumber: rawOrderNum,
      customerEmail: normalizedEmail,
      customerName: rawName || null,
      customerPhone: rawPhone || null,
      stripeId: typeof stripeId === 'string' ? stripeId.slice(0, 100) : null,
      status: 'pending',
      items: normalizedItems,
      subtotal: breakdown.subtotal,
      discount: breakdown.discount,
      taxableBase: breakdown.taxableBase,
      tax: breakdown.tax,
      shipping: breakdown.shippingCost,
      total: breakdown.total,
      promoCode: cleanPromo || null,
      pointsEarned: breakdown.pointsEarned,
      shippingAddress: {
        name: rawName,
        address: rawAddress,
        city: rawCity,
        postalCode: rawPostal,
        email: normalizedEmail,
        phone: rawPhone,
      },
    })

    return NextResponse.json({
      ok: true,
      orderNumber: rawOrderNum,
      persisted: result.persisted,
    })
  } catch (error) {
    console.error('[API /orders POST] Error:', error)
    return NextResponse.json(
      { error: 'No se pudo registrar el pedido en este momento' },
      { status: 500 }
    )
  }
}
