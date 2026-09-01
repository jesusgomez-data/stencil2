'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Viewer3D from '@/components/Viewer3D'
import ProductGallery from '@/components/ProductGallery'
import { PRODUCTS } from '@/lib/products'
import { getShotLabel } from '@/lib/imageCatalog'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { Truck, RotateCcw, ShieldCheck, ChevronDown, ChevronUp, Check, ArrowRight, Maximize2, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { addToCart } = useCart()

  const product = PRODUCTS.find((p) => p.slug === params.slug)

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedColorLabel, setSelectedColorLabel] = useState('')
  const [activeView, setActiveView] = useState('Frontal')
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  
  // Accordion states
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  useEffect(() => {
    if (product) {
      setSelectedColor(product.frameColor)
      setSelectedColorLabel(product.colors[0]?.label || '')
    }
  }, [product])

  if (!product) {
    return (
      <div className="bg-black min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
          <p className="font-code text-[10px] tracking-[0.3em] text-white/30 uppercase mb-4">404 — ERROR</p>
          <h1 className="font-bebas text-5xl text-white tracking-wide uppercase mb-6">PRODUCTO NO ENCONTRADO</h1>
          <p className="font-code text-xs text-white/50 max-w-sm mb-8">El modelo de gafas que buscas no existe en nuestro catálogo actual o ha sido descontinuado.</p>
          <Link href="/tienda" className="font-code text-[10px] tracking-widest text-black bg-white px-8 py-3.5 hover:bg-white/80 transition-colors uppercase font-bold">
            VOLVER A LA TIENDA
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleColorChange = (hex: string, label: string) => {
    setSelectedColor(hex)
    setSelectedColorLabel(label)
  }

  const handleQuantityChange = (action: 'inc' | 'dec') => {
    if (action === 'inc') {
      setQuantity((q) => Math.min(10, q + 1))
    } else {
      setQuantity((q) => Math.max(1, q - 1))
    }
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      code: product.code,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      model: product.model,
      color: selectedColor,
      colorLabel: selectedColorLabel,
    }, quantity)

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name)
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_520px] lg:h-[calc(100vh-80px)] min-h-[600px]">
          
          {/* LEFT COLUMN: 3D Configurator */}
          <div className="relative bg-[#080808] border-b lg:border-b-0 lg:border-r border-white/[0.06] flex flex-col h-[60vh] lg:h-full overflow-hidden">
            
            {/* Custom Camera Presets controls overlaid on the 3D space */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-4 flex flex-row md:flex-col gap-1.5 z-20 pointer-events-auto w-max max-w-[90vw] overflow-x-auto no-scrollbar">
              {['Frontal', 'Lateral', 'Superior', 'Atrás'].map((v) => (
                <button
                  key={v}
                  onClick={() => setActiveView(v)}
                  className={`font-code text-[8px] md:text-[9px] tracking-widest px-3 md:px-3.5 py-1.5 md:py-2 border transition-all uppercase rounded-sm select-none whitespace-nowrap ${
                    activeView === v
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-black/60 text-white/40 border-white/10 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* The 3D Canvas */}
            <div className="flex-1 w-full h-full relative">
              <Viewer3D 
                activeColor={selectedColor} 
                activeView={activeView} 
                images={product.gallery} 
                letter={product.letter}
                hideControls={true} 
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Configuration Panels */}
          <div className="p-8 lg:p-12 overflow-y-auto flex flex-col justify-center h-full bg-black">
            {/* Breadcrumb / Code */}
            <div className="flex items-center gap-3 mb-4">
              <Link href="/tienda" className="font-code text-[9px] tracking-widest text-white/40 hover:text-white uppercase transition-colors">
                TIENDA
              </Link>
              <span className="text-white/20 font-code text-[9px] select-none">/</span>
              <span className="font-code text-[9px] tracking-widest text-[#C4822A] uppercase">{product.code}</span>
            </div>

            {/* Title & Price */}
            <div className="border-b border-white/[0.08] pb-6 mb-6">
              <h1 className="font-bebas text-5xl tracking-wide text-white mb-2 leading-none uppercase">{product.name}</h1>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-2xl font-bold text-white">{product.price.toFixed(2)}</span>
                <span className="font-code text-[10px] tracking-widest text-white/40">EUR</span>
                <span className="font-code text-[8px] tracking-wider text-white/20 ml-2 uppercase">IVA Incluido</span>
              </div>
            </div>

            {/* Description */}
            <p className="font-code text-[11px] leading-relaxed text-white/50 mb-6 text-left">
              {product.description}
            </p>

            {/* Color Selector Removed per user request */}
            {/* Quantity Selector and CTA Button */}
            <div className="flex gap-4 items-stretch mb-8">
              {/* Quantity Selector */}
              <div className="flex items-center border border-white/15 bg-white/[0.02] rounded-sm">
                <button
                  onClick={() => handleQuantityChange('dec')}
                  className="px-3 text-white/40 hover:text-white transition-colors h-full flex items-center justify-center"
                >
                  <ChevronDown size={14} />
                </button>
                <span className="font-code text-xs text-white px-3 min-w-[32px] text-center select-none">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('inc')}
                  className="px-3 text-white/40 hover:text-white transition-colors h-full flex items-center justify-center"
                >
                  <ChevronUp size={14} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`flex-1 font-code text-[10px] tracking-[0.25em] py-4 uppercase font-bold rounded-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  isAdded
                    ? 'bg-[#1C3B1C] text-white border border-[#2c5c2c]'
                    : 'bg-white text-black hover:bg-white/80'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={12} strokeWidth={2.5} />
                    ¡AÑADIDO AL CARRITO!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={12} strokeWidth={1.8} />
                    AÑADIR AL CARRITO
                  </>
                )}
              </button>
            </div>

            {/* Direct action links when added */}
            <AnimatePresence>
              {isAdded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="flex gap-2.5">
                    <Link
                      href="/carrito"
                      className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-code text-[9px] tracking-widest py-3 text-center uppercase font-bold rounded-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      VER CARRITO →
                    </Link>
                    <Link
                      href="/checkout"
                      className="flex-1 bg-[#CC0000] hover:bg-[#B00000] text-white font-code text-[9px] tracking-widest py-3 text-center uppercase font-bold rounded-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      PAGAR AHORA
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Specifications & Composition */}
            <div className="border-t border-white/[0.08] pt-6 mb-6 text-left">
              <span className="font-code text-[8px] tracking-[0.2em] text-white/30 uppercase block mb-3">DETALLES DEL PRODUCTO</span>
              <div className="grid grid-cols-[140px_1fr] gap-y-2 font-code text-[9px] text-white/60 uppercase">
                {product.glassesColor && <><span className="text-white/30">COLOR GAFA</span><span>{product.glassesColor}</span></>}
                {product.frameType && <><span className="text-white/30">MONTURA</span><span>{product.frameType}</span></>}
                {product.logo && <><span className="text-white/30">LOGO S2</span><span>{product.logo}</span></>}
                <span className="text-white/30">GÉNERO</span><span>{product.gender === 'unisex' ? 'Unisex' : product.gender === 'men' ? 'Hombre' : 'Mujer'}</span>
                <span className="text-white/30">NOMBRE DEL PRODUCTO</span><span>{product.name}</span>
                {product.material && <><span className="text-white/30">MATERIAL</span><span>{product.material}</span></>}
                {product.lens && <><span className="text-white/30">LENTES</span><span>{product.lens}</span></>}
              </div>

              {product.sizes && (
                <div className="grid grid-cols-[140px_1fr] gap-y-2 font-code text-[9px] text-white/60 uppercase mt-4 pt-4 border-t border-white/[0.04]">
                  <span className="text-white/30">VARILLAS</span><span>{product.sizes.varillas}</span>
                  <span className="text-white/30">PUENTE</span><span>{product.sizes.puente}</span>
                  <span className="text-white/30">FRONTAL</span><span>{product.sizes.frontal}</span>
                  <span className="text-white/30">ALTURA MONTURA</span><span>{product.sizes.altura}</span>
                </div>
              )}
            </div>

            {/* Accordion Tabs */}
            <div className="border-y border-white/[0.08]">
              {/* Shipping Accordion */}
              <div className="border-b border-white/[0.06] last:border-b-0">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between py-4 text-left font-code text-[9px] tracking-[0.2em] text-white/60 hover:text-white transition-colors uppercase"
                >
                  <span className="flex items-center gap-2.5">
                    <Truck size={12} className="text-white/40" />
                    ENVÍOS Y ENTREGAS
                  </span>
                  <ChevronDown size={11} className={`transform transition-transform ${openAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pb-4 font-code text-[9px] tracking-wide text-white/40 leading-relaxed uppercase space-y-1.5">
                    <p>· ENVÍO ESTÁNDAR NACIONAL: 3-5 DÍAS LABORABLES (4.95 EUR, GRATIS EN COMPRAS MAYORES A 50 EUR).</p>
                    <p>· ENVÍO EXPRESS NACIONAL: 24-48 HORAS (7.95 EUR).</p>
                    <p>· SE PROPORCIONARÁ NÚMERO DE SEGUIMIENTO EN EL MOMENTO DEL DESPACHO.</p>
                  </div>
                )}
              </div>

              {/* Returns Accordion */}
              <div className="border-b border-white/[0.06] last:border-b-0">
                <button
                  onClick={() => toggleAccordion('returns')}
                  className="w-full flex items-center justify-between py-4 text-left font-code text-[9px] tracking-[0.2em] text-white/60 hover:text-white transition-colors uppercase"
                >
                  <span className="flex items-center gap-2.5">
                    <RotateCcw size={12} className="text-white/40" />
                    DEVOLUCIONES
                  </span>
                  <ChevronDown size={11} className={`transform transition-transform ${openAccordion === 'returns' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'returns' && (
                  <div className="pb-4 font-code text-[9px] tracking-wide text-white/40 leading-relaxed uppercase space-y-1.5">
                    <p>· DISPONES DE 14 DÍAS NATURALES DESDE LA RECEPCIÓN PARA CUALQUIER DEVOLUCIÓN.</p>
                    <p>· EL PRODUCTO DEBE PERMANECER EN SU ESTADO Y EMBALAJE ORIGINAL SIN SEÑALES DE USO.</p>
                    <p>· DEVOLUCIONES TOTALMENTE GRATUITAS DESDE ESPAÑA (EXCEPTO ARTÍCULOS PERSONALIZADOS).</p>
                  </div>
                )}
              </div>

              {/* Guarantee Accordion */}
              <div className="border-b border-white/[0.06] last:border-b-0">
                <button
                  onClick={() => toggleAccordion('guarantee')}
                  className="w-full flex items-center justify-between py-4 text-left font-code text-[9px] tracking-[0.2em] text-white/60 hover:text-white transition-colors uppercase"
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldCheck size={12} className="text-white/40" />
                    GARANTÍA STENCIL2
                  </span>
                  <ChevronDown size={11} className={`transform transition-transform ${openAccordion === 'guarantee' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'guarantee' && (
                  <div className="pb-4 font-code text-[9px] tracking-wide text-white/40 leading-relaxed uppercase space-y-1.5">
                    <p>· TODOS NUESTROS ARTÍCULOS CUENTAN CON 3 AÑOS DE GARANTÍA OFICIAL CONTRA DEFECTOS DE FABRICACIÓN.</p>
                    <p>· PROTECCIÓN TOTAL HOMOLOGADA CONTRA LA RADIACIÓN SOLAR UV400 (LENTES DE CATEGORÍA 3).</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* GALLERY — todas las imágenes oficiales del modelo */}
        {product.gallery && product.gallery.length > 0 && (
          <section className="max-w-[1400px] mx-auto mt-16 px-6 lg:px-10">
            <div className="border-b border-white/[0.07] pb-6 mb-8 text-left">
              <p className="font-code text-[9px] tracking-[0.35em] text-white/30 uppercase mb-3">
                GALERÍA OFICIAL — MODELO {product.letter}
              </p>
              <h2 className="font-bebas text-[36px] md:text-[48px] tracking-wide leading-none text-white uppercase">
                {product.name}
              </h2>
              <p className="font-code text-[10px] text-white/40 mt-3 uppercase tracking-wider">
                {product.gallery.length} TOMAS · HAZ CLIC PARA AMPLIAR
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {product.gallery.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setLightboxIndex(i)}
                  className="group relative aspect-square bg-[#050505] border border-white/[0.06] overflow-hidden rounded-sm hover:border-white/20 transition-colors cursor-zoom-in"
                >
                  <Image
                    src={img}
                    alt={`${product.name} — toma ${getShotLabel(img)}`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-contain p-4 md:p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 border border-white/20 text-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={11} strokeWidth={2} />
                  </div>
                  <div className="absolute bottom-3 left-3 font-code text-[8px] tracking-[0.2em] text-white/30 uppercase">
                    {getShotLabel(img)}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Lightbox premium — navegación exclusiva dentro del modelo */}
        <ProductGallery
          images={product.gallery}
          productName={product.name}
          productCode={product.code}
          letter={product.letter}
          initialIndex={lightboxIndex ?? 0}
          open={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
        />
      </main>

      <Footer />
    </div>
  )
}
