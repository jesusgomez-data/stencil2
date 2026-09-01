'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import {
  ArrowRight, Truck, Shield, Award, Headphones,
  ChevronLeft, ChevronRight, Plus, ChevronUp, ChevronDown,
  Home, Search, Compass, LayoutGrid, Play, AlignJustify, Grid3x3,
  Volume2, VolumeX, Pause, X, Maximize2, Check
} from 'lucide-react'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Viewer3D, { FRAME_COLORS } from '@/components/Viewer3D'
import ProductGallery from '@/components/ProductGallery'
import ShareButton from '@/components/ShareButton'
import FavoriteButton from '@/components/FavoriteButton'
import { PRODUCTS } from '@/lib/products'
import { useCart } from '@/context/CartContext'
import IntroAnimation from '@/components/IntroAnimation'

/* ─── Data ────────────────────────────────────────────────────────── */

const LEFT_NAV = [
  { id: 'inicio',      Icon: Home,        label: 'Inicio'      },
  { id: 'buscar',      Icon: Search,      label: 'Buscar'      },
  { id: 'explorar',    Icon: Compass,     label: 'Explorar'    },
  { id: 'colecciones', Icon: LayoutGrid,  label: 'Colecciones' },
  { id: 'video',       Icon: Play,        label: 'Video'       },
  { id: 'lista',       Icon: AlignJustify,label: 'Lista'       },
  { id: 'grid',        Icon: Grid3x3,     label: 'Grid'        },
]

const TRUST_BADGES = [
  { Icon: Truck,      title: 'ENVÍO GRATIS',  desc: 'En compras mayores a 50 EUR'   },
  { Icon: Shield,     title: 'PAGOS SEGUROS', desc: 'Tus datos siempre protegidos'  },
  { Icon: Award,      title: 'GARANTÍA',      desc: '30 días de garantía'           },
  { Icon: Headphones, title: 'ATENCIÓN 24/7', desc: 'Estamos para ayudarte'         },
]

const COLLECTION_PRODUCTS = [
  {
    id:              'classic-blue',
    name:            'KSO-KC',
    price:           '29.00',
    frameColor:      '#C4822A',
    bgColor:         '#040404',
    isNew:           false,
    whiteBg:         false,
  },
  {
    id:              'onyx-black',
    name:            'IBZEN-SOIRES NAES',
    price:           '29.00',
    frameColor:      '#111111',
    bgColor:         '#030303',
    isNew:           false,
    whiteBg:         false,
  },
  {
    id:              'olive-crystal',
    name:            'MAGMAFLOW',
    price:           '29.00',
    frameColor:      '#3A5A28',
    bgColor:         '#050505',
    isNew:           false,
    whiteBg:         false,
  },
  {
    id:              'smoke-grey',
    name:            'SMOKE GREY',
    price:           '29.00',
    frameColor:      '#555555',
    bgColor:         '#080808',
    isNew:           false,
    whiteBg:         false,
  },
]

/* ─── HERO ────────────────────────────────────────────────────────── */

