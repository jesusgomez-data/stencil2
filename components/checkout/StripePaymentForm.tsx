'use client'

import React, { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Lock, AlertCircle, ShieldCheck } from 'lucide-react'

interface StripePaymentFormProps {
  total: number
  orderId: string
  customerEmail: string
  onPaymentSuccess: (paymentIntentId: string) => void
}

export default function StripePaymentForm({
  total,
  orderId,
  customerEmail,
  onPaymentSuccess,
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js no ha cargado aún
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const returnUrl = `${window.location.origin}/checkout/success?order_id=${encodeURIComponent(orderId)}`

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
          receipt_email: customerEmail,
        },
        redirect: 'if_required',
      })

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message || 'Error al procesar la tarjeta')
        } else {
          setErrorMessage('Ocurrió un error inesperado al procesar el pago')
        }
        setIsProcessing(false)
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Pago completado sin necesidad de redirección 3D Secure
        setIsProcessing(false)
        onPaymentSuccess(paymentIntent.id)
      } else {
        // En caso de que se requiera acción adicional o redirección
        setIsProcessing(false)
      }
    } catch (err: any) {
      console.error('Error al confirmar pago:', err)
      setErrorMessage(err?.message || 'Error de conexión con la pasarela de pago')
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe Elements Container */}
      <div className="bg-[#050505] p-5 rounded-lg border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 text-white/70">
            <Lock size={13} className="text-[#C4822A]" />
            <span className="font-code text-[10px] uppercase tracking-wider font-semibold">
              PASARELA SEGURA STRIPE
            </span>
          </div>
          <span className="font-code text-[8px] text-white/30 uppercase tracking-widest">
            TARJETA · APPLE PAY · GOOGLE PAY
          </span>
        </div>

        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-sm text-[#ff6b6b]">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          <p className="font-code text-[9px] uppercase tracking-wider leading-relaxed">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Security note */}
      <div className="flex items-center gap-2 text-white/40 font-code text-[8px] uppercase tracking-wider">
        <ShieldCheck size={14} className="text-[#4caf50]" />
        <span>Encriptación de 256 bits SSL homologada por Stripe PCI-DSS Level 1</span>
      </div>

      {/* Submit Button */}
      <div className="pt-2 border-t border-white/[0.05]">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-[#CC0000] hover:bg-[#B00000] disabled:bg-[#4a0d0d] disabled:cursor-not-allowed text-white font-code text-[10px] tracking-[0.25em] py-4 rounded-sm font-bold uppercase transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(204,0,0,0.25)]"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              VERIFICANDO Y PROCESANDO PAGO...
            </span>
          ) : (
            `COMPLETAR PAGO — ${total.toFixed(2)} EUR`
          )}
        </button>
      </div>
    </form>
  )
}
