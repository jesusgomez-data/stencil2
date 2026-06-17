'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Mail, Phone, MapPin, Check } from 'lucide-react'

export default function ContactoPage() {
  const [formSent, setFormSent] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && message) {
      setFormSent(true)
      setEmail('')
      setMessage('')
      setTimeout(() => setFormSent(false), 3000)
    }
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-10 max-w-[1200px] mx-auto w-full">
        {/* Header */}
        <div className="border-b border-white/[0.07] pb-6 mb-10 text-left">
          <p className="font-code text-[9px] tracking-[0.35em] text-white/30 uppercase mb-2">ATENCIÓN AL CLIENTE</p>
          <h1 className="font-bebas text-[42px] tracking-wide text-white uppercase leading-none">CONTACTO</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          {/* Info Column */}
          <div className="space-y-8 font-code uppercase text-white/50 text-xs">
            <p className="normal-case text-sm leading-relaxed">
              ¿Tienes alguna duda sobre tu pedido, envíos o características de nuestras gafas? Nuestro equipo de soporte está disponible las 24 horas del día, los 7 días de la semana para ayudarte.
            </p>

            <div className="space-y-4 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#C4822A] flex-shrink-0" />
                <div>
                  <span className="text-white/25 block text-[8px] tracking-wider">CORREO ELECTRÓNICO</span>
                  <span className="text-white text-[11px] font-bold">SUPPORT@STENCIL2.COM</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#C4822A] flex-shrink-0" />
                <div>
                  <span className="text-white/25 block text-[8px] tracking-wider">TELÉFONO</span>
                  <span className="text-white text-[11px] font-bold">+34 900 123 456</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[#C4822A] flex-shrink-0" />
                <div>
                  <span className="text-white/25 block text-[8px] tracking-wider">CENTRO DE DISTRIBUCIÓN</span>
                  <span className="text-white text-[11px] font-bold">MADRID, ESPAÑA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="border border-white/[0.06] bg-[#0c0c0c] p-6 md:p-8 rounded-xl">
            <h3 className="font-bebas text-xl text-white tracking-wide uppercase mb-6 border-b border-white/[0.05] pb-2">
              ENVÍANOS UN MENSAJE
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-white/15 text-white font-code text-[10px] tracking-widest px-4 py-3 focus:outline-none focus:border-white/30 transition-colors rounded-sm"
                  required
                />
              </div>

              <div>
                <label className="font-code text-[9px] tracking-widest text-white/40 uppercase block mb-2">MENSAJE</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-black border border-white/15 text-white font-code text-[10px] tracking-widest px-4 py-3 focus:outline-none focus:border-white/30 transition-colors rounded-sm resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black hover:bg-white/80 font-code text-[10px] tracking-[0.2em] py-3.5 rounded-sm font-bold uppercase transition-all flex items-center justify-center gap-2"
              >
                {formSent ? (
                  <>
                    <Check size={12} strokeWidth={2.5} className="text-[#1C3B1C]" />
                    ¡MENSAJE ENVIADO!
                  </>
                ) : (
                  'ENVIAR MENSAJE'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
