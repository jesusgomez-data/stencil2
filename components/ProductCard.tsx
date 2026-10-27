'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Maximize2, ShoppingBag, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import {
  WayfarerSVG,
  RoundSVG,
  ShieldSVG,
  AviatorSVG,
  CatEyeSVG,
  SportSVG,
} from './SunglassesIllustration'

import ProductGallery from './ProductGallery'
import ShareButton from './ShareButton'
import FavoriteButton from './FavoriteButton'
import { GlassesModel } from '@/types'
import { getSavingsPercent } from '@/lib/products'

const ILLUSTRATIONS: Record<GlassesModel, React.ComponentType<React.SVGProps<SVGSVGElement> & { color?: string }>> = {
  wayfarer: WayfarerSVG,
  round:    RoundSVG,
  shield:   ShieldSVG,
  aviator:  AviatorSVG,
  'cat-eye':CatEyeSVG,
  sport:    SportSVG,
}

const BG_COLORS: Record<GlassesModel, string> = {
  wayfarer:  '#080808',
  round:     '#07080d',
  shield:    '#0a0607',
  aviator:   '#07090a',
  'cat-eye': '#0a070a',
  sport:     '#060a07',
}

export interface ProductCardProps {
  code:     string
  letter:   string
  name:     string
  subtitle?: string
  price:    string
  compareAtPrice?: number
  gender:   'MEN' | 'WOMEN' | 'UNISEX'
  model:    GlassesModel
  slug:     string
  image?:   string
  gallery?: string[]
  isLarge?: boolean
}

