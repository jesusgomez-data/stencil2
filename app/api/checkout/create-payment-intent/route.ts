import { NextResponse } from 'next/server'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import { getProductById, getProductBySlug } from '@/lib/products'
import { calculateCartTotals } from '@/lib/pricing'

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
    const verifiedItems = items.map((clientItem: any) => {
      const product = getProductById(clientItem.id) || getProductBySlug(clientItem.id) || getProductBySlug(clientItem.slug)
      const unitPrice = product ? product.price : (Number(clientItem.price) || 29.00)
      const quantity = Math.max(1, Math.min(10, Number(clientItem.quantity) || 1))

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

    // 3. Comprobación de configuración de Stripe
    if (!isStripeConfigured() || !stripe) {
      return NextResponse.json({
        clientSecret: null,
        paymentIntentId: `s2_mock_pi_${Date.now()}`,
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
        promoCode: promoCode ? promoCode.toUpperCase() : 'NONE',
        subtotal: breakdown.subtotal.toFixed(2),
        discount: breakdown.discount.toFixed(2),
        tax: breakdown.tax.toFixed(2),
        shipping: breakdown.shippingCost.toFixed(2),
        total: breakdown.total.toFixed(2),
        itemsCount: items.length.toString(),
      },
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
