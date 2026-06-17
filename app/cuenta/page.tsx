'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { Order } from '@/types'
import { User, Package, Award, Heart, Shield, LogOut, ChevronDown, Sparkles, AlertCircle, Copy, Check } from 'lucide-react'
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

export default function CuentaPage() {
  const { loyaltyPoints, orders } = useCart()
  const [activeTab, setActiveTab] = useState<'perfil' | 'pedidos' | 'lealtad'>('perfil')
  const [openOrderIndex, setOpenOrderIndex] = useState<string | null>(null)
  
  // Profile local states
  const [name, setName] = useState('Jesús Gómez')
  const [email, setEmail] = useState('jesus@example.com')
  const [phone, setPhone] = useState('600 123 456')
  const [isSaved, setIsSaved] = useState(false)

  // Points Redemption State
  const [claimedCode, setClaimedCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Load profile from localStorage if exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('stencil2_profile_name')
      const storedEmail = localStorage.getItem('stencil2_profile_email')
      const storedPhone = localStorage.getItem('stencil2_profile_phone')
      if (storedName) setName(storedName)
      if (storedEmail) setEmail(storedEmail)
      if (storedPhone) setPhone(storedPhone)
    }
  }, [])

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('stencil2_profile_name', name)
    localStorage.setItem('stencil2_profile_email', email)
    localStorage.setItem('stencil2_profile_phone', phone)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleClaimReward = (pointsNeeded: number, code: string) => {
    if (loyaltyPoints >= pointsNeeded) {
      // Deduct points (this would normally be handled in the Context or DB, let's mock it)
      const currentPoints = parseInt(localStorage.getItem('stencil2_points') || '0', 10)
      const newPoints = Math.max(0, currentPoints - pointsNeeded)
      localStorage.setItem('stencil2_points', newPoints.toString())
      
      // Force page reload/state sync for points (since it's a simple localState in CartContext)
      // For this mock, we can set the claimed code
      setClaimedCode(code)
      // Just reload the page or trigger state update
      window.location.reload()
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-10 max-w-[1400px] mx-auto w-full">
        {/* Title */}
        <div className="border-b border-white/[0.07] pb-6 mb-8 text-left">
          <p className="font-code text-[9px] tracking-[0.35em] text-white/30 uppercase mb-2">ÁREA DE CLIENTE</p>
          <h1 className="font-bebas text-[42px] tracking-wide text-white uppercase leading-none">MI CUENTA</h1>
        </div>

        {/* Layout split */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 items-start">
          
          {/* LEFT: Sidebar Navigation Tabs */}
          <nav className="flex flex-row lg:flex-col border-b lg:border-b-0 lg:border-r border-white/[0.07] pb-4 lg:pb-0 lg:pr-6 gap-2 w-full overflow-x-auto whitespace-nowrap lg:whitespace-normal">
            <button
              onClick={() => setActiveTab('perfil')}
              className={`flex items-center gap-3 font-code text-[10px] tracking-widest px-4 py-3.5 transition-all uppercase rounded-sm ${
                activeTab === 'perfil'
                  ? 'bg-white text-black font-bold'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <User size={13} />
              MIS DATOS
            </button>
            <button
              onClick={() => setActiveTab('pedidos')}
              className={`flex items-center gap-3 font-code text-[10px] tracking-widest px-4 py-3.5 transition-all uppercase rounded-sm relative ${
                activeTab === 'pedidos'
                  ? 'bg-white text-black font-bold'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Package size={13} />
              PEDIDOS ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('lealtad')}
              className={`flex items-center gap-3 font-code text-[10px] tracking-widest px-4 py-3.5 transition-all uppercase rounded-sm ${
                activeTab === 'lealtad'
                  ? 'bg-white text-black font-bold'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Award size={13} />
              PUNTOS Y LEALTAD
            </button>
          </nav>

          {/* RIGHT: Tab Contents */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: Profile Details */}
              {activeTab === 'perfil' && (
                <motion.div
                  key="perfil"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="border border-white/[0.06] bg-[#0c0c0c] p-6 md:p-8 rounded-xl text-left"
                >
                  <h2 className="font-bebas text-2xl text-white tracking-wide uppercase mb-6 border-b border-white/[0.05] pb-2">
                    DATOS DE CONTACTO
                  </h2>
                  <form onSubmit={handleProfileSave} className="space-y-5 max-w-lg">
                    <div>
                      <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">NOMBRE COMPLETO</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black border border-white/15 text-white font-code text-[10px] tracking-widest px-4 py-3.5 focus:outline-none focus:border-white/30 transition-colors uppercase rounded-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">CORREO ELECTRÓNICO</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black border border-white/15 text-white font-code text-[10px] tracking-widest px-4 py-3.5 focus:outline-none focus:border-white/30 transition-colors rounded-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">TELÉFONO</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-black border border-white/15 text-white font-code text-[10px] tracking-widest px-4 py-3.5 focus:outline-none focus:border-white/30 transition-colors rounded-sm"
                      />
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                      <button
                        type="submit"
                        className="bg-white text-black hover:bg-white/80 font-code text-[10px] tracking-[0.2em] px-8 py-3.5 rounded-sm font-bold uppercase transition-colors"
                      >
                        GUARDAR CAMBIOS
                      </button>
                      {isSaved && (
                        <span className="font-code text-[9px] text-[#4caf50] uppercase font-bold flex items-center gap-1.5">
                          <Check size={11} strokeWidth={2.5} />
                          DATOS ACTUALIZADOS
                        </span>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}

              {/* TAB 2: Orders History */}
              {activeTab === 'pedidos' && (
                <motion.div
                  key="pedidos"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 text-left"
                >
                  {orders.length === 0 ? (
                    <div className="text-center py-20 border border-white/[0.06] bg-[#0c0c0c] rounded-xl">
                      <Package size={20} className="text-white/20 mx-auto mb-4" />
                      <p className="font-code text-[10px] tracking-widest text-white/30 uppercase">
                        NO TIENES NINGÚN PEDIDO EN TU HISTORIAL
                      </p>
                    </div>
                  ) : (
                    orders.map((order) => {
                      const isOpen = openOrderIndex === order.id
                      return (
                        <div
                          key={order.id}
                          className="border border-white/[0.06] bg-[#0c0c0c] rounded-xl overflow-hidden transition-all"
                        >
                          {/* Order Header Summary */}
                          <button
                            onClick={() => setOpenOrderIndex(isOpen ? null : order.id)}
                            className="w-full p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
                          >
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 w-full text-left font-code text-[10px] uppercase">
                              <div>
                                <span className="text-white/30 block mb-1">PEDIDO</span>
                                <span className="text-[#C4822A] font-bold block">{order.id}</span>
                              </div>
                              <div>
                                <span className="text-white/30 block mb-1">FECHA</span>
                                <span className="text-white/70 block">{order.date}</span>
                              </div>
                              <div>
                                <span className="text-white/30 block mb-1">ESTADO</span>
                                <span className="text-[#4caf50] font-bold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#4caf50] animate-ping" />
                                  PROCESANDO
                                </span>
                              </div>
                              <div>
                                <span className="text-white/30 block mb-1">TOTAL</span>
                                <span className="text-white font-bold block">{order.total.toFixed(2)} EUR</span>
                              </div>
                            </div>
                            <ChevronDown
                              size={14}
                              className={`text-white/40 transform transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {/* Order Details Body */}
                          {isOpen && (
                            <div className="px-5 pb-5 pt-3 border-t border-white/[0.05] space-y-4">
                              {/* Items list */}
                              <div className="space-y-3">
                                {order.items.map((item) => {
                                  const Illustration = ILLUSTRATIONS[item.model] || WayfarerSVG
                                  return (
                                    <div key={`${item.id}-${item.color}`} className="flex items-center gap-4 py-2">
                                      <div className="w-[60px] h-[38px] bg-black border border-white/[0.05] rounded p-1 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                                        <div
                                          className="absolute inset-0"
                                          style={{
                                            background: `radial-gradient(ellipse at 50% 50%, ${item.color}15 0%, transparent 80%)`,
                                          }}
                                        />
                                        <Illustration color={item.color} className="w-full h-full opacity-80" />
                                      </div>
                                      <div className="flex-1 min-w-0 font-code text-[9px] uppercase">
                                        <p className="font-display text-xs font-semibold text-white truncate">{item.name}</p>
                                        <span className="text-[#C4822A]">COLOR: {item.colorLabel}</span>
                                        <span className="text-white/30 ml-3">CANTIDAD: {item.quantity}</span>
                                      </div>
                                      <span className="font-display text-xs font-bold text-white whitespace-nowrap">
                                        {(item.price * item.quantity).toFixed(2)} EUR
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>

                              {/* Billing and Delivery Address */}
                              <div className="border-t border-white/[0.05] pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 font-code text-[9px] uppercase text-white/40 leading-normal">
                                <div>
                                  <span className="text-white/20 block mb-1">DIRECCIÓN DE ENVÍO</span>
                                  <p className="text-white/70 font-semibold">{order.shippingAddress.name}</p>
                                  <p>{order.shippingAddress.address}</p>
                                  <p>{order.shippingAddress.postalCode} - {order.shippingAddress.city}</p>
                                </div>
                                <div className="text-left md:text-right space-y-1">
                                  <div className="flex justify-between md:justify-end gap-6">
                                    <span>SUBTOTAL:</span>
                                    <span className="text-white/70 font-medium">{order.subtotal.toFixed(2)} EUR</span>
                                  </div>
                                  {order.discount > 0 && (
                                    <div className="flex justify-between md:justify-end gap-6 text-[#CC0000]">
                                      <span>DESCUENTO:</span>
                                      <span>-{order.discount.toFixed(2)} EUR</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between md:justify-end gap-6">
                                    <span>ENVÍO:</span>
                                    <span className="text-white/70 font-medium">
                                      {order.shipping === 0 ? 'GRATIS' : `${order.shipping.toFixed(2)} EUR`}
                                    </span>
                                  </div>
                                  <div className="flex justify-between md:justify-end gap-6 border-t border-white/[0.05] pt-1.5 font-bold text-white text-xs">
                                    <span>TOTAL:</span>
                                    <span>{order.total.toFixed(2)} EUR</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </motion.div>
              )}

              {/* TAB 3: Loyalty Program */}
              {activeTab === 'lealtad' && (
                <motion.div
                  key="lealtad"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 text-left"
                >
                  {/* Points Balance Card */}
                  <div className="border border-white/[0.06] bg-[#0c0c0c] p-6 md:p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C4822A]/5 blur-3xl rounded-full" />
                    <div>
                      <span className="font-code text-[9px] tracking-[0.25em] text-[#C4822A] uppercase font-bold block mb-1">PROGRAMA DE FIDELIDAD</span>
                      <h2 className="font-bebas text-2xl text-white tracking-wide uppercase">TUS PUNTOS ACUMULADOS</h2>
                      <p className="font-code text-[10px] text-white/30 max-w-sm mt-2 leading-relaxed uppercase">
                        Ganas 1 punto por cada 1 EUR gastado. Canjea tus puntos por códigos promocionales exclusivos de descuento directo en tus próximas compras.
                      </p>
                    </div>

                    <div className="border border-white/10 bg-black/60 rounded-xl px-8 py-5 text-center flex-shrink-0 relative z-10 shadow-lg">
                      <Sparkles size={16} className="text-[#C4822A] mx-auto mb-1 animate-pulse" />
                      <span className="font-display text-4xl font-extrabold text-white block leading-none">
                        {loyaltyPoints}
                      </span>
                      <span className="font-code text-[9px] tracking-widest text-white/40 block mt-1 uppercase">
                        PUNTOS S2
                      </span>
                    </div>
                  </div>

                  {/* Rewards Catalog */}
                  <div className="border border-white/[0.06] bg-[#0c0c0c] p-6 md:p-8 rounded-xl">
                    <h3 className="font-bebas text-xl text-white tracking-wide uppercase mb-6 border-b border-white/[0.05] pb-2">
                      RECOMPENSAS DISPONIBLES
                    </h3>

                    <div className="space-y-4">
                      {/* Reward 1 */}
                      <div className="flex items-center justify-between p-4 border border-white/[0.05] bg-black rounded-lg">
                        <div>
                          <p className="font-code text-[11px] font-bold text-white uppercase">10% DE DESCUENTO ADICIONAL</p>
                          <p className="font-code text-[9px] text-white/30 uppercase mt-0.5">Canjea 100 puntos por el código de un solo uso S2-10OFF</p>
                        </div>
                        <button
                          onClick={() => handleClaimReward(100, 'S2-10OFF')}
                          disabled={loyaltyPoints < 100}
                          className={`font-code text-[8px] tracking-widest px-4 py-2.5 rounded-sm font-bold uppercase transition-colors ${
                            loyaltyPoints >= 100
                              ? 'bg-white text-black hover:bg-white/80'
                              : 'border border-white/10 text-white/20 cursor-not-allowed'
                          }`}
                        >
                          CANJEAR (100 PTS)
                        </button>
                      </div>

                      {/* Reward 2 */}
                      <div className="flex items-center justify-between p-4 border border-white/[0.05] bg-black rounded-lg">
                        <div>
                          <p className="font-code text-[11px] font-bold text-white uppercase">ENVÍO URGENTE TOTALMENTE GRATIS</p>
                          <p className="font-code text-[9px] text-white/30 uppercase mt-0.5">Canjea 150 puntos por envío urgente gratuito sin compra mínima</p>
                        </div>
                        <button
                          onClick={() => handleClaimReward(150, 'S2-FREE')}
                          disabled={loyaltyPoints < 150}
                          className={`font-code text-[8px] tracking-widest px-4 py-2.5 rounded-sm font-bold uppercase transition-colors ${
                            loyaltyPoints >= 150
                              ? 'bg-white text-black hover:bg-white/80'
                              : 'border border-white/10 text-white/20 cursor-not-allowed'
                          }`}
                        >
                          CANJEAR (150 PTS)
                        </button>
                      </div>

                      {/* Reward 3 */}
                      <div className="flex items-center justify-between p-4 border border-white/[0.05] bg-black rounded-lg font-code">
                        <div>
                          <p className="font-code text-[11px] font-bold text-white uppercase">15% DE DESCUENTO ADICIONAL</p>
                          <p className="font-code text-[9px] text-white/30 uppercase mt-0.5">Canjea 250 puntos por el código de un solo uso S2-WELCOME10</p>
                        </div>
                        <button
                          onClick={() => handleClaimReward(250, 'S2-WELCOME10')}
                          disabled={loyaltyPoints < 250}
                          className={`font-code text-[8px] tracking-widest px-4 py-2.5 rounded-sm font-bold uppercase transition-colors ${
                            loyaltyPoints >= 250
                              ? 'bg-white text-black hover:bg-white/80'
                              : 'border border-white/10 text-white/20 cursor-not-allowed'
                          }`}
                        >
                          CANJEAR (250 PTS)
                        </button>
                      </div>
                    </div>

                    {/* Show Claimed reward details */}
                    {claimedCode && (
                      <div className="mt-6 border border-[#1C3B1C] bg-[#1C3B1C]/10 p-4 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-code text-[9px] tracking-widest text-[#4caf50] uppercase font-bold block mb-1">¡CÓDIGO CANJEADO CON ÉXITO!</p>
                          <span className="font-code text-xs text-white uppercase font-bold tracking-widest">{claimedCode}</span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(claimedCode)}
                          className="flex items-center gap-1.5 border border-white/10 hover:border-white/30 text-white font-code text-[9px] px-3.5 py-2 rounded uppercase transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check size={11} strokeWidth={2.5} className="text-[#4caf50]" />
                              COPIADO
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              COPIAR CÓDIGO
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