export default function ProductCard({
  code, letter, name, subtitle, price, compareAtPrice, model, slug, image, gallery, isLarge,
}: ProductCardProps) {
  const Illustration = ILLUSTRATIONS[model]
  const bg = BG_COLORS[model]
  const savings = getSavingsPercent(parseFloat(price), compareAtPrice)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 29.00
    addToCart({
      id: slug,
      code,
      name,
      slug,
      price: numericPrice,
      image: image || '',
      model,
      color: '#1a1a1a',
      colorLabel: 'Estándar',
    }, 1)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)
  }

  // COMPRAR: añade la gafa al carrito y abre la página del carrito
  const handleBuyNow = (e: React.MouseEvent) => {
    handleQuickAdd(e)
    router.push('/carrito')
  }

  const images = gallery && gallery.length > 0 ? gallery : image ? [image] : []
  const secondaryImage = images.find((img, idx) => idx > 0 && !img.endsWith('.mp4')) || ''

  return (
    <Link href={`/producto/${slug}`} className="group relative flex flex-col h-full min-h-96 overflow-hidden rounded-2xl select-none" style={{ background: bg }}>
      {/* ── 1. CABECERA: Título, subtítulo y botones de acción ── */}
      <div className="relative z-20 pt-3.5 px-3.5 pb-1 flex items-start justify-between gap-2">
        <div className="flex flex-col min-w-0 flex-1 pr-1">
          <span className="font-sans text-[10.5px] sm:text-[11.5px] font-bold tracking-tight sm:tracking-normal text-white uppercase leading-tight line-clamp-2 drop-shadow-md" title={name}>
            {name}
          </span>
          {subtitle && (
            <span className="font-sans text-[8px] sm:text-[8.5px] font-medium tracking-wide text-[#00E575] leading-tight mt-0.5 truncate drop-shadow-md">
              {subtitle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <FavoriteButton slug={slug} />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              router.push(`/producto/${slug}`)
            }}
            title="Ver en 360°"
            aria-label={`Ver ${name} en 360°`}
            className="w-7 h-7 rounded-full border border-white/20 bg-black/40 text-white/70 hover:text-white hover:border-white/50 flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
          </button>
          <ShareButton
            title={`${name} — STENCIL2`}
            url={`${typeof window !== 'undefined' ? window.location.origin : ''}/producto/${slug}`}
            menuPlacement="down"
          />
        </div>
      </div>

      {/* ── 2. PROMO & AMPLIAR: En flujo natural (¡CERO colisiones!) ── */}
      <div className="relative z-20 px-3.5 pt-1.5 pb-0.5 flex items-center justify-between">
        {savings !== null ? (
          <span className="font-code text-[8.5px] tracking-[0.16em] text-white/80 uppercase drop-shadow-md">
            TE AHORRAS {savings}%
          </span>
        ) : <span />}
        <div className="w-6 h-6 rounded-full bg-black/40 border border-white/20 text-white/70 flex items-center justify-center pointer-events-none">
          <Maximize2 size={10} strokeWidth={2} />
        </div>
      </div>

      {/* ── 3. ÁREA DE IMAGEN ── */}
      <div className="relative flex-1 min-h-[190px] w-full">
        {/* Glow spot */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 bg-white/[0.03] blur-2xl rounded-full" />
        </div>

        {/* Foto del producto: al hacer clic se abre la galería del modelo */}
        {image ? (
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setLightboxOpen(true)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                setLightboxOpen(true)
              }
            }}
            className="absolute inset-0 overflow-hidden cursor-zoom-in"
          >
            <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-115">
              <Image
                src={image}
                alt={name}
                fill
                className={`object-contain p-4 transition-opacity duration-500 ease-in-out ${
                  secondaryImage ? 'opacity-100 group-hover:opacity-0' : 'opacity-100'
                }`}
                sizes="400px"
              />
              {secondaryImage && (
                <Image
                  src={secondaryImage}
                  alt={`${name} — vista alternativa`}
                  fill
                  className="object-contain p-4 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
                  sizes="400px"
                />
              )}
            </div>
          </div>
        ) : (
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-6"
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Illustration
              color="white"
              className={`w-full ${isLarge ? 'max-w-sm' : 'max-w-[240px]'} opacity-80 group-hover:opacity-100 transition-opacity duration-500`}
            />
          </motion.div>
        )}
      </div>

      {/* ── 4. PIE: Precio con IVA y botones en la misma fila; envío a todo el ancho ── */}
      <div className="relative z-10 flex flex-col gap-2.5 w-full px-4 pb-4 pt-3 border-t border-white/[0.06] bg-black/80">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex flex-col gap-1.5">
            <p className="font-bebas text-2xl tracking-wide text-white leading-none">
              {price.includes('€') ? price : `${price} €`}
            </p>
            <p className="font-code text-[11px] text-white/35 line-through leading-none h-[11px] whitespace-nowrap">
              {compareAtPrice ? `${compareAtPrice.toFixed(2)} €` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleQuickAdd}
              title="Añadir al carrito"
              aria-label="Añadir al carrito"
              className={`w-10 h-10 rounded-sm border flex items-center justify-center transition-colors duration-300 ${
                justAdded
                  ? 'border-[#2c5c2c] text-white'
                  : 'border-white/30 text-white/80 hover:border-white hover:text-white'
              }`}
            >
              {justAdded ? <Check size={14} strokeWidth={2.5} /> : <ShoppingBag size={14} strokeWidth={1.6} />}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-sm bg-black border border-white/40 text-white font-code text-[9px] font-bold tracking-[0.14em] uppercase transition-colors duration-300 group-hover:bg-white group-hover:text-black group-hover:border-white"
            >
              COMPRAR
              <ArrowRight size={12} strokeWidth={2.2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="font-code text-[9px] tracking-wider text-white/50 leading-snug">IVA incluido</p>
          <p className="font-code text-[9px] tracking-wider text-[#00E575] font-bold leading-snug">Envío gratis</p>
        </div>
      </div>

      {/* Lightbox premium — galería completa del modelo, renderizada vía portal
          para no anidarla dentro del <Link>. La navegación queda confinada al
          modelo: nunca mezcla con otras letras. */}
      {images.length > 0 && mounted && createPortal(
        <ProductGallery
          images={images}
          productName={name}
          productCode={code}
          letter={letter}
          initialIndex={0}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />,
        document.body
      )}
    </Link>
  )
}
