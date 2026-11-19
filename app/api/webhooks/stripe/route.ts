import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { markOrderPaidInDb } from '@/lib/db'
import {
  dbOrderToEmailPayload,
  sendNewOrderAlert,
  sendOrderConfirmation,
} from '@/lib/email'
import { supabaseServer } from '@/lib/supabaseClient'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripe) {
    console.error('[Stripe Webhook] Cliente de Stripe no configurado')
    return NextResponse.json({ error: 'Servicio de pagos no configurado' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    if (webhookSecret) {
      if (!sig) {
        return NextResponse.json({ error: 'Falta la firma de Stripe' }, { status: 400 })
      }
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } else if (process.env.NODE_ENV !== 'production') {
      event = JSON.parse(body) as Stripe.Event
    } else {
      console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET no configurado en producción')
      return NextResponse.json({ error: 'Webhook no configurado' }, { status: 500 })
    }
  } catch (err: any) {
    console.error(`[Stripe Webhook] Error en verificación de firma: ${err?.message}`)
    return NextResponse.json({ error: 'Firma de webhook inválida' }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const orderId = paymentIntent.metadata?.orderId
      const customerEmail =
        paymentIntent.metadata?.customerEmail || paymentIntent.receipt_email || undefined
      const customerName = paymentIntent.metadata?.customerName || undefined
      const promoCode =
        paymentIntent.metadata?.promoCode && paymentIntent.metadata.promoCode !== 'NONE'
          ? paymentIntent.metadata.promoCode
          : null

      console.log(
        `[Stripe Webhook] Pago recibido para pedido ${orderId || '(sin orderId)'} (${paymentIntent.id})`
      )

      if (!supabaseServer) {
        console.error('[Stripe Webhook] Supabase no disponible para registrar el pago')
        return NextResponse.json(
          { error: 'Base de datos no disponible temporalmente' },
          { status: 500 }
        )
      }

      const totalNum = Number((paymentIntent.amount / 100).toFixed(2))
      const result = await markOrderPaidInDb(paymentIntent.id, {
        orderNumber: orderId,
        customerEmail,
        customerName,
        promoCode,
        subtotal: paymentIntent.metadata?.subtotal
          ? Number(paymentIntent.metadata.subtotal)
          : totalNum,
        discount: paymentIntent.metadata?.discount ? Number(paymentIntent.metadata.discount) : 0,
        taxableBase: paymentIntent.metadata?.taxableBase
          ? Number(paymentIntent.metadata.taxableBase)
          : undefined,
        tax: paymentIntent.metadata?.tax ? Number(paymentIntent.metadata.tax) : undefined,
        shipping: paymentIntent.metadata?.shipping ? Number(paymentIntent.metadata.shipping) : 0,
        total: totalNum,
        pointsEarned: paymentIntent.metadata?.pointsEarned
          ? Number(paymentIntent.metadata.pointsEarned)
          : Math.round(totalNum),
      })

      // Si falla el guardado en Supabase, responder 500 para que Stripe reintente
      if (!result.persisted || !result.order) {
        console.error('[Stripe Webhook] Fallo crítico guardando en Supabase:', result.error)
        return NextResponse.json(
          { error: 'No se pudo registrar el pedido en la base de datos' },
          { status: 500 }
        )
      }

      // Enviar confirmación al cliente y aviso interno SOLO cuando pasa a 'paid' por primera vez
      if (result.transitionedToPaid) {
        const emailPayload = dbOrderToEmailPayload(result.order)
        const [confirmRes, adminRes] = await Promise.all([
          sendOrderConfirmation(emailPayload),
          sendNewOrderAlert(emailPayload),
        ])

        if (!confirmRes.ok) {
          console.error(
            `[Stripe Webhook] No se pudo enviar confirmación al cliente (${emailPayload.orderNumber}):`,
            confirmRes.error
          )
        }
        if (!adminRes.ok) {
          console.error(
            `[Stripe Webhook] No se pudo enviar aviso interno (${emailPayload.orderNumber}):`,
            adminRes.error
          )
        }

        return NextResponse.json({
          received: true,
          orderNumber: result.order.order_number,
          transitionedToPaid: true,
          emailsSent: {
            customerConfirmation: confirmRes.ok,
            adminAlert: adminRes.ok,
          },
        })
      }

      console.log(
        `[Stripe Webhook] Evento duplicado/reintento para pedido ${result.order.order_number} (ya estaba en 'paid'). No se reenvían correos.`
      )
      return NextResponse.json({
        received: true,
        orderNumber: result.order.order_number,
        transitionedToPaid: false,
        duplicate: true,
      })
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.warn(
        `[Stripe Webhook] Fallo en el pago: ${paymentIntent.id}. Causa: ${paymentIntent.last_payment_error?.message}`
      )

      if (!supabaseServer) {
        console.error('[Stripe Webhook] Supabase no disponible en payment_failed')
        return NextResponse.json(
          { error: 'Base de datos no disponible temporalmente' },
          { status: 500 }
        )
      }

      const { error: failUpdateErr } = await supabaseServer
        .from('orders')
        .update({
          status: 'cancelled',
          notes: (paymentIntent.last_payment_error?.message || 'Pago fallido').slice(0, 500),
        })
        .eq('stripe_id', paymentIntent.id)
        .neq('status', 'paid')

      if (failUpdateErr) {
        console.error('[Stripe Webhook] Error marcando pedido fallido:', failUpdateErr.message)
        return NextResponse.json(
          { error: 'No se pudo actualizar el estado del pedido' },
          { status: 500 }
        )
      }
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
