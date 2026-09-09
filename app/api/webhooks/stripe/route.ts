import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseServer } from '@/lib/supabaseClient'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripe) {
    return NextResponse.json({ error: 'Stripe no configurado en el servidor' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } else {
      // En desarrollo sin webhook secret configurado
      event = JSON.parse(body) as Stripe.Event
    }
  } catch (err: any) {
    console.error(`Error en verificación de webhook de Stripe: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Manejo de eventos
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const orderId = paymentIntent.metadata?.orderId
      console.log(`[Stripe Webhook] Pago confirmado para el pedido ${orderId} (${paymentIntent.id})`)

      // Registrar pedido en Supabase si está disponible
      if (supabaseServer && orderId) {
        try {
          const { error } = await supabaseServer.from('orders').upsert({
            stripe_id: paymentIntent.id,
            status: 'paid',
            total: (paymentIntent.amount / 100).toFixed(2),
            promo_code: paymentIntent.metadata?.promoCode !== 'NONE' ? paymentIntent.metadata?.promoCode : null,
            subtotal: paymentIntent.metadata?.subtotal,
            shipping: paymentIntent.metadata?.shipping,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'stripe_id' })

          if (error) {
            console.error('[Stripe Webhook] Error guardando en Supabase:', error)
          } else {
            console.log(`[Stripe Webhook] Pedido ${orderId} guardado exitosamente en Supabase`)
          }
        } catch (dbError) {
          console.error('[Stripe Webhook] Excepción al interactuar con base de datos:', dbError)
        }
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.warn(`[Stripe Webhook] Fallo en el pago: ${paymentIntent.id}. Causa: ${paymentIntent.last_payment_error?.message}`)
      break
    }

    default:
      // Evento no manejado específicamente
      break
  }

  return NextResponse.json({ received: true })
}
