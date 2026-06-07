'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import {
  ArrowRight, Truck, Shield, Award, Headphones,
  ChevronLeft, ChevronRight, Plus, ChevronUp, ChevronDown,
  Home, Search, Compass, LayoutGrid, Play, AlignJustify, Grid3x3,
} from 'lucide-react'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/* ─── Data ────────────────────────────────────────────────────────── */

const LEFT_NAV = [
  { Icon: Home,        label: 'Inicio',       href: '/'       },
  { Icon: Search,      label: 'Buscar',        href: '#'       },
  { Icon: Compass,     label: 'Explorar',      href: '#'       },
  { Icon: LayoutGrid,  label: 'Colecciones',   href: '/tienda', active: true },
  { Icon: Play,        label: 'Video',         href: '#'       },
  { Icon: AlignJustify,label: 'Lista',         href: '#'       },
  { Icon: Grid3x3,     label: 'Grid',          href: '#'       },
]

const TRUST_BADGES = [
  { Icon: Truck,      title: 'ENVÍO GRATIS',  desc: 'En compras mayores a $50'     },
  { Icon: Shield,     title: 'PAGOS SEGUROS', desc: 'Tus datos siempre protegidos'  },
  { Icon: Award,      title: 'GARANTÍA',      desc: '30 días de garantía'           },
  { Icon: Headphones, title: 'ATENCIÓN 24/7', desc: 'Estamos para ayudarte'         },
]

const COLLECTION_PRODUCTS = [
  {
    id:              'classic-blue',
    name:            'CLASSIC BLUE',
    price:           '$ 29.00',
    image:           '/images/classic-blue-ref.png',
    frameColor:      '#C4822A',
    isNew:           false,
    whiteBg:         false,
  },
  {
    id:              'onyx-black',
    name:            'ONYX BLACK',
    price:           '$ 29.00',
    image:           '/images/onyx-black-ref.png',
    frameColor:      '#111111',
    isNew:           false,
    whiteBg:         false,
  },
  {
    id:              'olive-crystal',
    name:            'OLIVE CRYSTAL',
    price:           '$ 29.00',
    image:           '/images/olive-crystal-ref.png',
    frameColor:      '#3A5A28',
    isNew:           false,
    whiteBg:         false,
  },
  {
    id:              'smoke-grey',
    name:            'SMOKE GREY',
    price:           '$ 29.00',
    image:           '/images/smoke-grey-ref.png',
    frameColor:      '#555555',
    isNew:           false,
    whiteBg:         false,
  },
]

/* ─── HERO ────────────────────────────────────────────────────────── */

