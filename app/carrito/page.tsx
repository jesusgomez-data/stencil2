'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  WayfarerSVG,
  RoundSVG,
  ShieldSVG,
  AviatorSVG,
  CatEyeSVG,
  SportSVG,
} from '@/components/SunglassesIllustration'

const ILLUSTRATIONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement> & { color?: string }>> = {
  wayfarer: WayfarerSVG,
  round:    RoundSVG,
  shield:   ShieldSVG,
  aviator:  AviatorSVG,
  'cat-eye':CatEyeSVG,
  sport:    SportSVG,
}

export default function CarritoPage() {
  const {
    cartItems,
    promoCode,
    discount,
    tax,
    shippingCost,
    subtotal,
    total,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode
  } = useCart()

  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState(false)
  const [promoSuccess, setPromoSuccess] = useState(false)

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPromoError(false)
    setPromoSuccess(false)

    if (!promoInput.trim()) return

    const success = applyPromoCode(promoInput)
    if (success) {
      setPromoSuccess(true)
      setPromoInput('')
    } else {
      setPromoError(true)
    }
  }

  // Calculate remaining for free shipping (limit 50 EUR)
  const freeShippingLimit = 50
  const remainingForFreeShipping = Math.max(0, freeShippingLimit - (subtotal - discount))
  const progressPercent = Math.min(100, ((subtotal - discount) / freeShippingLimit) * 100)

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-10 max-w-[1400px] mx-auto w-full">
        {/* Title */}
        <div className="border-b border-white/[0.07] pb-6 mb-8 text-left">
          <p className="font-code text-[9px] tracking-[0.35em] text-white/30 uppercase mb-2">CESTA DE COMPRA</p>
          <h1 className="font-bebas text-[42px] tracking-wide text-white uppercase leading-none">TU CARRITO</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 border border-white/[0.06] rounded-xl flex flex-col items-center bg-[#070707]">
            <p className="font-code text-xs tracking-widest text-white/30 uppercase mb-6">
              TU CARRITO DE COMPRA ESTÁ VACÍO
            </p>
            <Link
              href="/tienda"
              className="font-code text-[10px] tracking-[0.25em] text-black bg-white hover:bg-white/80 px-8 py-3.5 transition-colors uppercase font-bold rounded-sm"
            >
              VOLVER A LA TIENDA
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
            
            {/* LEFT COLUMN: Items List */}
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {cartItems.map((item) => {
                  const Illustration = ILLUSTRATIONS[item.model] || WayfarerSVG
                  return (
                    <motion.div
                      key={`${item.id}-${item.color}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-5 border border-white/[0.06] bg-[#0c0c0c] rounded-xl gap-6 text-left"
                    >
                      {/* Product Visual & Identity */}
                      <div className="flex items-center gap-5 flex-1 min-w-0">
                        {/* Interactive Colored Glasses Visual */}
                        <div className="w-[100px] h-[64px] flex-shrink-0 bg-black/40 border border-white/[0.08] rounded-lg p-1.5 flex items-center justify-center relative overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={90}
                              height={55}
                              className="object-contain w-full h-full"
                            />
                          ) : (
                            <>
                              <div
                                className="absolute inset-0"
                                style={{
                                  background: `radial-gradient(ellipse at 50% 50%, ${item.color}20 0%, transparent 80%)`,
                                }}
                              />
                              <Illustration color={item.color} className="w-full h-full opacity-85" />
                            </>
                          )}
                        </div>

                        {/* Title details */}
                        <div className="min-w-0">
                          <span className="font-code text-[9px] tracking-widest text-white/30 uppercase block">
                            {item.code}
                          </span>
                          <Link href={`/producto/${item.slug}`} className="font-display text-sm font-semibold text-white hover:text-white/80 transition-colors uppercase tracking-wide truncate block">
                            {item.name}
                          </Link>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block border border-white/20 flex-shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-code text-[9px] tracking-widest text-[#C4822A] uppercase block">
                              COLOR: {item.colorLabel || 'Estándar'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Price Panel */}
                      <div className="flex items-center justify-between sm:justify-end gap-10">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-white/15 bg-black rounded-sm h-9">
                          <button
                            onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)}
                            className="px-2.5 text-white/40 hover:text-white transition-colors h-full flex items-center justify-center"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="font-code text-[11px] text-white px-2 min-w-[24px] text-center select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)}
                            className="px-2.5 text-white/40 hover:text-white transition-colors h-full flex items-center justify-center"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        {/* Pricing */}
                        <div className="text-right w-24 flex-shrink-0">
                          <span className="font-display text-base font-bold text-white block">
                            {(item.price * item.quantity).toFixed(2)}
                          </span>
                          <span className="font-code text-[8px] tracking-widest text-white/30 uppercase">
                            EUR
                          </span>
                        </div>

                        {/* Remove item button */}
                        <button
                          onClick={() => removeFromCart(item.id, item.color)}
                          className="text-white/25 hover:text-[#CC0000] p-1.5 transition-colors flex-shrink-0"
                          title="Eliminar artículo"
                        >
                          <Trash2 size={15} strokeWidth={1.8} />
                        </button>
                      </div>

                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* RIGHT COLUMN: Order Summary */}
            <div className="space-y-6">
              
              {/* Shipping Progress Bar */}
              {remainingForFreeShipping > 0 ? (
                <div className="border border-white/[0.06] bg-[#0c0c0c] p-5 rounded-xl text-left">
                  <p className="font-code text-[9px] tracking-widest text-white/40 uppercase mb-2.5">
                    ENVÍO GRATUITO
                  </p>
                  <p className="font-code text-[10px] text-white/70 uppercase mb-3 leading-tight">
                    ¡TE FALTAN <span className="text-[#C4822A] font-bold">{remainingForFreeShipping.toFixed(2)} EUR</span> PARA OBTENER ENVÍO GRATIS!
                  </p>
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-[#C4822A] h-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="border border-[#1C3B1C] bg-[#0c0c0c]/80 p-5 rounded-xl text-left flex items-start gap-3">
                  <ShieldCheck size={16} className="text-[#4caf50] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-code text-[9px] tracking-widest text-[#4caf50] uppercase font-bold mb-1">
                      ¡ENVÍO GRATUITO CONSEGUIDO!
                    </p>
                    <p className="font-code text-[9px] text-white/40 uppercase leading-normal">
                      TU PEDIDO CUMPLE LAS CONDICIONES PARA EL ENVÍO ESTÁNDAR GRATUITO EN ESPAÑA.
                    </p>
                  </div>
                </div>
              )}

              {/* Order Summary Calculations Card */}
              <div className="border border-white/[0.06] bg-[#0c0c0c] p-6 rounded-xl text-left">
                <p className="font-code text-[10px] tracking-[0.25em] text-white/30 uppercase mb-6 border-b border-white/[0.06] pb-3 font-semibold">
                  RESUMEN DEL PEDIDO
                </p>

                {/* Pricing Details */}
                <div className="space-y-3 border-b border-white/[0.06] pb-4 mb-4 font-code text-[11px] uppercase text-white/50">
                  <div className="flex justify-between">
                    <span>SUBTOTAL</span>
                    <span className="text-white font-medium">{subtotal.toFixed(2)} EUR</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-[#CC0000]">
                      <span className="flex items-center gap-1.5">
                        <Tag size={11} />
                        DESCUENTO ({promoCode})
                      </span>
                      <span>-{discount.toFixed(2)} EUR</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>IVA (21%)</span>
                    <span className="text-white font-medium">+{tax.toFixed(2)} EUR</span>
                  </div>

                  <div className="flex justify-between">
                    <span>ENVÍO</span>
                    <span className="text-white font-medium">
                      {shippingCost === 0 ? 'GRATIS' : `${shippingCost.toFixed(2)} EUR`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline mb-6">
                  <span className="font-code text-xs text-white uppercase font-bold">TOTAL</span>
                  <div className="text-right">
                    <span className="font-display text-2xl font-bold text-white block">
                      {total.toFixed(2)} <span className="text-sm font-code text-white/40 ml-1">EUR</span>
                    </span>
                    <span className="font-code text-[8px] tracking-wider text-white/40 block uppercase mt-0.5">
                      IVA Y ENVÍO INCLUIDOS
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full bg-[#CC0000] hover:bg-[#B00000] text-white font-code text-[10px] tracking-[0.25em] py-4 rounded-sm font-bold uppercase transition-colors flex items-center justify-center gap-2 group"
                >
                  COMPLETAR PEDIDO
                  <ArrowRight size={12} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Promo Code Form */}
              <div className="border border-white/[0.06] bg-[#0c0c0c] p-5 rounded-xl text-left">
                <p className="font-code text-[9px] tracking-widest text-white/40 uppercase mb-3 block">
                  CÓDIGO PROMOCIONAL
                </p>

                {promoCode ? (
                  <div className="flex items-center justify-between border border-[#1C3B1C] bg-[#1C3B1C]/10 px-3 py-2.5 rounded-sm">
                    <div className="flex items-center gap-2 text-[#4caf50]">
                      <Tag size={11} />
                      <span className="font-code text-[10px] uppercase font-bold tracking-wider">{promoCode} APLICADO</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-white/30 hover:text-white transition-colors"
                      title="Eliminar código"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePromoSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="S2-XXXXXX"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-black border border-white/15 text-white font-code text-[10px] tracking-widest px-4 py-2.5 placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors uppercase rounded-sm"
                    />
                    <button
                      type="submit"
                      className="bg-white/10 border border-white/20 text-white font-code text-[10px] tracking-wider px-4 py-2.5 hover:bg-white hover:text-black transition-colors uppercase font-bold rounded-sm flex-shrink-0"
                    >
                      APLICAR
                    </button>
                  </form>
                )}

                {promoError && (
                  <p className="font-code text-[8px] text-[#CC0000] uppercase mt-2">
                    CÓDIGO INVÁLIDO. PRUEBA CON &quot;S2-WELCOME10&quot; O &quot;S2-10OFF&quot;.
                  </p>
                )}
                {promoSuccess && (
                  <p className="font-code text-[8px] text-[#4caf50] uppercase mt-2">
                    ¡CÓDIGO PROMOCIONAL APLICADO CON ÉXITO!
                  </p>
                )}
              </div>

              {/* Guarantees links */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06] text-left">
                <p className="font-code text-[8px] tracking-[0.15em] text-white/30 uppercase">
                  · ENVÍOS SEGUROS CON SEGUIMIENTO COMPLETO.
                </p>
                <p className="font-code text-[8px] tracking-[0.15em] text-white/30 uppercase">
                  · PAGO ENCRIPTADO SSL 100% GARANTIZADO.
                </p>
                <p className="font-code text-[8px] tracking-[0.15em] text-white/30 uppercase">
                  · 14 DÍAS DE PERÍODO DE DEVOLUCIÓN DE FÁCIL ACCESO.
                </p>
              </div>

            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
