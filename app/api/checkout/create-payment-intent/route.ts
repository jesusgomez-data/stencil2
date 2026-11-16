import { NextResponse } from 'next/server'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import { getProductById, getProductBySlug } from '@/lib/products'
import { calculateCartTotals } from '@/lib/pricing'
import { createOrderInDb } from '@/lib/db'
import type { OrderItemJson } from '@/types/database'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, shippingAddress, promoCode } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'El carrito no contiene artículos válidos' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !shippingAddress.email) {
      return NextResponse.json(
        { error: 'Se requiere información de envío y correo electrónico' },
        { status: 400 }
      )
    }

    // 1. Verificación de precios contra el catálogo del servidor
    const orderItemsPayload: OrderItemJson[] = []
    const verifiedItems = items.map((clientItem: any) => {
      const product =
        getProductById(clientItem.id) ||
        getProductBySlug(clientItem.id) ||
        getProductBySlug(clientItem.slug)
      const unitPrice = product ? product.price : (Number(clientItem.price) || 29.00)
      const quantity = Math.max(1, Math.min(10, Number(clientItem.quantity) || 1))

      orderItemsPayload.push({
        id: String(clientItem.id || product?.id || ''),
        code: String(clientItem.code || product?.code || ''),
        name: String(clientItem.name || product?.name || 'Gafas STENCIL2'),
        slug: String(clientItem.slug || product?.slug || clientItem.id || ''),
        price: unitPrice,
        image: String(clientItem.image || product?.image || ''),
        model: String(clientItem.model || product?.model || 'wayfarer'),
        color: String(clientItem.color || product?.frameColor || '#1a1a1a'),
        colorLabel: String(clientItem.colorLabel || product?.colors?.[0]?.label || 'Estándar'),
        quantity,
      })

      return {
        id: clientItem.id,
        price: unitPrice,
        quantity,
      }
    })

    // 2. Cálculo matemático de totales y desgloses
    const breakdown = calculateCartTotals(verifiedItems, promoCode)
    const amountInCents = Math.round(breakdown.total * 100)
    const orderId = `S2-ORD-${Math.floor(100000 + Math.random() * 900000)}`
    const normalizedPromo = promoCode ? String(promoCode).trim().toUpperCase() : null

    // 3. Comprobación de configuración de Stripe
    if (!isStripeConfigured() || !stripe) {
      const mockPi = `s2_mock_pi_${Date.now()}`
      await createOrderInDb({
        orderNumber: orderId,
        customerEmail: shippingAddress.email,
        customerName: shippingAddress.name || null,
        customerPhone: shippingAddress.phone || null,
        stripeId: mockPi,
        status: 'pending',
        items: orderItemsPayload,
        subtotal: breakdown.subtotal,
        discount: breakdown.discount,
        taxableBase: breakdown.taxableBase,
        tax: breakdown.tax,
        shipping: breakdown.shippingCost,
        total: breakdown.total,
        promoCode: normalizedPromo,
        pointsEarned: breakdown.pointsEarned,
        shippingAddress,
      })

      return NextResponse.json({
        clientSecret: null,
        paymentIntentId: mockPi,
        orderId,
        breakdown,
        demoMode: true,
        message: 'Modo demo activo: Configura NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY y STRIPE_SECRET_KEY en .env.local para pagos reales.',
      })
    }

    // 4. Creación del PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: shippingAddress.email,
      description: `Pedido STENCIL2 #${orderId}`,
      metadata: {
        orderId,
        customerName: shippingAddress.name || '',
        customerEmail: shippingAddress.email || '',
        promoCode: normalizedPromo || 'NONE',
        subtotal: breakdown.subtotal.toFixed(2),
        discount: breakdown.discount.toFixed(2),
        taxableBase: breakdown.taxableBase.toFixed(2),
        tax: breakdown.tax.toFixed(2),
        shipping: breakdown.shippingCost.toFixed(2),
        total: breakdown.total.toFixed(2),
        pointsEarned: breakdown.pointsEarned.toString(),
        itemsCount: items.length.toString(),
      },
    })

    // 5. Pre-registro del pedido en estado 'pending' en Supabase
    await createOrderInDb({
      orderNumber: orderId,
      customerEmail: shippingAddress.email,
      customerName: shippingAddress.name || null,
      customerPhone: shippingAddress.phone || null,
      stripeId: paymentIntent.id,
      status: 'pending',
      items: orderItemsPayload,
      subtotal: breakdown.subtotal,
      discount: breakdown.discount,
      taxableBase: breakdown.taxableBase,
      tax: breakdown.tax,
      shipping: breakdown.shippingCost,
      total: breakdown.total,
      promoCode: normalizedPromo,
      pointsEarned: breakdown.pointsEarned,
      shippingAddress,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderId,
      breakdown,
      demoMode: false,
    })
  } catch (error: any) {
    console.error('Error al crear PaymentIntent:', error)
    return NextResponse.json(
      { error: error?.message || 'Error interno al procesar el pago' },
      { status: 500 }
    )
  }
}
