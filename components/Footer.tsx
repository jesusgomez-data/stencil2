'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

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

function FooterTacticalLogo() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isHovered, setIsHovered] = useState(false)
  const [glitch, setGlitch] = useState(false)

  const springX = useSpring(x, { stiffness: 220, damping: 18 })
  const springY = useSpring(y, { stiffness: 220, damping: 18 })

  const rotateX = useTransform(springY, [-0.5, 0.5], ['15deg', '-15deg'])
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-15deg', '15deg'])

  const glareX = useTransform(springX, [-0.5, 0.5], ['100%', '-20%'])
  const glareY = useTransform(springY, [-0.5, 0.5], ['100%', '-20%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    setGlitch(true)
    setTimeout(() => setGlitch(false), 220)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <Link
      href="/"
      className="group relative flex flex-col items-center justify-center focus:outline-none select-none"
      aria-label="STENCIL2 — Inicio"
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative flex items-center justify-center p-3"
        style={{ perspective: 700 }}
      >
        {/* Radar táctico / Ondas concéntricas que emanan de la anilla de la granada */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center">
          <motion.span
            className="absolute rounded-full border border-white/20"
            animate={{
              width: ['0px', '120px'],
              height: ['0px', '120px'],
              opacity: [0.7, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeOut',
              repeatDelay: 1.5,
            }}
          />
          <motion.span
            className="absolute rounded-full border border-[#C4822A]/40"
            animate={{
              width: ['0px', '95px'],
              height: ['0px', '95px'],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.3,
              repeatDelay: 1.5,
            }}
          />
        </div>

        {/* Halo de luz ambiental */}
        <motion.div
          className="absolute w-24 h-24 rounded-full pointer-events-none blur-2xl -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(196,130,42,0.25) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)',
          }}
          animate={{
            scale: isHovered ? 1.3 : [0.85, 1.15, 0.85],
            opacity: isHovered ? 0.75 : [0.25, 0.55, 0.25],
          }}
          transition={isHovered ? { duration: 0.3 } : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Granada física 3D con respuesta interactiva al cursor */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          animate={!isHovered ? {
            y: [0, -4, 0],
          } : { y: -6, scale: 1.12 }}
          transition={!isHovered ? {
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
          } : { duration: 0.25, ease: 'easeOut' }}
          className="relative flex items-center justify-center"
        >
          {/* Micro-glitch cromático streetwear al entrar el cursor */}
          <div
            className={`relative transition-all duration-300 ${
              glitch
                ? '[filter:drop-shadow(-3px_0_0_rgba(0,229,255,0.8))_drop-shadow(3px_0_0_rgba(255,0,85,0.8))]'
                : 'drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)] group-hover:drop-shadow-[0_0_24px_rgba(255,255,255,0.5)]'
            }`}
          >
            <Image
              src="/images/logo-grenade-white.png"
              alt="STENCIL2"
              width={42}
              height={68}
              className="h-13 w-auto object-contain transition-transform duration-300 pointer-events-none"
            />
          </div>

          {/* Reflejo especular holográfico según la posición del cursor */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.35) 0%, rgba(196,130,42,0.2) 40%, transparent 70%)',
              left: glareX,
              top: glareY,
              width: '110px',
              height: '110px',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </motion.div>
      </div>

      {/* Sello de frecuencia streetwear táctica */}
      <div className="flex items-center gap-1.5 my-1.5 opacity-30 group-hover:opacity-90 transition-opacity duration-300">
        <motion.span
          className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-[#C4822A]"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="w-10 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <motion.span
          className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-[#C4822A]"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </div>

      <p className="font-code text-[10px] tracking-[0.22em] group-hover:tracking-[0.3em] text-slate-400/70 group-hover:text-white transition-all duration-300 uppercase">
        JOINING CULTURE
      </p>
    </Link>
  )
}

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
            <FooterTacticalLogo />
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