function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [activeTab, setActiveTab] = useState<string>('inicio')
  const [searchQuery, setSearchQuery] = useState('')
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [active3dColor, setActive3dColor] = useState('#0D2147') // Classic Blue hex as initial color
  const [active3dView, setActive3dView] = useState('Frontal')

  const VIEW_PRESETS_KEYS = ['Frontal', 'Lateral', 'Superior', 'Atrás']

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5
    }
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.play().catch((err) => console.log('Autoplay blocked or interrupted:', err))
      } else {
        videoRef.current.pause()
      }
    }
  }, [isVideoPlaying])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted])

  const handleTabClick = (id: string) => {
    if (id === 'inicio') {
      setActiveTab('inicio')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (id === 'buscar') {
      setActiveTab('buscar')
    } else if (id === 'explorar') {
      setActiveTab('explorar')
    } else if (id === 'colecciones') {
      document.getElementById('collections-section')?.scrollIntoView({ behavior: 'smooth' })
    } else if (id === 'video') {
      if (activeTab !== 'video') {
        setActiveTab('video')
        setIsMuted(false)
        setIsVideoPlaying(true)
      } else {
        setIsVideoPlaying(!isVideoPlaying)
      }
    } else if (id === 'lista') {
      setDrawerOpen(true)
    } else if (id === 'grid') {
      document.getElementById('featured-grid')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleRightSidebarChevron = (direction: 'up' | 'down') => {
    if (activeTab === 'explorar') {
      const currentIndex = VIEW_PRESETS_KEYS.indexOf(active3dView)
      let nextIndex = currentIndex
      if (direction === 'up') {
        nextIndex = currentIndex === 0 ? VIEW_PRESETS_KEYS.length - 1 : currentIndex - 1
      } else {
        nextIndex = currentIndex === VIEW_PRESETS_KEYS.length - 1 ? 0 : currentIndex + 1
      }
      setActive3dView(VIEW_PRESETS_KEYS[nextIndex])
    } else {
      if (direction === 'down') {
        document.getElementById('collections-section')?.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  return (
    <section className="w-full h-[52vh] md:h-[65vh] lg:h-screen bg-black flex overflow-hidden relative">

      {/* ── LEFT SIDEBAR — columna sólida negra ── */}
      <div
        className="hidden lg:flex flex-col items-center flex-shrink-0 bg-black z-30"
        style={{ width: '58px', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div style={{ height: '80px', flexShrink: 0 }} />
        <nav className="flex-1 flex flex-col items-center justify-center gap-6">
          {LEFT_NAV.map(({ id, Icon, label }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                title={label}
                className={`p-1.5 transition-all duration-200 focus:outline-none ${
                  isActive
                    ? 'text-[#C4822A] drop-shadow-[0_0_8px_rgba(196,130,42,0.5)] scale-110'
                    : 'text-white/25 hover:text-white/65'
                }`}
              >
                <Icon size={15} strokeWidth={1.3} />
              </button>
            )
          })}
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

      {/* ── VIDEO/INTERACTIVE CENTER ── */}
      <div className="flex-1 relative overflow-hidden">
        {/* Render base ambient video (needed for home and video mode) */}
        {(activeTab === 'inicio' || activeTab === 'video') && (
          <>
            <video
              ref={videoRef}
              autoPlay
              loop
              playsInline
              muted={isMuted}
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
            {activeTab === 'inicio' && (
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
            )}

            {/* Mobile CTA */}
            {activeTab === 'inicio' && (
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
            )}

            {/* Custom video mode controls overlay */}
            {activeTab === 'video' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/40 z-10 flex flex-col justify-between p-6 md:p-8 animate-fade-in"
              >
                {/* Top Status */}
                <div className="flex items-center justify-between pointer-events-auto">
                  <span className="font-code text-[8px] tracking-[0.35em] text-white/50 uppercase">
                    CAMPAÑA DE VIDEO EN REPRODUCCIÓN
                  </span>
                  <button
                    onClick={() => setActiveTab('inicio')}
                    className="bg-black/50 border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all p-1.5 rounded-sm focus:outline-none"
                    title="Cerrar Controles"
                  >
                    <X size={12} />
                  </button>
                </div>

                {/* Center Play/Pause Big Button */}
                <div className="flex-1 flex items-center justify-center pointer-events-auto">
                  <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="w-14 h-14 rounded-full border border-white/20 bg-black/55 text-white hover:scale-105 hover:bg-black/70 transition-all flex items-center justify-center shadow-lg focus:outline-none"
                  >
                    {isVideoPlaying ? <Pause size={20} className="fill-white" /> : <Play size={20} className="fill-white translate-x-0.5" />}
                  </button>
                </div>

                {/* Bottom Controls */}
                <div className="flex items-center justify-between pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="bg-black/50 border border-white/10 hover:border-white/30 text-white p-2 rounded-sm flex items-center justify-center transition-all focus:outline-none"
                      title={isMuted ? 'Activar Sonido' : 'Silenciar'}
                    >
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                    <span className="font-code text-[9px] tracking-wider text-white/70">
                      {isMuted ? 'SONIDO DESACTIVADO' : 'SONIDO ACTIVADO'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMuted(true)
                      setActiveTab('inicio')
                    }}
                    className="font-code text-[8px] tracking-widest text-white/50 hover:text-white border border-white/15 px-3 py-1.5 hover:border-white/40 rounded-sm transition-all focus:outline-none"
                  >
                    SALIR DE CAMPAÑA
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* ── SEARCH OVERLAY ── */}
        {activeTab === 'buscar' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveTab('inicio')}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors p-2 focus:outline-none"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <div className="w-full max-w-xl text-left">
              <span className="font-code text-[8px] tracking-[0.4em] text-[#C4822A] uppercase block mb-3">
                BÚSQUEDA EN EL CATÁLOGO
              </span>
              <div className="relative border-b border-white/20 pb-2 flex items-center">
                <Search size={18} className="text-white/40 mr-3" />
                <input
                  type="text"
                  placeholder="ESCRIBE PARA BUSCAR..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-white font-code text-base tracking-widest focus:outline-none w-full uppercase"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white p-1 focus:outline-none">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Results */}
              <div className="mt-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {searchQuery ? (
                  (() => {
                    const filtered = PRODUCTS.filter(p =>
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.model.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    if (filtered.length > 0) {
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filtered.map(p => (
                            <Link
                              key={p.id}
                              href={`/producto/${p.slug}`}
                              className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] p-3 rounded-lg hover:border-white/20 hover:bg-white/[0.05] transition-all group"
                            >
                              <div className="relative w-16 h-16 bg-[#121212] rounded-md overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
                                <Image src={p.image} alt={p.name} fill className="object-contain p-1 group-hover:scale-110 transition-transform" />
                              </div>
                              <div>
                                <p className="font-code text-[8px] tracking-widest text-white/40 uppercase leading-none mb-1">{p.code}</p>
                                <h4 className="font-code text-[11px] tracking-wider text-white uppercase font-bold leading-none mb-1">{p.name}</h4>
                                <p className="font-display text-[12px] text-[#C4822A] font-bold">{p.price.toFixed(2)} EUR</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )
                    } else {
                      return (
                        <p className="font-code text-xs text-white/30 uppercase text-center py-8">
                          No se encontraron resultados para &quot;{searchQuery}&quot;
                        </p>
                      )
                    }
                  })()
                ) : (
                  <div>
                    <p className="font-code text-[9px] tracking-[0.2em] text-white/30 uppercase mb-4">
                      BÚSQUEDAS POPULARES
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {['KSO-KC', 'IBZEN-SOIRES NAES', 'MAGMAFLOW', 'SMOKE GREY'].map(term => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="font-code text-[9px] tracking-widest px-4 py-2.5 border border-white/10 rounded-full text-white/40 hover:text-white hover:border-white/30 transition-all bg-white/[0.01] focus:outline-none"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 3D VISOR OVERLAY ── */}
        {activeTab === 'explorar' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 bg-[#080808] flex flex-col justify-between"
          >
            {/* Visor 3D */}
            <div className="absolute inset-0">
              <Viewer3D activeColor={active3dColor} activeView={active3dView} hideControls={true} />
            </div>

            {/* Close button (Moved below Viewer3D toolbar) */}
            <button
              onClick={() => setActiveTab('inicio')}
              className="absolute top-16 right-4 text-white/60 hover:text-white bg-black/60 border border-white/10 hover:border-white/40 transition-all p-2 z-30 rounded-sm focus:outline-none"
              title="Cerrar Explorador 3D"
            >
              <X size={16} strokeWidth={2} />
            </button>

            {/* Frame color customizer in 3D mode */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 md:bottom-6 md:left-6 md:translate-x-0 z-30 flex items-center gap-3.5 bg-black/60 backdrop-blur-md px-5 py-3.5 border border-white/10 rounded-lg">
              <span className="font-code text-[8px] tracking-widest text-white/40 uppercase">COLOR:</span>
              <div className="flex gap-2">
                {FRAME_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    title={c.label}
                    onClick={() => setActive3dColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-5 h-5 rounded-full border transition-all duration-200 focus:outline-none ${
                      active3dColor === c.hex
                        ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                        : 'border-white/15 hover:border-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── RIGHT SIDEBAR — columna sólida negra ── */}
      <div
        className="hidden lg:flex flex-col items-center flex-shrink-0 bg-black z-30"
        style={{ width: '58px', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div style={{ height: '80px', flexShrink: 0 }} />

        {/* Plus / Dynamic Info */}
        <button
          onClick={() => {
            if (activeTab === 'explorar') {
              setActive3dView('Frontal')
              setActive3dColor('#0D2147')
            } else {
              setIsMuted(!isMuted)
            }
          }}
          className="mt-3 mb-1 text-white/30 hover:text-white transition-colors p-1.5 focus:outline-none"
          title={activeTab === 'explorar' ? 'Resetear Modelo 3D' : (isMuted ? 'Activar Sonido' : 'Silenciar')}
        >
          <Plus size={15} strokeWidth={1.3} />
        </button>

        {/* Scroll track */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <button
            onClick={() => handleRightSidebarChevron('up')}
            className="text-white/25 hover:text-white/60 transition-colors p-1 focus:outline-none"
            title={activeTab === 'explorar' ? 'Cámara Anterior' : 'Subir'}
          >
            <ChevronUp size={13} strokeWidth={1.5} />
          </button>
          
          <div className="flex flex-col items-center gap-[3px] py-1">
            <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.10)' }} />
            <div
              style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#C4822A',
                boxShadow: '0 0 6px rgba(196,130,42,0.7)',
              }}
              title={activeTab === 'explorar' ? `Vista 3D: ${active3dView}` : 'Sección Activa'}
            />
            <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.10)' }} />
          </div>

          <button
            onClick={() => handleRightSidebarChevron('down')}
            className="text-white/25 hover:text-white/60 transition-colors p-1 focus:outline-none"
            title={activeTab === 'explorar' ? 'Siguiente Cámara' : 'Bajar'}
          >
            <ChevronDown size={13} strokeWidth={1.5} />
          </button>
        </div>

        {/* Bottom arrows */}
        <div className="pb-5 flex flex-col items-center gap-0.5">
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.07)', marginBottom: '8px' }} />
          <button
            onClick={() => handleRightSidebarChevron('up')}
            className="text-white/20 hover:text-white/45 transition-colors p-0.5 focus:outline-none"
          >
            <ChevronUp size={11} strokeWidth={1.3} />
          </button>
          <button
            onClick={() => handleRightSidebarChevron('down')}
            className="text-white/20 hover:text-white/45 transition-colors p-0.5 focus:outline-none"
          >
            <ChevronDown size={11} strokeWidth={1.3} />
          </button>
        </div>
      </div>

      {/* ── LEFT DRAWER MENU ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black z-45 backdrop-blur-sm cursor-pointer"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[320px] bg-black z-50 border-r border-white/[0.08] shadow-2xl flex flex-col justify-between p-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center">
                  <Image
                    src="/images/logo-grenade-white.png"
                    alt="STENCIL2"
                    width={24}
                    height={38}
                    className="h-10 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-full border border-white/10 hover:border-white/20 text-white/50 hover:text-white flex items-center justify-center transition-colors focus:outline-none"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 flex flex-col justify-center gap-7 my-12 text-left">
                <span className="font-code text-[8px] tracking-[0.35em] text-[#C4822A] uppercase">CATEGORÍAS</span>
                <nav className="flex flex-col gap-5">
                  <Link
                    href="/tienda"
                    onClick={() => setDrawerOpen(false)}
                    className="font-bebas text-3xl tracking-wide text-white hover:text-[#C4822A] hover:pl-2 transition-all duration-300"
                  >
                    CATÁLOGO COMPLETO
                  </Link>
                  <Link
                    href="/tienda?gender=men"
                    onClick={() => setDrawerOpen(false)}
                    className="font-bebas text-3xl tracking-wide text-white hover:text-[#C4822A] hover:pl-2 transition-all duration-300"
                  >
                    COLECCIÓN HOMBRE
                  </Link>
                  <Link
                    href="/tienda?gender=women"
                    onClick={() => setDrawerOpen(false)}
                    className="font-bebas text-3xl tracking-wide text-white hover:text-[#C4822A] hover:pl-2 transition-all duration-300"
                  >
                    COLECCIÓN MUJER
                  </Link>
                </nav>

                <div className="h-px bg-white/[0.08] my-2" />

                <span className="font-code text-[8px] tracking-[0.35em] text-white/30 uppercase">INFORMACIÓN</span>
                <nav className="flex flex-col gap-3 font-code text-[10px] tracking-widest text-white/50">
                  <Link href="/nosotros" onClick={() => setDrawerOpen(false)} className="hover:text-white transition-colors">
                    SOBRE NOSOTROS
                  </Link>
                  <Link href="/contacto" onClick={() => setDrawerOpen(false)} className="hover:text-white transition-colors">
                    SOPORTE Y CONTACTO
                  </Link>
                  <Link href="/faq" onClick={() => setDrawerOpen(false)} className="hover:text-white transition-colors">
                    PREGUNTAS FRECUENTES (FAQ)
                  </Link>
                </nav>
              </div>

              {/* Footer / Account */}
              <div className="border-t border-white/[0.08] pt-6 flex flex-col gap-5 text-left">
                <div className="flex justify-between items-center">
                  <Link
                    href="/cuenta"
                    onClick={() => setDrawerOpen(false)}
                    className="font-code text-[10px] tracking-wider text-white hover:text-[#C4822A] transition-colors"
                  >
                    MI CUENTA
                  </Link>
                  <Link
                    href="/carrito"
                    onClick={() => setDrawerOpen(false)}
                    className="font-code text-[10px] tracking-wider text-white hover:text-[#C4822A] transition-colors"
                  >
                    CARRITO
                  </Link>
                </div>
                <div className="flex gap-4">
                  {[
                    { name: 'instagram', url: 'https://www.instagram.com/stencil2' },
                    { name: 'tiktok', url: 'https://www.tiktok.com/@stencil.2' },
                    { name: 'facebook', url: 'https://www.facebook.com/stencil2' }
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-code text-[9px] tracking-widest text-white/30 hover:text-white transition-colors uppercase"
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
                <p className="font-code text-[8px] text-white/20 tracking-wider">
                  © 2026 STENCIL2 · JOINING CULTURE
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
  const [galleryProduct, setGalleryProduct] = useState<{
    id: string; name: string; letter: string; code: string; image: string; images: string[]
  } | null>(null)
  const [addedId, setAddedId] = useState<string | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    if (galleryProduct) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [galleryProduct])

  const handleQuickAddCollection = (e: React.MouseEvent, p: typeof COLLECTION_PRODUCTS[0]) => {
    e.preventDefault()
    e.stopPropagation()
    const product = PRODUCTS.find((pr) => pr.id === p.id)
    const numericPrice = parseFloat(p.price.replace(/[^0-9.]/g, '')) || 29.00
    addToCart({
      id: p.id,
      code: product?.code ?? '',
      name: product?.name ?? p.name,
      slug: p.id,
      price: numericPrice,
      image: product?.image ?? '',
      model: product?.model ?? 'wayfarer',
      color: product?.frameColor ?? '#1a1a1a',
      colorLabel: product?.colors[0]?.label ?? 'Estándar',
    }, 1)
    setAddedId(p.id)
    setTimeout(() => setAddedId(null), 1800)
  }

  return (
    <section id="collections-section" className="bg-black pt-10 pb-14">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        <div id="featured-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          {/* Editorial banner (Column 1, spans both rows on large screens) */}
          <div className="relative overflow-hidden rounded-2xl sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:h-auto h-[390px] aspect-[3/4] sm:aspect-auto lg:aspect-auto border border-white/[0.055] group flex flex-col justify-end p-6 md:p-8 z-10">
            <div className="absolute inset-0 overflow-hidden z-0">
              <Image
                src="/images/JOINING.jpg?v=2"
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

            {/* Top Text Group — pegado al CTA inferior */}
            <div className="relative z-10 text-left mb-6">
              <p className="font-code text-[8px] tracking-[0.35em] text-white/40 uppercase mb-3">
                NUEVA COLECCIÓN
              </p>
              <h2 className="font-bebas text-[38px] leading-[0.88] text-white tracking-wide">
                JOINING<br />CULTURE
              </h2>
            </div>

            {/* Bottom Text Group */}
            <div className="relative z-10 text-left">
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
            const product = PRODUCTS.find((pr) => pr.id === p.id)
            const mainImage = product?.image ?? ''
            const galleryImages = product?.gallery ?? (mainImage ? [mainImage] : [])
            const letter = product?.letter ?? ''
            const code = product?.code ?? ''
            const isThisAdded = addedId === p.id

            return (
              <Link
                key={p.id}
                href={`/producto/${product?.slug || p.id}`}
                style={{ background: p.bgColor }}
                className="relative flex flex-col text-left overflow-hidden rounded-2xl transition-all duration-300 lg:h-[390px] aspect-[3/4] lg:aspect-auto group border border-white/[0.06] hover:border-white/20 hover:shadow-2xl"
              >
                {p.isNew && (
                  <span
                    className="absolute top-3 left-3 font-code text-[8px] tracking-[0.12em] uppercase px-2 py-1 z-10 font-bold"
                    style={{ background: '#CC0000', color: '#fff', borderRadius: '2px' }}
                  >
                    NUEVO
                  </span>
                )}

                {/* Real fotorrealistic sunglasses image — click opens the model gallery */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setGalleryProduct({
                      id: p.id,
                      name: product?.name ?? p.name,
                      letter,
                      code,
                      image: mainImage,
                      images: galleryImages,
                    })
                  }}
                  className="relative flex-1 min-h-[230px] overflow-hidden cursor-zoom-in"
                  style={{ background: p.bgColor }}
                >
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    {mainImage && (
                      <Image
                        src={mainImage}
                        alt={product?.name ?? p.name}
                        fill
                        className="object-contain p-4 md:p-6"
                        sizes="400px"
                      />
                    )}
                  </div>

                  {/* Expand hint icon */}
                  <div className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/40 border border-white/20 text-white/70 flex items-center justify-center">
                    <Maximize2 size={11} strokeWidth={2} />
                  </div>

                  {/* Like button — arriba a la izquierda */}
                  <div className="absolute top-3 left-3 z-30">
                    <FavoriteButton slug={product?.slug || p.id} />
                  </div>

                  {/* Name tag replacing Model letter tag */}
                  {letter && (
                    <div className="absolute top-12 left-3 z-20">
                      <span className="font-code text-[8px] tracking-[0.25em] text-white/40 uppercase">
                        {p.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details Footer */}
                <div
                  style={{ background: p.bgColor }}
                  className="flex items-center justify-between px-5 pb-5 w-full pt-3 border-t border-white/[0.04] z-10"
                >
                  <div>
                    <p className="font-code text-[9px] tracking-[0.18em] text-white/50 group-hover:text-white/80 transition-colors uppercase leading-none">
                      MODELO {letter}
                    </p>
                    <p className="font-display text-[13px] font-bold text-white mt-1">
                      {p.price} <span className="font-code text-[8px] font-normal tracking-widest text-white/40">EUR</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* 3D View Link Button */}
                    <div
                      title="Ver en 360°"
                      className="w-7 h-7 rounded-full border border-white/[0.12] text-white/40 hover:border-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
                    </div>

                    <ShareButton
                      title={`${product?.name ?? p.name} — STENCIL2`}
                      url={`${typeof window !== 'undefined' ? window.location.origin : ''}/producto/${product?.slug || p.id}`}
                    />
                    <button
                      onClick={(e) => handleQuickAddCollection(e, p)}
                      title="Añadir al carrito"
                      className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                        isThisAdded
                          ? 'bg-[#1C3B1C] border-[#2c5c2c] text-white scale-110'
                          : 'border-white/[0.12] text-white/40 hover:border-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {isThisAdded ? <Check size={11} strokeWidth={2.5} /> : <Plus size={11} strokeWidth={2.2} />}
                    </button>
                  </div>
                </div>
              </Link>
            )
          })}

        </div>
      </div>

      {/* Lightbox premium — galería completa del modelo seleccionado */}
      {galleryProduct && (
        <ProductGallery
          images={galleryProduct.images}
          productName={galleryProduct.name}
          productCode={galleryProduct.code}
          letter={galleryProduct.letter}
          initialIndex={0}
          open={galleryProduct !== null}
          onClose={() => setGalleryProduct(null)}
        />
      )}
    </section>
  )
}

/* ─── ROOT ────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="bg-black min-h-screen">
      <IntroAnimation />
      <Navbar />
      <HeroSection />
      <TrustBadgesBar />
      <CollectionsSection />
      <Footer />
    </div>
  )
}
