'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { PRODUCTS } from '@/lib/products'
import { GlassesModel } from '@/types'
import { Search, X, SlidersHorizontal, Camera, Maximize2, Play } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import ProductGallery from '@/components/ProductGallery'

function TiendaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const genderParam = searchParams.get('gender') // 'men', 'women'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women'>(
    genderParam === 'men' ? 'men' : genderParam === 'women' ? 'women' : 'all'
  )
  const [selectedProductId, setSelectedProductId] = useState<string | 'all'>('all')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [galleryState, setGalleryState] = useState<{
    images: string[]
    name: string
    code: string
    letter: string
    initialIndex: number
  } | null>(null)

  const handleProductClick = (productId: string | 'all') => {
    if (selectedProductId === productId && productId !== 'all') {
      setSelectedProductId('all')
    } else {
      setSelectedProductId(productId)
    }
  }

  // Active product for the photoshoot session
  const activeProduct = selectedProductId !== 'all' ? PRODUCTS.find((p) => p.id === selectedProductId) : null

  const [shotIndex, setShotIndex] = useState(0)
  useEffect(() => {
    setShotIndex(0)
  }, [selectedProductId])

  // Sync state if URL query param changes
  useEffect(() => {
    if (genderParam === 'men') {
      setSelectedGender('men')
    } else if (genderParam === 'women') {
      setSelectedGender('women')
    } else {
      setSelectedGender('all')
    }
  }, [genderParam])

  const handleGenderChange = (gender: 'all' | 'men' | 'women') => {
    setSelectedGender(gender)
    // Update URL query parameters
    const params = new URLSearchParams(window.location.search)
    if (gender === 'all') {
      params.delete('gender')
    } else {
      params.set('gender', gender)
    }
    router.push(`/tienda?${params.toString()}`, { scroll: false })
  }

  // Filter products by search and selected product
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesProduct = selectedProductId === 'all' || p.id === selectedProductId

    return matchesSearch && matchesProduct
  })

  // Lista de botones en el orden exacto de los productos
  const productButtons = [
    { id: 'all', label: 'TODAS' },
    ...PRODUCTS.map((p) => ({
      id: p.id,
      label: p.name.toUpperCase(),
      code: p.code,
    })),
  ]

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-6 lg:px-10 max-w-[1400px] mx-auto w-full">
        {/* Portada de la colección — Hero Video STENCIL2 */}
        <section className="relative mb-12 rounded-2xl overflow-hidden border border-white/[0.055] bg-[#050505]">
          <div className="flex flex-col-reverse md:flex-row">
            {/* Texto editorial (izquierda en desktop) */}
            <div className="relative flex-1 flex flex-col justify-center px-6 md:px-10 py-10 md:py-16 text-left">
              <div
                className="absolute inset-0 z-0"
                style={{
                  background:
                    'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 100%)',
                }}
              />
              <div className="relative z-10">
                <p className="font-code text-[9px] tracking-[0.35em] text-white/40 uppercase mb-4">
                  COLECCIÓN OFICIAL · UNISEX
                </p>
                <h1 className="font-bebas text-[48px] md:text-[68px] tracking-wide leading-[0.9] text-white uppercase">
                  LAS GAFAS
                  <br />
                  <span className="text-white/85">DE LA CULTURA</span>
                </h1>
                <p className="font-code text-[11px] text-white/50 max-w-md mt-5 leading-relaxed">
                  Diseñadas bajo los estándares de la cultura urbana y el streetwear premium. Lentes polarizadas de protección total UV400, monturas de acetato pulido a mano y polímeros flexibles.
                </p>
                <div className="hidden md:flex items-center gap-5 mt-8">
                  <span className="font-code text-[8px] tracking-[0.3em] text-white/30 uppercase">EST. 2007</span>
                  <span className="w-8 h-[1px] bg-white/20" />
                  <span className="font-code text-[8px] tracking-[0.3em] text-white/30 uppercase">STENCIL2</span>
                </div>
              </div>
            </div>

            {/* Video cinematográfico 3D (derecha en desktop) */}
            <div className="relative w-full md:w-[48%] lg:w-[46%] aspect-video md:aspect-auto md:min-h-[420px] shrink-0 overflow-hidden flex items-center justify-center bg-[#050505]">
              <video
                src="/images/stencil2_hero_ae.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover object-center"
              />

              {/* Sombra perimetral interna profunda para eliminar esquinas y bordes cuadrados */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 60px 25px #050505',
                }}
              />

              {/* Degradado lateral izquierdo (Desktop): funde perfectamente el texto con el video sin cortes */}
              <div
                className="absolute inset-0 pointer-events-none hidden md:block"
                style={{
                  background:
                    'linear-gradient(to right, #050505 0%, rgba(5,5,5,0.95) 10%, rgba(5,5,5,0.5) 28%, rgba(5,5,5,0.1) 48%, transparent 65%)',
                }}
              />

              {/* Degradado superior e inferior para suavizar cortes horizontales */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(5,5,5,0.65) 0%, transparent 20%, transparent 80%, rgba(5,5,5,0.75) 100%)',
                }}
              />

              {/* Viñeta radial para concentrar la luz al centro y desvanecer las esquinas exteriores */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 90% 80% at 55% 50%, transparent 40%, rgba(5,5,5,0.5) 75%, rgba(5,5,5,0.92) 100%)',
                }}
              />

              {/* Degradado inferior para Mobile: transición suave hacia el bloque de texto */}
              <div
                className="absolute inset-0 pointer-events-none md:hidden"
                style={{
                  background:
                    'linear-gradient(to bottom, transparent 40%, rgba(5,5,5,0.85) 80%, #050505 100%)',
                }}
              />
            </div>
          </div>
        </section>

        {/* Filters and Search Bar Row */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-8 w-full">
          {/* Desktop Filter Tabs — Botones con los nombres reales de las gafas en orden */}
          <div className="hidden lg:flex items-center gap-2 flex-wrap">
            {productButtons.map((btn) => {
              const isSelected = selectedProductId === btn.id
              return (
                <button
                  key={btn.id}
                  onClick={() => handleProductClick(btn.id)}
                  className={`font-code text-[8.5px] tracking-[0.16em] px-4 py-2 border rounded-full transition-all uppercase flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-white text-white bg-white/10 font-bold shadow-[0_0_15px_rgba(255,255,255,0.08)]'
                      : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'
                  }`}
                >
                  {btn.id !== 'all' && (
                    <Camera size={10} className={isSelected ? 'text-[#C4822A]' : 'opacity-40'} />
                  )}
                  {btn.label}
                </button>
              )
            })}
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex lg:hidden w-full gap-2 items-center">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center justify-center gap-2 border border-white/15 px-4 py-2.5 text-white/60 font-code text-[10px] tracking-wider uppercase bg-white/[0.02] flex-1"
            >
              <SlidersHorizontal size={12} />
              {activeProduct ? `GAFA: ${activeProduct.name.toUpperCase()}` : 'FILTRAR GAFAS'}
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:w-[280px]">
            <input
              type="text"
              placeholder="BUSCAR MODELO O CÓDIGO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/15 text-white font-code text-[10px] tracking-widest pl-9 pr-8 py-3 focus:outline-none focus:border-white/30 transition-all uppercase rounded-sm"
            />
            <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filters Expanded Box */}
        {showMobileFilters && (
          <div className="lg:hidden border border-white/10 p-4 mb-6 bg-white/[0.01] rounded-sm">
            <p className="font-code text-[8px] tracking-[0.2em] text-white/30 uppercase mb-2">MODELOS DISPONIBLES</p>
            <div className="flex flex-wrap gap-1.5">
              {productButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => {
                    handleProductClick(btn.id)
                    setShowMobileFilters(false)
                  }}
                  className={`font-code text-[8px] tracking-[0.1em] px-3 py-1.5 border rounded-full transition-all uppercase flex items-center gap-1 ${
                    selectedProductId === btn.id
                      ? 'border-white text-white bg-white/10 font-semibold'
                      : 'border-white/10 text-white/40'
                  }`}
                >
                  {btn.id !== 'all' && <Camera size={9} className="opacity-60" />}
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Carrete Desplegable de Sesión Fotográfica de la Gafa Seleccionada */}
        <AnimatePresence>
          {activeProduct && (
            <motion.div
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -6, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden mb-10"
            >
              <div className="rounded-2xl border border-white/[0.08] bg-[#080808] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
                {/* Cabecera editorial */}
                <div className="flex items-end justify-between gap-4 px-5 md:px-7 pt-5 md:pt-6 pb-4">
                  <div>
                    <p className="font-code text-[9px] tracking-[0.3em] text-white/40 uppercase mb-1.5">
                      Sesión oficial <span className="text-white/20 mx-1">/</span> {activeProduct.code}
                    </p>
                    <h3 className="font-bebas text-3xl md:text-4xl text-white tracking-wide uppercase leading-none">
                      {activeProduct.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedProductId('all')}
                    className="font-code text-[9px] tracking-[0.2em] text-white/50 hover:text-white flex items-center gap-2 transition-colors uppercase"
                    title="Cerrar sesión"
                  >
                    Cerrar
                    <span className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center">
                      <X size={11} />
                    </span>
                  </button>
                </div>

                {(() => {
                  const gallery = activeProduct.gallery
                  const idx = Math.min(shotIndex, gallery.length - 1)
                  const current = gallery[idx]
                  const currentIsVideo = current.endsWith('.mp4')
                  const openLightbox = (i: number) =>
                    setGalleryState({
                      images: gallery,
                      name: activeProduct.name,
                      code: activeProduct.code,
                      letter: activeProduct.letter,
                      initialIndex: i,
                    })
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-px bg-white/[0.06] border-t border-white/[0.06]">
                      {/* Visor principal */}
                      <button
                        type="button"
                        onClick={() => openLightbox(idx)}
                        className="relative bg-[#050505] aspect-[16/10] md:aspect-auto md:min-h-[360px] overflow-hidden group cursor-zoom-in"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.div
                            key={current}
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                          >
                            {currentIsVideo ? (
                              <video src={current} muted playsInline autoPlay loop className="w-full h-full object-cover" />
                            ) : (
                              <Image
                                src={current}
                                alt={`${activeProduct.name} — toma ${idx + 1}`}
                                fill
                                className="object-contain p-6 md:p-10 group-hover:scale-[1.03] transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, 800px"
                              />
                            )}
                          </motion.div>
                        </AnimatePresence>
                        <span className="absolute left-4 bottom-4 font-code text-[9px] tracking-[0.25em] text-white/60 uppercase">
                          {String(idx + 1).padStart(2, '0')} <span className="text-white/25">/ {String(gallery.length).padStart(2, '0')}</span>
                        </span>
                        <span className="absolute right-4 bottom-4 w-8 h-8 rounded-full border border-white/15 bg-black/50 backdrop-blur flex items-center justify-center text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 size={12} />
                        </span>
                      </button>

                      {/* Miniaturas */}
                      <div className="bg-[#080808] p-3 md:p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[420px] scrollbar-thin">
                        {gallery.map((imgUrl, i) => {
                          const isVideo = imgUrl.endsWith('.mp4')
                          const active = i === idx
                          return (
                            <button
                              key={imgUrl}
                              type="button"
                              onClick={() => setShotIndex(i)}
                              aria-label={`Ver toma ${i + 1}`}
                              className={`relative flex-shrink-0 w-20 h-14 md:w-24 md:h-16 overflow-hidden rounded-md bg-[#0c0c0c] border transition-all duration-300 ${
                                active ? 'border-white/70' : 'border-white/[0.08] opacity-50 hover:opacity-100'
                              }`}
                            >
                              {isVideo ? (
                                <div className="w-full h-full flex items-center justify-center text-white/80">
                                  <Play size={12} fill="currentColor" />
                                </div>
                              ) : (
                                <Image src={imgUrl} alt="" fill className="object-cover" sizes="100px" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Catalog Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div key={p.id} className="h-96 border border-white/[0.052] rounded-2xl overflow-hidden hover:border-white/30 hover:scale-[1.08] hover:z-20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-300 ease-out transform">
                <ProductCard
                  code={p.code}
                  letter={p.letter}
                  name={p.name}
                  subtitle={p.subtitle}
                  price={p.price.toFixed(2)}
                  compareAtPrice={p.compareAtPrice}
                  gender={p.gender.toUpperCase() as 'MEN' | 'WOMEN' | 'UNISEX'}
                  model={p.model}
                  slug={p.slug}
                  image={p.image}
                  gallery={p.gallery}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-xl">
            <p className="font-code text-[11px] tracking-widest text-white/30 uppercase">
              NO SE ENCONTRARON PRODUCTOS QUE COINCIDAN CON TU BÚSQUEDA
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedGender('all')
                setSelectedProductId('all')
                router.push('/tienda', { scroll: false })
              }}
              className="mt-4 font-code text-[9px] tracking-widest border border-white/20 px-6 py-2.5 text-white/50 hover:text-white hover:border-white/50 transition-colors uppercase"
            >
              LIMPIAR FILTROS
            </button>
          </div>
        )}

        {/* Lightbox a pantalla completa al pulsar en cualquier foto de la sesión */}
        {galleryState && (
          <ProductGallery
            images={galleryState.images}
            productName={galleryState.name}
            productCode={galleryState.code}
            letter={galleryState.letter}
            initialIndex={galleryState.initialIndex}
            open={galleryState !== null}
            onClose={() => setGalleryState(null)}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function TiendaPage() {
  return (
    <Suspense fallback={
      <div className="bg-black min-h-screen text-white flex items-center justify-center font-code text-[10px] tracking-[0.25em] uppercase">
        CARGANDO CATÁLOGO...
      </div>
    }>
      <TiendaContent />
    </Suspense>
  )
}