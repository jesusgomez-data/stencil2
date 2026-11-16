import { NextResponse } from 'next/server'
import { createOrderInDb, getOrdersByEmailFromDb } from '@/lib/db'
import { calculateCartTotals } from '@/lib/pricing'
import { getProductById, getProductBySlug } from '@/lib/products'
import type { OrderItemJson } from '@/types/database'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Se requiere un correo electrónico válido' },
        { status: 400 }
      )
    }

    const { orders, source } = await getOrdersByEmailFromDb(email)
    return NextResponse.json({ orders, source })
  } catch (error: any) {
    console.error('[API /orders GET] Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Error al obtener pedidos' },
      { status: 500 }
    )
  }
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
      status,
    } = body

    const resolvedOrderNumber = String(orderNumber || id || `S2-ORD-${Math.floor(100000 + Math.random() * 900000)}`)
    const customerEmail = shippingAddress?.email || body.customerEmail

    if (!customerEmail || typeof customerEmail !== 'string' || !customerEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Correo electrónico del cliente requerido' },
        { status: 400 }
      )
    }

    const rawItems = Array.isArray(items) ? items : []
    const normalizedItems: OrderItemJson[] = rawItems.map((item: any) => {
      const product =
        getProductById(item.id) ||
        getProductBySlug(item.slug || item.id)
      return {
        id: String(item.id || product?.id || ''),
        code: String(item.code || product?.code || ''),
        name: String(item.name || product?.name || 'Gafas STENCIL2'),
        slug: String(item.slug || product?.slug || item.id || ''),
        price: product ? product.price : (Number(item.price) || 29.0),
        image: String(item.image || product?.image || ''),
        model: String(item.model || product?.model || 'wayfarer'),
        color: String(item.color || product?.frameColor || '#1a1a1a'),
        colorLabel: String(item.colorLabel || 'Estándar'),
        quantity: Math.max(1, Math.min(10, Number(item.quantity) || 1)),
      }
    })

    const breakdown =
      normalizedItems.length > 0
        ? calculateCartTotals(
            normalizedItems.map((i) => ({ id: i.id, price: i.price, quantity: i.quantity })),
            promoCode
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
      orderNumber: resolvedOrderNumber,
      customerEmail,
      customerName: shippingAddress?.name || body.customerName || null,
      customerPhone: shippingAddress?.phone || body.customerPhone || null,
      stripeId: stripeId || null,
      status: status || 'paid',
      items: normalizedItems,
      subtotal: breakdown.subtotal,
      discount: breakdown.discount,
      taxableBase: breakdown.taxableBase,
      tax: breakdown.tax,
      shipping: breakdown.shippingCost,
      total: breakdown.total,
      promoCode: promoCode ? String(promoCode).toUpperCase() : null,
      pointsEarned: breakdown.pointsEarned,
      shippingAddress: shippingAddress || {},
    })

    return NextResponse.json({
      ok: true,
      orderNumber: resolvedOrderNumber,
      persisted: result.persisted,
      order: result.order,
    })
  } catch (error: any) {
    console.error('[API /orders POST] Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Error al registrar el pedido' },
      { status: 500 }
    )
  }
}
