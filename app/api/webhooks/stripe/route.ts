import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { markOrderPaidInDb } from '@/lib/db'
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
      const customerEmail = paymentIntent.metadata?.customerEmail || paymentIntent.receipt_email || undefined
      const customerName = paymentIntent.metadata?.customerName || undefined
      const promoCode =
        paymentIntent.metadata?.promoCode && paymentIntent.metadata.promoCode !== 'NONE'
          ? paymentIntent.metadata.promoCode
          : null

      console.log(`[Stripe Webhook] Pago confirmado para el pedido ${orderId} (${paymentIntent.id})`)

      // Registrar/confirmar pedido en Supabase y acreditar puntos de lealtad
      if (supabaseServer) {
        const totalNum = Number((paymentIntent.amount / 100).toFixed(2))
        const result = await markOrderPaidInDb(paymentIntent.id, {
          orderNumber: orderId,
          customerEmail,
          customerName,
          promoCode,
          subtotal: paymentIntent.metadata?.subtotal ? Number(paymentIntent.metadata.subtotal) : totalNum,
          discount: paymentIntent.metadata?.discount ? Number(paymentIntent.metadata.discount) : 0,
          taxableBase: paymentIntent.metadata?.taxableBase ? Number(paymentIntent.metadata.taxableBase) : undefined,
          tax: paymentIntent.metadata?.tax ? Number(paymentIntent.metadata.tax) : undefined,
          shipping: paymentIntent.metadata?.shipping ? Number(paymentIntent.metadata.shipping) : 0,
          total: totalNum,
          pointsEarned: paymentIntent.metadata?.pointsEarned
            ? Number(paymentIntent.metadata.pointsEarned)
            : Math.round(totalNum),
        })

        if (!result.persisted) {
          console.error('[Stripe Webhook] Error guardando en Supabase:', result.error)
        } else {
          console.log(`[Stripe Webhook] Pedido ${orderId || paymentIntent.id} guardado exitosamente en Supabase`)
        }
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.warn(`[Stripe Webhook] Fallo en el pago: ${paymentIntent.id}. Causa: ${paymentIntent.last_payment_error?.message}`)
      if (supabaseServer) {
        try {
          await supabaseServer
            .from('orders')
            .update({ status: 'cancelled', notes: paymentIntent.last_payment_error?.message || 'Pago fallido' })
            .eq('stripe_id', paymentIntent.id)
        } catch {
          // Ignorar fallo secundario
        }
      }
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