function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.5
  }, [])

  return (
    <section className="w-full h-[52vh] md:h-[65vh] lg:h-screen bg-black flex overflow-hidden">

      {/* ── LEFT SIDEBAR — columna sólida negra ── */}
      <div
        className="hidden lg:flex flex-col items-center flex-shrink-0 bg-black z-30"
        style={{ width: '58px', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div style={{ height: '80px', flexShrink: 0 }} />
        <nav className="flex-1 flex flex-col items-center justify-center gap-6">
          {LEFT_NAV.map(({ Icon, label, href, active }) => (
            <Link
              key={label} href={href} title={label}
              className={`p-1.5 transition-all duration-200 ${
                active
                  ? 'text-[#C4822A] drop-shadow-[0_0_8px_rgba(196,130,42,0.5)]'
                  : 'text-white/25 hover:text-white/65'
              }`}
            >
              <Icon size={15} strokeWidth={1.3} />
            </Link>
          ))}
        </nav>
        <div className="pb-5 flex flex-col items-center gap-3">
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.07)' }} />
          <Image
            src="/images/logo-grenade-white.png" alt=""
            width={18} height={28}
            className="object-contain"
            style={{ height: '22px', width: 'auto', opacity: 0.18 }}
          />
        </div>
      </div>

      {/* ── VIDEO CENTER — el video solo vive aquí ── */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover object-center select-none"
          style={{ transform: 'scale(1.32)', transformOrigin: 'center center' }}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Top vignette */}
        <div
          className="absolute inset-x-0 top-0 h-36 pointer-events-none z-[6]"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.60) 0%, transparent 100%)' }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-[6]"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)' }}
        />

        {/* Desktop CTA */}
        <motion.div
          className="absolute bottom-8 z-10 hidden lg:flex flex-col gap-2"
          style={{ left: '28px' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <span className="font-code text-[8px] tracking-[0.38em] text-white/30 uppercase">
            JOINING CULTURE
          </span>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 font-code text-[10px] tracking-[0.22em] text-white/55 hover:text-white transition-colors uppercase group"
          >
            VER COLECCIÓN
            <ArrowRight size={10} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Mobile CTA */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 z-10 lg:hidden">
          <span className="font-code text-[8px] tracking-[0.35em] text-white/30 uppercase">
            JOINING CULTURE
          </span>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 font-code text-[10px] tracking-[0.22em] text-white/65 border border-white/20 px-7 py-3 uppercase hover:text-white hover:border-white/50 transition-colors group"
          >
            VER COLECCIÓN
            <ArrowRight size={10} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ── RIGHT SIDEBAR — columna sólida negra ── */}
      <div
        className="hidden lg:flex flex-col items-center flex-shrink-0 bg-black z-30"
        style={{ width: '58px', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div style={{ height: '80px', flexShrink: 0 }} />

        {/* Plus */}
        <button className="mt-3 mb-1 text-white/30 hover:text-white transition-colors p-1.5">
          <Plus size={15} strokeWidth={1.3} />
        </button>

        {/* Scroll track */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <button className="text-white/25 hover:text-white/60 transition-colors p-1">
            <ChevronUp size={13} strokeWidth={1.5} />
          </button>
          <div className="flex flex-col items-center gap-[3px] py-1">
            <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.10)' }} />
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#C4822A', boxShadow: '0 0 6px rgba(196,130,42,0.7)',
            }} />
            <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.10)' }} />
          </div>
          <button className="text-white/25 hover:text-white/60 transition-colors p-1">
            <ChevronDown size={13} strokeWidth={1.5} />
          </button>
        </div>

        {/* Bottom arrows */}
        <div className="pb-5 flex flex-col items-center gap-0.5">
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.07)', marginBottom: '8px' }} />
          <button className="text-white/20 hover:text-white/45 transition-colors p-0.5">
            <ChevronUp size={11} strokeWidth={1.3} />
          </button>
          <button className="text-white/20 hover:text-white/45 transition-colors p-0.5">
            <ChevronDown size={11} strokeWidth={1.3} />
          </button>
        </div>
      </div>

    </section>
  )
}

/* ─── TRUST BADGES ────────────────────────────────────────────────── */

const TRUST_BORDER = [
  'border-r border-b border-white/[0.052] lg:border-b-0',
  'border-b border-white/[0.052] lg:border-b-0 lg:border-r lg:border-white/[0.052]',
  'border-r border-white/[0.052] lg:border-r',
  '',
]

