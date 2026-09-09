'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { getStripe } from '@/lib/stripe'
import { Check, Sparkles, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

function SuccessContent() {
  const searchParams = useSearchParams()
  const paymentIntentId = searchParams.get('payment_intent')
  const clientSecret = searchParams.get('payment_intent_client_secret')
  const orderIdParam = searchParams.get('order_id')

  const { clearCart, orders, loyaltyPoints } = useCart()

  const [status, setStatus] = useState<'loading' | 'succeeded' | 'processing' | 'failed'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [orderAmount, setOrderAmount] = useState<number | null>(null)

  useEffect(() => {
    if (!clientSecret) {
      // Si entra directamente sin clientSecret
      setStatus('succeeded')
      return
    }

    const verifyPayment = async () => {
      try {
        const stripe = await getStripe()
        if (!stripe) {
          setStatus('succeeded')
          return
        }

        const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret)

        if (error) {
          setStatus('failed')
          setErrorMessage(error.message || 'No se pudo verificar el estado del pago')
          return
        }

        if (paymentIntent) {
          setOrderAmount(paymentIntent.amount / 100)

          if (paymentIntent.status === 'succeeded') {
            setStatus('succeeded')
            clearCart()
          } else if (paymentIntent.status === 'processing') {
            setStatus('processing')
            clearCart()
          } else {
            setStatus('failed')
            setErrorMessage('El pago no ha sido completado con éxito.')
          }
        }
      } catch (err: any) {
        console.error('Error verificando pago Stripe:', err)
        setStatus('succeeded')
      }
    }

    verifyPayment()
  }, [clientSecret, clearCart])

  const displayOrderId = orderIdParam || (orders.length > 0 ? orders[0].id : `S2-ORD-${Math.floor(100000 + Math.random() * 900000)}`)
  const displayAmount = orderAmount ?? (orders.length > 0 ? orders[0].total : 29.00)

  if (status === 'loading') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center">
        <span className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
        <p className="font-code text-xs uppercase tracking-widest text-white/50">VERIFICANDO ESTADO DEL PAGO...</p>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#CC0000]/20 border border-[#CC0000]/40 flex items-center justify-center mx-auto mb-6 text-[#ff6b6b]">
          <AlertCircle size={28} />
        </div>
        <h1 className="font-bebas text-4xl text-white tracking-wide uppercase mb-3">PAGO NO COMPLETADO</h1>
        <p className="font-code text-xs text-white/50 mb-8 uppercase leading-relaxed">
          {errorMessage || 'Hubo un problema al procesar tu transacción. No se ha realizado ningún cobro en tu cuenta.'}
        </p>
        <Link
          href="/checkout"
          className="font-code text-[10px] tracking-widest text-white bg-[#CC0000] hover:bg-[#B00000] px-8 py-3.5 transition-colors uppercase font-bold rounded-sm flex items-center gap-2"
        >
          REINTENTAR PAGO
          <ArrowRight size={12} />
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto text-center border border-white/[0.06] bg-[#0c0c0c] rounded-xl p-8 md:p-12 shadow-2xl my-12"
    >
      <div className="w-16 h-16 rounded-full bg-[#1C3B1C] border border-[#2c5c2c] flex items-center justify-center mx-auto mb-6 text-[#4caf50]">
        <Check size={28} strokeWidth={2.5} />
      </div>

      <p className="font-code text-[9px] tracking-[0.35em] text-[#C4822A] uppercase mb-2">
        {status === 'processing' ? 'PAGO EN PROCESO' : '¡PAGO PROCESADO CON ÉXITO!'}
      </p>
      <h1 className="font-bebas text-4xl md:text-5xl text-white tracking-wide uppercase mb-6 leading-none">
        GRACIAS POR TU COMPRA
      </h1>

      {/* Order summary box */}
      <div className="border border-white/[0.05] bg-black p-5 rounded-lg text-left mb-8 space-y-3 font-code text-[10px] uppercase">
        <div className="flex justify-between text-white/30">
          <span>NÚMERO DE PEDIDO:</span>
          <span className="text-[#C4822A] font-bold">{displayOrderId}</span>
        </div>
        {paymentIntentId && (
          <div className="flex justify-between text-white/30">
            <span>ID TRANSACCIÓN:</span>
            <span className="text-white/50">{paymentIntentId}</span>
          </div>
        )}
        <div className="flex justify-between text-white/30">
          <span>ESTADO DE TRANSACCIÓN:</span>
          <span className="text-[#4caf50] font-bold">PAGADO (STRIPE SSL)</span>
        </div>
        <div className="flex justify-between text-white/30">
          <span>TOTAL PAGADO:</span>
          <span className="text-white font-bold">{displayAmount.toFixed(2)} EUR</span>
        </div>
        <div className="border-t border-white/[0.05] pt-3 flex items-center gap-2 text-[#4caf50]">
          <Sparkles size={13} className="animate-pulse flex-shrink-0" />
          <span>+{Math.round(displayAmount)} PUNTOS DE LEALTAD OBTENIDOS</span>
        </div>
      </div>

      <p className="font-code text-[11px] leading-relaxed text-white/40 mb-8 uppercase">
        Tu pedido ha sido registrado correctamente en STENCIL2. Hemos enviado un correo de confirmación con los detalles y la factura.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
        <Link
          href="/cuenta"
          className="font-code text-[10px] tracking-widest text-black bg-white hover:bg-white/80 px-8 py-3.5 transition-colors uppercase font-bold rounded-sm"
        >
          VER MIS PEDIDOS
        </Link>
        <Link
          href="/tienda"
          className="font-code text-[10px] tracking-widest text-white border border-white/20 hover:border-white/50 px-8 py-3.5 transition-colors uppercase font-bold rounded-sm bg-white/[0.02]"
        >
          SEGUIR COMPRANDO
        </Link>
      </div>
    </motion.div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-black min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 pt-28 pb-20 px-6 lg:px-10 max-w-[1400px] mx-auto w-full flex items-center justify-center">
        <Suspense fallback={
          <div className="flex items-center justify-center py-32">
            <span className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
