'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Shield, Check, X, Settings2, ChevronRight } from 'lucide-react'

export interface CookiePreferences {
  technical: boolean // Always true
  analytics: boolean
  marketing: boolean
  timestamp: string
}

const COOKIE_STORAGE_KEY = 'stencil2_cookie_consent_v1'

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  
  // Preferences state
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true)
  const [marketingAllowed, setMarketingAllowed] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check existing consent
    try {
      const stored = localStorage.getItem(COOKIE_STORAGE_KEY)
      if (stored) {
        const parsed: CookiePreferences = JSON.parse(stored)
        setAnalyticsAllowed(parsed.analytics)
        setMarketingAllowed(parsed.marketing)
      } else {
        // First visit -> show banner after a gentle delay
        const timer = setTimeout(() => setShowBanner(true), 800)
        return () => clearTimeout(timer)
      }
    } catch {
      setShowBanner(true)
    }

    // Global listener so any button (e.g. from Footer or Cookies page) can reopen the settings
    const handleOpenSettings = () => {
      setShowConfigModal(true)
      setShowBanner(false)
    }

    window.addEventListener('stencil2_open_cookie_settings', handleOpenSettings)
    return () => {
      window.removeEventListener('stencil2_open_cookie_settings', handleOpenSettings)
    }
  }, [])

  const savePreferences = (analytics: boolean, marketing: boolean) => {
    const preferences: CookiePreferences = {
      technical: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    }

    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(preferences))
      window.dispatchEvent(
        new CustomEvent('stencil2_cookie_consent_updated', { detail: preferences })
      )
    } catch (e) {
      console.error('Error saving cookie preferences:', e)
    }

    setShowBanner(false)
    setShowConfigModal(false)
  }

  const handleAcceptAll = () => {
    setAnalyticsAllowed(true)
    setMarketingAllowed(true)
    savePreferences(true, true)
  }

  const handleRejectNonEssential = () => {
    setAnalyticsAllowed(false)
    setMarketingAllowed(false)
    savePreferences(false, false)
  }

  const handleSaveCustom = () => {
    savePreferences(analyticsAllowed, marketingAllowed)
  }

  if (!mounted) return null

  return (
    <>
      {/* 1. FIRST LAYER: Sleek Bottom Banner (AEPD & RGPD Compliant) */}
      <AnimatePresence>
        {showBanner && !showConfigModal && (
          <motion.aside
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Aviso de cookies"
            role="dialog"
            className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/[0.12] p-5 md:p-6 rounded-2xl shadow-2xl text-left"
          >
            <div className="flex items-start gap-3.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#C4822A]/15 border border-[#C4822A]/30 flex items-center justify-center text-[#C4822A] flex-shrink-0 mt-0.5">
                <Cookie size={16} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-code text-[8px] tracking-[0.25em] text-[#C4822A] uppercase font-bold">
                    TRANSPARENCIA LEGAL
                  </span>
                  <span className="font-code text-[8px] text-white/30 uppercase">· AEPD / RGPD</span>
                </div>
                <h3 className="font-bebas text-lg md:text-xl text-white tracking-wide uppercase leading-none">
                  VALORAMOS TU PRIVACIDAD
                </h3>
              </div>
            </div>

            <p className="font-code text-[10px] text-white/60 leading-relaxed uppercase mb-4">
              Utilizamos cookies propias y de terceros técnicas para el funcionamiento seguro de la tienda y el carrito, así como analíticas para medir visitas de forma anónima. Puedes aceptarlas todas, rechazarlas o configurar tus preferencias según la normativa española y europea.
            </p>

            <div className="flex items-center gap-3 text-[9px] font-code text-white/40 uppercase mb-4">
              <Link href="/cookies" className="hover:text-white underline underline-offset-4 transition-colors">
                Política de cookies
              </Link>
              <span>·</span>
              <Link href="/privacidad" className="hover:text-white underline underline-offset-4 transition-colors">
                Política de privacidad
              </Link>
            </div>

            {/* Action Buttons - In accordance with AEPD: Accept and Reject have equal visibility */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full bg-white hover:bg-white/90 text-black font-code text-[9px] tracking-wider py-2.5 px-3 rounded-md font-bold uppercase transition-all text-center"
              >
                ACEPTAR TODAS
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="w-full bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 font-code text-[9px] tracking-wider py-2.5 px-3 rounded-md font-medium uppercase transition-all text-center"
              >
                RECHAZAR TODAS
              </button>
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="w-full bg-transparent hover:bg-white/[0.04] text-white/70 hover:text-white border border-white/[0.08] font-code text-[9px] tracking-wider py-2.5 px-3 rounded-md uppercase transition-all text-center flex items-center justify-center gap-1.5"
              >
                <Settings2 size={12} />
                CONFIGURAR
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 2. SECOND LAYER: Granular Configuration Modal */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfigModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-config-title"
              className="relative w-full max-w-2xl bg-[#0c0c0c] border border-white/[0.12] rounded-2xl p-6 md:p-8 text-left shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-code text-[8px] tracking-[0.3em] text-[#C4822A] uppercase font-bold">
                      PANEL DE CONTROL
                    </span>
                    <span className="font-code text-[8px] text-white/30 uppercase">· PREFERENCIAS DE PRIVACIDAD</span>
                  </div>
                  <h2 id="cookie-config-title" className="font-bebas text-2xl md:text-3xl text-white tracking-wide uppercase leading-none">
                    CONFIGURACIÓN DE COOKIES
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="text-white/40 hover:text-white p-1 rounded-md transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="font-code text-[10px] text-white/50 uppercase leading-relaxed">
                Aquí puedes personalizar y gestionar el uso de cookies en STENCIL2. Las cookies técnicas son estrictamente necesarias para procesar pedidos, mantener tu carrito de compra y garantizar la seguridad de tus transacciones.
              </p>

              {/* Cookie Categories List */}
              <div className="space-y-4">
                
                {/* 1. Necessary Cookies (Always On) */}
                <div className="border border-white/[0.08] bg-white/[0.02] p-4 rounded-xl flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-[#C4822A]" />
                      <h4 className="font-code text-xs font-bold text-white uppercase tracking-wider">
                        COOKIES TÉCNICAS Y ESENCIALES
                      </h4>
                      <span className="bg-white/10 text-white/70 font-code text-[8px] px-2 py-0.5 rounded uppercase">
                        SIEMPRE ACTIVAS
                      </span>
                    </div>
                    <p className="font-code text-[9px] text-white/40 leading-relaxed uppercase">
                      Obligatorias para la navegación básica, la persistencia del carrito de compra, la prevención de fraudes y la seguridad en la pasarela de pagos homologada (Stripe). No recopilan datos para fines comerciales.
                    </p>
                  </div>
                  <div className="flex-shrink-0 pt-1">
                    <span className="font-code text-[9px] text-[#C4822A] uppercase font-bold tracking-wider">
                      OBLIGATORIAS
                    </span>
                  </div>
                </div>

                {/* 2. Analytics Cookies */}
                <div className="border border-white/[0.08] bg-white/[0.02] p-4 rounded-xl flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Cookie size={14} className="text-white/60" />
                      <h4 className="font-code text-xs font-bold text-white uppercase tracking-wider">
                        COOKIES ANALÍTICAS Y DE MEDICIÓN
                      </h4>
                    </div>
                    <p className="font-code text-[9px] text-white/40 leading-relaxed uppercase">
                      Permiten cuantificar el número de usuarios y realizar mediciones estadísticas anónimas (ej. Vercel Analytics y contador de visitas del proyecto) con el fin de optimizar el rendimiento y la velocidad de carga de la web.
                    </p>
                  </div>
                  <div className="flex-shrink-0 pt-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={analyticsAllowed}
                        onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C4822A]"></div>
                    </label>
                  </div>
                </div>

                {/* 3. Marketing & Personalization Cookies */}
                <div className="border border-white/[0.08] bg-white/[0.02] p-4 rounded-xl flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Cookie size={14} className="text-white/60" />
                      <h4 className="font-code text-xs font-bold text-white uppercase tracking-wider">
                        COOKIES DE PERSONALIZACIÓN Y MARKETING
                      </h4>
                    </div>
                    <p className="font-code text-[9px] text-white/40 leading-relaxed uppercase">
                      Utilizadas para recordar tus preferencias de visualización, ofertas y promociones personalizadas según tus hábitos de navegación.
                    </p>
                  </div>
                  <div className="flex-shrink-0 pt-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingAllowed}
                        onChange={(e) => setMarketingAllowed(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C4822A]"></div>
                    </label>
                  </div>
                </div>

              </div>

              {/* Informative Footer Links */}
              <div className="text-[9px] font-code text-white/40 uppercase flex items-center justify-between border-t border-white/[0.08] pt-4">
                <span>Puedes consultar la lista detallada en nuestra</span>
                <Link
                  href="/cookies"
                  onClick={() => setShowConfigModal(false)}
                  className="text-white hover:text-[#C4822A] underline underline-offset-4 transition-colors flex items-center gap-1 font-bold"
                >
                  POLÍTICA DE COOKIES <ChevronRight size={12} />
                </Link>
              </div>

              {/* Bottom Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="w-full bg-white hover:bg-white/90 text-black font-code text-[9px] tracking-wider py-3 px-3 rounded-md font-bold uppercase transition-all text-center"
                >
                  ACEPTAR TODAS
                </button>
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="w-full bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 font-code text-[9px] tracking-wider py-3 px-3 rounded-md font-medium uppercase transition-all text-center"
                >
                  RECHAZAR TODAS
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="w-full bg-[#C4822A] hover:bg-[#d8943f] text-black font-code text-[9px] tracking-wider py-3 px-3 rounded-md font-bold uppercase transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <Check size={13} strokeWidth={2.5} />
                  GUARDAR PREFERENCIAS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
