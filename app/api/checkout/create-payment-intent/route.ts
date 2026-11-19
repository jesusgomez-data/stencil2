import { NextResponse } from 'next/server'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import { getProductById, getProductBySlug } from '@/lib/products'
import { calculateCartTotals } from '@/lib/pricing'
import { createOrderInDb } from '@/lib/db'
import { FIELD_LIMITS, isValidEmail, normalizeEmail } from '@/lib/security'
import type { OrderItemJson } from '@/types/database'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, shippingAddress, promoCode } = body || {}

    if (!items || !Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json(
        { error: 'El carrito no contiene artículos válidos' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !isValidEmail(shippingAddress.email)) {
      return NextResponse.json(
        { error: 'Se requiere información de envío y un correo electrónico válido' },
        { status: 400 }
      )
    }

    const normalizedEmail = normalizeEmail(shippingAddress.email)
    const cleanName = String(shippingAddress.name || '').trim()
    const cleanPhone = String(shippingAddress.phone || '').trim()
    const cleanAddress = String(shippingAddress.address || '').trim()
    const cleanCity = String(shippingAddress.city || '').trim()
    const cleanPostal = String(shippingAddress.postalCode || '').trim()

    if (
      cleanName.length > FIELD_LIMITS.name ||
      cleanPhone.length > FIELD_LIMITS.phone ||
      cleanAddress.length > FIELD_LIMITS.address ||
      cleanCity.length > FIELD_LIMITS.city ||
      cleanPostal.length > FIELD_LIMITS.postalCode
    ) {
      return NextResponse.json(
        { error: 'Uno o más campos de la dirección de envío superan la longitud máxima' },
        { status: 400 }
      )
    }

    const safeShippingAddress = {
      name: cleanName,
      address: cleanAddress,
      city: cleanCity,
      postalCode: cleanPostal,
      email: normalizedEmail,
      phone: cleanPhone,
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
        id: String(clientItem.id || product?.id || '').slice(0, 80),
        code: String(clientItem.code || product?.code || '').slice(0, 40),
        name: String(clientItem.name || product?.name || 'Gafas STENCIL2').slice(0, 120),
        slug: String(clientItem.slug || product?.slug || clientItem.id || '').slice(0, 100),
        price: unitPrice,
        image: String(clientItem.image || product?.image || '').slice(0, 250),
        model: String(clientItem.model || product?.model || 'wayfarer').slice(0, 40),
        color: String(clientItem.color || product?.frameColor || '#1a1a1a').slice(0, 40),
        colorLabel: String(clientItem.colorLabel || product?.colors?.[0]?.label || 'Estándar').slice(0, 60),
        quantity,
      })

      return {
        id: clientItem.id,
        price: unitPrice,
        quantity,
      }
    })

    // 2. Cálculo matemático de totales y desgloses
    const normalizedPromo =
      typeof promoCode === 'string' && promoCode.trim().length <= FIELD_LIMITS.promoCode
        ? promoCode.trim().toUpperCase() || null
        : null

    const breakdown = calculateCartTotals(verifiedItems, normalizedPromo || undefined)
    const amountInCents = Math.round(breakdown.total * 100)
    const orderId = `S2-ORD-${Math.floor(100000 + Math.random() * 900000)}`

    // 3. Comprobación de configuración de Stripe
    if (!isStripeConfigured() || !stripe) {
      const mockPi = `s2_mock_pi_${Date.now()}`
      await createOrderInDb({
        orderNumber: orderId,
        customerEmail: normalizedEmail,
        customerName: cleanName || null,
        customerPhone: cleanPhone || null,
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
        shippingAddress: safeShippingAddress,
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
      receipt_email: normalizedEmail,
      description: `Pedido STENCIL2 #${orderId}`,
      metadata: {
        orderId,
        customerName: cleanName,
        customerEmail: normalizedEmail,
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
      customerEmail: normalizedEmail,
      customerName: cleanName || null,
      customerPhone: cleanPhone || null,
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
      shippingAddress: safeShippingAddress,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderId,
      breakdown,
      demoMode: false,
    })
  } catch (error) {
    console.error('[API /checkout/create-payment-intent] Error:', error)
    return NextResponse.json(
      { error: 'No se pudo iniciar el proceso de pago en este momento. Inténtalo de nuevo.' },
      { status: 500 }
    )
  }
}
