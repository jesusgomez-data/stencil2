'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Viewer3D from '@/components/Viewer3D'
import { PRODUCTS } from '@/lib/products'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { Truck, RotateCcw, ShieldCheck, ChevronDown, ChevronUp, Check, ArrowRight } from 'lucide-react'
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
          <div className="relative bg-[#080808] border-b lg:border-b-0 lg:border-r border-white/[0.06] flex flex-col h-[60vh] lg:h-full">
            {/* Visual Header */}
            <div className="absolute top-6 left-6 z-10 text-left pointer-events-none">
              <span className="font-code text-[8px] tracking-[0.4em] text-white/30 uppercase">INTERACTIVE 3D PREVIEW</span>
              <h2 className="font-code text-[10px] tracking-widest text-[#C4822A] mt-1 uppercase">{selectedColorLabel} FRAME</h2>
            </div>

            {/* Custom Camera Presets controls overlaid on the 3D space */}
            <div className="absolute top-6 right-6 flex flex-col gap-2.5 z-10">
              {['Frontal', 'Lateral', 'Superior', 'Atrás'].map((v) => (
                <button
                  key={v}
                  onClick={() => setActiveView(v)}
                  className={`font-code text-[9px] tracking-widest px-4 py-2 border transition-all uppercase rounded-sm select-none ${
                    activeView === v
                      ? 'bg-white text-black border-white font-semibold'
                      : 'bg-black/40 text-white/30 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* The 3D Canvas */}
            <div className="flex-1 w-full h-full relative">
              <Viewer3D activeColor={selectedColor} activeView={activeView} hideControls={true} />
            </div>

            {/* Hint bar at bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-10">
              <p className="font-code text-[8px] tracking-[0.25em] text-white/20 uppercase whitespace-nowrap">
                ARRASTRA PARA ROTAR · HAZ ZOOM PARA AMPLIAR
              </p>
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

            {/* Color Selector */}
            <div className="mb-6 text-left">
              <p className="font-code text-[9px] tracking-[0.25em] text-white/30 uppercase mb-3">SELECCIONAR COLOR: <span className="text-white">{selectedColorLabel}</span></p>
              <div className="flex items-center gap-3.5">
                {product.colors.map((c) => (
                  <button
                    key={c.label}
                    title={c.label}
                    onClick={() => handleColorChange(c.hex, c.label)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === c.hex
                        ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                        : 'border-white/10 hover:border-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

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
                  'AÑADIR AL CARRITO'
                )}
              </button>
            </div>

            {/* Specifications & Composition */}
            <div className="border-t border-white/[0.08] pt-6 mb-6 text-left">
              <span className="font-code text-[8px] tracking-[0.2em] text-white/30 uppercase block mb-1">COMPOSICIÓN Y DETALLES</span>
              <p className="font-code text-[10px] leading-relaxed text-white/42 uppercase">
                {product.composition}
              </p>
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
      </main>

      <Footer />
    </div>
  )
}
