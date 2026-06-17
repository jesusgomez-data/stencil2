'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { Order } from '@/types'
import { ArrowLeft, Check, CreditCard, Shield, Truck, Sparkles, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CheckoutPage() {
  const { cartItems, total, subtotal, discount, shippingCost, promoCode, completeCheckout } = useCart()
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details')
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)
  
  // Shipping Form State
  const [formEmail, setFormEmail] = useState('')
  const [formName, setFormName] = useState('')
  const [formLastName, setFormLastName] = useState('')
  const [formAddress, setFormAddress] = useState('')
  const [formCity, setFormCity] = useState('')
  const [formPostalCode, setFormPostalCode] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Payment Form State
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({})

  const validateDetails = () => {
    const errors: Record<string, string> = {}
    if (!formEmail.includes('@')) errors.email = 'Email inválido'
    if (!formName.trim()) errors.name = 'El nombre es obligatorio'
    if (!formLastName.trim()) errors.lastName = 'El apellido es obligatorio'
    if (!formAddress.trim()) errors.address = 'La dirección es obligatoria'
    if (!formCity.trim()) errors.city = 'La ciudad es obligatoria'
    if (!/^\d{5}$/.test(formPostalCode)) errors.postalCode = 'Código postal debe ser de 5 dígitos'
    if (!/^\+?\d{9,12}$/.test(formPhone.replace(/\s/g, ''))) errors.phone = 'Teléfono inválido'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePayment = () => {
    const errors: Record<string, string> = {}
    const cleanCard = cardNumber.replace(/\s/g, '')
    if (cleanCard.length < 16) errors.cardNumber = 'Número de tarjeta incompleto'
    if (!cardHolder.trim()) errors.cardHolder = 'Nombre del titular requerido'
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) errors.cardExpiry = 'Formato MM/AA inválido'
    if (!/^\d{3}$/.test(cardCvc)) errors.cardCvc = 'CVC debe tener 3 dígitos'

    setPaymentErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateDetails()) {
      setStep('payment')
    }
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validatePayment()) {
      setIsProcessing(true)
      
      // Simulate Stripe Processing
      setTimeout(() => {
        setIsProcessing(false)
        const order = completeCheckout({
          name: `${formName} ${formLastName}`,
          address: formAddress,
          city: formCity,
          postalCode: formPostalCode,
          email: formEmail,
          phone: formPhone,
        })
        setCreatedOrder(order)
        setStep('success')
      }, 2000)
    }
  }

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '))
    } else {
      setCardNumber(v)
    }
  }

  // Format Expiry Date (adds slash)
  const handleExpiryChange = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      setCardExpiry(`${v.substring(0, 2)}/${v.substring(2, 4)}`)
    } else {
      setCardExpiry(v)
    }
  }

  if (cartItems.length === 0 && step !== 'success') {
    return (
      <div className="bg-black min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center">
          <ShoppingBag size={24} className="text-white/30 mb-4" />
          <h1 className="font-bebas text-4xl text-white tracking-wide uppercase mb-4">CARRITO VACÍO</h1>
          <p className="font-code text-xs text-white/40 mb-8 max-w-sm">No puedes realizar el checkout sin artículos en tu carrito.</p>
          <Link href="/tienda" className="font-code text-[10px] tracking-widest text-black bg-white hover:bg-white/80 px-8 py-3.5 transition-colors uppercase font-bold rounded-sm">
            IR A LA TIENDA
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-10 max-w-[1400px] mx-auto w-full">
        {step !== 'success' ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
            
            {/* LEFT SIDE: Steps Forms */}
            <div className="border border-white/[0.06] bg-[#0c0c0c] rounded-xl p-6 md:p-8 text-left">
              {/* Stepper Header */}
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/[0.05]">
                <button
                  onClick={() => step === 'payment' && setStep('details')}
                  disabled={step === 'details'}
                  className={`text-white/30 hover:text-white transition-colors p-1 flex items-center justify-center ${step === 'details' ? 'opacity-0 pointer-events-none' : ''}`}
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <span className="font-code text-[8px] tracking-[0.3em] text-[#C4822A] uppercase block">
                    PASO {step === 'details' ? '1 DE 2' : '2 DE 2'}
                  </span>
                  <h1 className="font-bebas text-3xl text-white tracking-wide uppercase leading-none mt-1">
                    {step === 'details' ? 'DATOS DE ENVÍO' : 'INFORMACIÓN DE PAGO'}
                  </h1>
                </div>
              </div>

              {/* STEP 1: Details form */}
              {step === 'details' && (
                <form onSubmit={handleNextStep} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">NOMBRE</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className={`w-full bg-black border ${formErrors.name ? 'border-[#CC0000]' : 'border-white/15'} text-white font-code text-[10px] tracking-widest px-4 py-3 focus:outline-none focus:border-white/30 transition-colors uppercase rounded-sm`}
                      />
                      {formErrors.name && <p className="font-code text-[8px] text-[#CC0000] uppercase mt-1.5">{formErrors.name}</p>}
                    </div>

                    <div>
                      <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">APELLIDOS</label>
                      <input
                        type="text"
                        value={formLastName}
                        onChange={(e) => setFormLastName(e.target.value)}
                        className={`w-full bg-black border ${formErrors.lastName ? 'border-[#CC0000]' : 'border-white/15'} text-white font-code text-[10px] tracking-widest px-4 py-3 focus:outline-none focus:border-white/30 transition-colors uppercase rounded-sm`}
                      />
                      {formErrors.lastName && <p className="font-code text-[8px] text-[#CC0000] uppercase mt-1.5">{formErrors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">CORREO ELECTRÓNICO</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className={`w-full bg-black border ${formErrors.email ? 'border-[#CC0000]' : 'border-white/15'} text-white font-code text-[10px] tracking-widest px-4 py-3 focus:outline-none focus:border-white/30 transition-colors rounded-sm`}
                    />
                    {formErrors.email && <p className="font-code text-[8px] text-[#CC0000] uppercase mt-1.5">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">DIRECCIÓN DE ENTREGA</label>
                    <input
                      type="text"
                      placeholder="CALLE, PORTAL, PISO..."
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className={`w-full bg-black border ${formErrors.address ? 'border-[#CC0000]' : 'border-white/15'} text-white font-code text-[10px] tracking-widest px-4 py-3 focus:outline-none focus:border-white/30 transition-colors uppercase rounded-sm`}
                    />
                    {formErrors.address && <p className="font-code text-[8px] text-[#CC0000] uppercase mt-1.5">{formErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">CIUDAD</label>
                      <input
                        type="text"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        className={`w-full bg-black border ${formErrors.city ? 'border-[#CC0000]' : 'border-white/15'} text-white font-code text-[10px] tracking-widest px-4 py-3 focus:outline-none focus:border-white/30 transition-colors uppercase rounded-sm`}
                      />
                      {formErrors.city && <p className="font-code text-[8px] text-[#CC0000] uppercase mt-1.5">{formErrors.city}</p>}
                    </div>

                    <div>
                      <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">CÓDIGO POSTAL</label>
                      <input
                        type="text"
                        placeholder="28001"
                        maxLength={5}
                        value={formPostalCode}
                        onChange={(e) => setFormPostalCode(e.target.value)}
                        className={`w-full bg-black border ${formErrors.postalCode ? 'border-[#CC0000]' : 'border-white/15'} text-white font-code text-[10px] tracking-widest px-4 py-3 focus:outline-none focus:border-white/30 transition-colors uppercase rounded-sm`}
                      />
                      {formErrors.postalCode && <p className="font-code text-[8px] text-[#CC0000] uppercase mt-1.5">{formErrors.postalCode}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">TELÉFONO DE CONTACTO</label>
                    <input
                      type="text"
                      placeholder="600000000"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className={`w-full bg-black border ${formErrors.phone ? 'border-[#CC0000]' : 'border-white/15'} text-white font-code text-[10px] tracking-widest px-4 py-3 focus:outline-none focus:border-white/30 transition-colors rounded-sm`}
                    />
                    {formErrors.phone && <p className="font-code text-[8px] text-[#CC0000] uppercase mt-1.5">{formErrors.phone}</p>}
                  </div>

                  <div className="pt-4 border-t border-white/[0.05]">
                    <button
                      type="submit"
                      className="w-full bg-white text-black hover:bg-white/80 font-code text-[10px] tracking-[0.25em] py-4 rounded-sm font-bold uppercase transition-colors"
                    >
                      CONTINUAR AL PAGO
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Payment form */}
              {step === 'payment' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  
                  {/* Virtual Credit Card Premium Illustration */}
                  <div className="relative w-full aspect-[1.58/1] rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/20 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md mb-6">
                    {/* Chip and logo */}
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-7 rounded bg-amber-400/80 opacity-80 shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
                      <span className="font-code text-[11px] tracking-widest text-white font-bold opacity-80">STENCIL2</span>
                    </div>

                    {/* Card number */}
                    <p className="font-code text-base md:text-lg tracking-[0.15em] text-white/90 text-center my-4 font-medium">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </p>

                    {/* Cardholder & expiry */}
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="font-code text-[7px] text-white/30 block tracking-wider">TITULAR</span>
                        <span className="font-code text-[9px] text-white/80 block uppercase tracking-widest truncate max-w-[180px]">
                          {cardHolder || 'NOMBRE APELLIDO'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-code text-[7px] text-white/30 block tracking-wider">CADUCIDAD</span>
                        <span className="font-code text-[9px] text-white/80 block tracking-wider">
                          {cardExpiry || 'MM/AA'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Inputs */}
                  <div>
                    <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">TITULAR DE LA TARJETA</label>
                    <input
                      type="text"
                      placeholder="COMO APARECE EN LA TARJETA"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className={`w-full bg-black border ${paymentErrors.cardHolder ? 'border-[#CC0000]' : 'border-white/15'} text-white font-code text-[10px] tracking-widest px-4 py-3 focus:outline-none focus:border-white/30 transition-colors uppercase rounded-sm`}
                    />
                    {paymentErrors.cardHolder && <p className="font-code text-[8px] text-[#CC0000] uppercase mt-1.5">{paymentErrors.cardHolder}</p>}
                  </div>

                  <div>
                    <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">NÚMERO DE TARJETA</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        className={`w-full bg-black border ${paymentErrors.cardNumber ? 'border-[#CC0000]' : 'border-white/15'} text-white font-code text-[10px] tracking-widest pl-11 pr-4 py-3 focus:outline-none focus:border-white/30 transition-colors rounded-sm`}
                      />
                      <CreditCard size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    </div>
                    {paymentErrors.cardNumber && <p className="font-code text-[8px] text-[#CC0000] uppercase mt-1.5">{paymentErrors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">VENCIMIENTO</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        className={`w-full bg-black border ${paymentErrors.cardExpiry ? 'border-[#CC0000]' : 'border-white/15'} text-white font-code text-[10px] tracking-widest px-4 py-3 focus:outline-none focus:border-white/30 transition-colors rounded-sm`}
                      />
                      {paymentErrors.cardExpiry && <p className="font-code text-[8px] text-[#CC0000] uppercase mt-1.5">{paymentErrors.cardExpiry}</p>}
                    </div>

                    <div>
                      <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">CÓDIGO CVC</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={3}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ''))}
                        className={`w-full bg-black border ${paymentErrors.cardCvc ? 'border-[#CC0000]' : 'border-white/15'} text-white font-code text-[10px] tracking-widest px-4 py-3 focus:outline-none focus:border-white/30 transition-colors rounded-sm`}
                      />
                      {paymentErrors.cardCvc && <p className="font-code text-[8px] text-[#CC0000] uppercase mt-1.5">{paymentErrors.cardCvc}</p>}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.05]">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-[#CC0000] hover:bg-[#B00000] disabled:bg-red-900 text-white font-code text-[10px] tracking-[0.25em] py-4 rounded-sm font-bold uppercase transition-colors flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          PROCESANDO PAGO...
                        </span>
                      ) : (
                        `COMPLETAR PAGO — ${total.toFixed(2)} EUR`
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT SIDE: Summary breakdown */}
            <div className="border border-white/[0.06] bg-[#0c0c0c] p-6 rounded-xl text-left space-y-5">
              <p className="font-code text-[10px] tracking-[0.25em] text-white/30 uppercase border-b border-white/[0.06] pb-3 font-semibold">
                RESUMEN DE COMPRA
              </p>

              {/* Items List */}
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.color}`} className="flex justify-between items-center text-left gap-4">
                    <div>
                      <p className="font-display text-xs font-semibold text-white uppercase tracking-wide">
                        {item.name} <span className="font-code text-[9px] text-white/30 lowercase">x{item.quantity}</span>
                      </p>
                      <span className="font-code text-[8px] text-[#C4822A] uppercase block">
                        COLOR: {item.colorLabel}
                      </span>
                    </div>
                    <span className="font-display text-xs text-white/80 font-bold whitespace-nowrap">
                      {(item.price * item.quantity).toFixed(2)} EUR
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary Prices */}
              <div className="border-t border-white/[0.06] pt-4 space-y-2.5 font-code text-[10px] uppercase text-white/40">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span className="text-white">{subtotal.toFixed(2)} EUR</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#CC0000]">
                    <span>DESCUENTO ({promoCode})</span>
                    <span>-{discount.toFixed(2)} EUR</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ENVÍO</span>
                  <span className="text-white">
                    {shippingCost === 0 ? 'GRATIS' : `${shippingCost.toFixed(2)} EUR`}
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="border-t border-white/[0.06] pt-4 flex justify-between items-baseline">
                <span className="font-code text-xs text-white uppercase font-bold">TOTAL COMPRA</span>
                <div className="text-right">
                  <span className="font-display text-xl font-bold text-white block">
                    {total.toFixed(2)} EUR
                  </span>
                  <span className="font-code text-[7px] tracking-wider text-white/20 block uppercase mt-0.5">
                    21% IVA Incluido
                  </span>
                </div>
              </div>

              {/* Security info */}
              <div className="border-t border-white/[0.05] pt-4 flex items-start gap-2.5">
                <Shield size={14} className="text-white/30 flex-shrink-0 mt-0.5" />
                <p className="font-code text-[8px] text-white/30 leading-normal uppercase">
                  Tus transacciones se procesan de forma segura a través de encriptación SSL de nivel militar. STENCIL2 nunca almacena tu información financiera.
                </p>
              </div>
            </div>

          </div>
        ) : (
          /* SUCCESS SCREEN */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto text-center border border-white/[0.06] bg-[#0c0c0c] rounded-xl p-8 md:p-12 shadow-2xl"
          >
            {/* Animated Check */}
            <div className="w-16 h-16 rounded-full bg-[#1C3B1C] border border-[#2c5c2c] flex items-center justify-center mx-auto mb-6 text-[#4caf50]">
              <Check size={28} strokeWidth={2.5} />
            </div>

            <p className="font-code text-[9px] tracking-[0.35em] text-[#C4822A] uppercase mb-2">¡PAGO PROCESADO CON ÉXITO!</p>
            <h1 className="font-bebas text-4xl md:text-5xl text-white tracking-wide uppercase mb-6 leading-none">GRACIAS POR TU COMPRA</h1>

            {/* Order summary box */}
            {createdOrder && (
              <div className="border border-white/[0.05] bg-black p-5 rounded-lg text-left mb-8 space-y-3 font-code text-[10px] uppercase">
                <div className="flex justify-between text-white/30">
                  <span>NÚMERO DE PEDIDO:</span>
                  <span className="text-[#C4822A] font-bold">{createdOrder.id}</span>
                </div>
                <div className="flex justify-between text-white/30">
                  <span>FECHA DEL PEDIDO:</span>
                  <span className="text-white/70">{createdOrder.date}</span>
                </div>
                <div className="flex justify-between text-white/30">
                  <span>MÉTODO DE ENVÍO:</span>
                  <span className="text-white/70">ESTÁNDAR (3-5 DÍAS)</span>
                </div>
                <div className="flex justify-between text-white/30">
                  <span>TOTAL PAGADO:</span>
                  <span className="text-white font-bold">{createdOrder.total.toFixed(2)} EUR</span>
                </div>
                
                {/* Loyalty points rewards alert */}
                <div className="border-t border-white/[0.05] pt-3 flex items-center gap-2 text-[#4caf50]">
                  <Sparkles size={13} className="animate-pulse flex-shrink-0" />
                  <span>+{createdOrder.pointsEarned} PUNTOS DE LEALTAD OBTENIDOS</span>
                </div>
              </div>
            )}

            <p className="font-code text-[11px] leading-relaxed text-white/40 mb-8 uppercase">
              Hemos enviado un correo de confirmación de pedido a <span className="text-white/80">{formEmail}</span> con los detalles de la compra y tu factura en PDF. En cuanto tu pedido sea despachado de nuestro almacén recibirás un enlace de seguimiento.
            </p>

            {/* CTAs */}
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
        )}
      </main>

      <Footer />
    </div>
  )
}
