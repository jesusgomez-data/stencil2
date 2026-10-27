'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/stencil2' },
  { label: 'TikTok',    href: 'https://www.tiktok.com/@stencil.2' },
  { label: 'Facebook',  href: 'https://www.facebook.com/stencil2' },
]

const HELP_LINKS = [
  { label: 'Envíos',              href: '/envio'    },
  { label: 'Devoluciones',        href: '/envio'    },
  { label: 'Preguntas frecuentes',href: '/faq'      },
]

const INFO_LINKS = [
  { label: 'Aviso legal',            href: '/aviso-legal'  },
  { label: 'Términos y condiciones', href: '/terminos'     },
  { label: 'Política de privacidad', href: '/privacidad'   },
  { label: 'Política de cookies',    href: '/cookies'      },
]

export default function Footer() {
  const handleOpenCookies = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('stencil2_open_cookie_settings'))
    }
  }
  return (
    <footer className="bg-black border-t border-white/[0.07]">

      {/* Main row */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[280px_1fr_160px_200px] gap-10 lg:gap-8">

          {/* Brand */}
          <div className="flex flex-col items-center text-center space-y-4">
            <Link
              href="/"
              className="group relative flex flex-col items-center justify-center focus:outline-none"
              aria-label="STENCIL2 — Inicio"
            >
              {/* Resplandor ambiental que respira suavemente */}
              <motion.div
                className="absolute w-28 h-28 rounded-full pointer-events-none blur-2xl -z-10"
                style={{
                  background: 'radial-gradient(circle, rgba(196,130,42,0.25) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)',
                }}
                animate={{
                  scale: [0.85, 1.25, 0.85],
                  opacity: [0.25, 0.65, 0.25],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Granada con levitación fluida y micro-interacción al interactuar */}
              <motion.div
                className="relative flex items-center justify-center p-2"
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 0.8, -0.8, 0],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                whileHover={{
                  scale: 1.12,
                  rotate: [0, -3, 3, 0],
                  transition: { duration: 0.35, ease: 'easeOut' },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/images/logo-grenade-white.png"
                  alt="STENCIL2"
                  width={42}
                  height={68}
                  className="h-13 w-auto object-contain transition-all duration-300 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] group-hover:drop-shadow-[0_0_22px_rgba(255,255,255,0.55)] group-hover:brightness-110"
                />

                {/* Destello de luz metálico (sheen) en hover */}
                <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
                </span>
              </motion.div>

              <p className="font-code text-[10px] tracking-[0.2em] group-hover:tracking-[0.28em] text-slate-400/70 group-hover:text-white transition-all duration-300 uppercase mt-2">
                JOINING CULTURE
              </p>
            </Link>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-code text-[10px] text-white/35 hover:text-white transition-colors tracking-wide"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <p className="font-code text-[11px] tracking-widest text-white uppercase">
              SUSCRÍBETE Y OBTÉN 10% OFF
            </p>
            <div className="flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 bg-white/[0.04] border border-white/15 text-white font-code text-[11px] px-4 py-2.5 placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors min-w-0"
              />
              <button className="bg-white/10 border border-white/20 text-white px-3 py-2.5 hover:bg-white hover:text-black transition-colors flex-shrink-0" aria-label="Suscribirme">
                <ArrowRight size={14} />
              </button>
            </div>
            <p className="font-code text-[8px] text-white/30 leading-tight uppercase">
              Al suscribirte aceptas nuestra <Link href="/privacidad" className="underline hover:text-white/60">Política de Privacidad</Link> y el envío de comunicaciones comerciales.
            </p>
          </div>

          {/* Ayuda */}
          <div className="space-y-3">
            <p className="font-code text-[10px] tracking-widest text-white/30 uppercase">AYUDA</p>
            <nav className="space-y-2">
              {HELP_LINKS.map(({ label, href }) => (
                <div key={label}>
                  <Link href={href} className="font-code text-[10px] text-white/40 hover:text-white transition-colors">
                    {label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Información */}
          <div className="space-y-3">
            <p className="font-code text-[10px] tracking-widest text-white/30 uppercase">INFORMACIÓN</p>
            <nav className="space-y-2">
              {INFO_LINKS.map(({ label, href }) => (
                <div key={label}>
                  <Link href={href} className="font-code text-[10px] text-white/40 hover:text-white transition-colors">
                    {label}
                  </Link>
                </div>
              ))}
              <div>
                <button
                  type="button"
                  onClick={handleOpenCookies}
                  className="font-code text-[10px] text-white/40 hover:text-[#C4822A] transition-colors uppercase text-left"
                >
                  Configurar cookies
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06] px-6 lg:px-8 py-4">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-code text-[10px] tracking-widest text-white/20 uppercase">
            © STENCIL2 2026 — TODOS LOS DERECHOS RESERVADOS
          </p>
          <span className="font-code text-[10px] tracking-wider text-white/15 uppercase">
            ESPAÑA
          </span>
        </div>
      </div>
    </footer>
  )
}