function TrustBadgesBar() {
  return (
    <div className="bg-[#0d0d0d] border-y border-white/[0.055]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap">
          {TRUST_BADGES.map(({ Icon, title, desc }, i) => (
            <div key={title} className={`flex items-center gap-4 py-5 px-4 lg:px-7 w-1/2 lg:w-1/4 ${TRUST_BORDER[i]}`}>
              <Icon size={18} strokeWidth={1.4} className="text-white/28 flex-shrink-0" />
              <div>
                <p className="font-code text-[10px] tracking-[0.13em] text-white uppercase leading-none mb-1">
                  {title}
                </p>
                <p className="font-code text-[9px] text-white/28 leading-none">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── COLLECTIONS ─────────────────────────────────────────────────── */

function CollectionsSection() {
  const [selected, setSelected] = useState('classic-blue')

  return (
    <section className="bg-black pt-10 pb-14">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          {/* Editorial banner (Column 1, spans both rows on large screens) */}
          <div className="relative overflow-hidden rounded-xl sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:h-auto h-[390px] aspect-[3/4] sm:aspect-auto lg:aspect-auto border border-white/[0.055] group flex flex-col justify-between p-6 md:p-8 z-10">
            <div className="absolute inset-0 overflow-hidden z-0">
              <Image
                src="/images/joining-culture.png"
                alt="JOINING CULTURE"
                fill
                className="object-cover object-center opacity-62 group-hover:opacity-74 group-hover:scale-[1.04] transition-all duration-700"
              />
            </div>
            <div
              className="absolute inset-0 z-[1]"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.92) 100%)',
              }}
            />

            {/* Top Text Group */}
            <div className="relative z-10 text-left">
              <p className="font-code text-[8px] tracking-[0.35em] text-white/40 uppercase mb-3">
                NUEVA COLECCIÓN
              </p>
              <h2 className="font-bebas text-[38px] leading-[0.88] text-white tracking-wide">
                JOINING<br />CULTURE
              </h2>
            </div>

            {/* Bottom Text Group */}
            <div className="relative z-10 mt-auto text-left">
              <Link
                href="/tienda"
                className="group/cta inline-flex items-center font-code text-[9px] tracking-widest text-white/50 hover:text-white transition-all uppercase"
              >
                <span className="border-b border-white/20 group-hover/cta:border-white pb-1 mr-3 transition-colors">
                  VER COLECCIÓN
                </span>
                <ArrowRight
                  size={10}
                  strokeWidth={2}
                  className="group-hover/cta:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>
          </div>

          {/* Header row (spans columns 2 to 5, Row 1 on large screens) */}
          <div className="sm:col-span-2 lg:col-span-4 lg:row-start-1 lg:col-start-2 flex items-center justify-between pb-3 mt-1 mb-2 lg:mb-0">
            <h3 className="font-code text-[10px] tracking-[0.28em] text-white/42 uppercase">
              COLECCIONES DESTACADAS
            </h3>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-white/25 hover:text-white hover:border-white/25 transition-all">
                <ChevronLeft size={14} strokeWidth={1.8} />
              </button>
              <button className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-white/25 hover:text-white hover:border-white/25 transition-all">
                <ChevronRight size={14} strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* Product cards (sits automatically in columns 2 to 5, Row 2) */}
          {COLLECTION_PRODUCTS.map((p) => {
            const isActive = selected === p.id
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className="relative flex flex-col text-left overflow-hidden rounded-xl transition-all duration-300 lg:h-[390px] aspect-[3/4] lg:aspect-auto group"
                style={{
                  background: '#131313',
                  border:     '1px solid rgba(255,255,255,0.052)',
                }}
              >
                {p.isNew && (
                  <span
                    className="absolute top-3 left-3 font-code text-[8px] tracking-[0.12em] uppercase px-2 py-1 z-10 font-bold"
                    style={{ background: '#C4822A', color: '#000', borderRadius: '2px' }}
                  >
                    NUEVO
                  </span>
                )}

                <div className="relative flex-1 flex items-center justify-center p-4 min-h-[230px]">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(ellipse at 50% 50%, ${p.frameColor}30 0%, transparent 72%)`,
                    }}
                  />
                  <div
                    className="relative w-full h-[168px] max-w-[260px] transition-all duration-500 group-hover:scale-105"
                    style={{ mixBlendMode: 'multiply' }}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain"
                      sizes="260px"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-5 pb-5 w-full">
                  <div>
                    <p className="font-code text-[9px] tracking-[0.18em] text-white/76 uppercase leading-none">
                      {p.name}
                    </p>
                    <p className="font-display text-[13px] font-semibold text-white/36 group-hover:text-white/70 transition-colors mt-1">
                      {p.price}
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-full border border-white/[0.09] text-white/28 group-hover:border-white/52 group-hover:text-white flex items-center justify-center flex-shrink-0 transition-all">
                    <Plus size={11} strokeWidth={2.2} />
                  </div>
                </div>
              </button>
            )
          })}

        </div>
      </div>
    </section>
  )
}

/* ─── ROOT ────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <HeroSection />
      <TrustBadgesBar />
      <CollectionsSection />
      <Footer />
    </div>
  )
}
