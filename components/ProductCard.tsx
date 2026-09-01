'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Maximize2, ShoppingBag, Check } from 'lucide-react'
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
  price:    string
  gender:   'MEN' | 'WOMEN' | 'UNISEX'
  model:    GlassesModel
  slug:     string
  image?:   string
  gallery?: string[]
  isLarge?: boolean
}

export default function ProductCard({
  code, letter, name, price, gender, model, slug, image, gallery, isLarge,
}: ProductCardProps) {
  const Illustration = ILLUSTRATIONS[model]
  const bg = BG_COLORS[model]
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addToCart } = useCart()

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

  const images = gallery && gallery.length > 0 ? gallery : image ? [image] : []

  return (
    <Link href={`/producto/${slug}`} className="group block relative overflow-hidden h-full min-h-96" style={{ background: bg }}>
      {/* Glow spot */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 bg-white/[0.03] blur-2xl rounded-full" />
      </div>

      {/* Product photo or illustration fallback — click on the photo opens the model gallery */}
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
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-4 md:p-6 transition-transform duration-700 group-hover:scale-105"
            sizes="400px"
          />
          <div className="absolute top-4 right-4 z-20 w-7 h-7 rounded-full bg-black/40 border border-white/20 text-white/70 flex items-center justify-center">
            <Maximize2 size={11} strokeWidth={2} />
          </div>
        </div>
      ) : (
        <motion.div
          className="absolute inset-0 flex items-center justify-center p-8"
          whileHover={{ y: -8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Illustration
            color="white"
            className={`w-full ${isLarge ? 'max-w-sm' : 'max-w-[260px]'} opacity-80 group-hover:opacity-100 transition-opacity duration-500`}
          />
        </motion.div>
      )}

      {/* Like button — encima de la etiqueta de género */}
      <div className="absolute top-3 left-5 z-20">
        <FavoriteButton slug={slug} />
      </div>

      {/* Gender tag */}
      <div className="absolute top-12 left-5">
        <span className="font-code text-[9px] tracking-[0.25em] text-white/30 uppercase">{gender}</span>
      </div>

      {/* Name tag replacing Model letter tag */}
      <div className="absolute top-5 right-12">
        <span className="font-code text-[9px] tracking-[0.25em] text-white/30 uppercase">{name}</span>
      </div>

      {/* Corner arrow */}
      <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0">
        <ArrowUpRight size={16} className="text-white/60" strokeWidth={1.5} />
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/85 via-black/30 to-transparent">
        <div className="flex items-end justify-between">
          <div className="max-w-[65%] pr-2">
            <p className="font-code text-[9px] tracking-[0.2em] text-white/40 uppercase mb-1">{code}</p>
            <p className="font-code text-[11px] tracking-[0.14em] text-white/90 uppercase font-semibold leading-snug group-hover:text-white transition-colors">
              {letter}
            </p>
          </div>
          <div className="flex items-end gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="font-display text-base font-bold text-white leading-none">{price}</p>
              <p className="font-code text-[8px] tracking-widest text-white/40 uppercase mt-0.5">EUR</p>
            </div>
            
            {/* Quick Add To Cart Button */}
            <button
              onClick={handleQuickAdd}
              title="Añadir al carrito"
              className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                justAdded
                  ? 'bg-[#1C3B1C] border-[#2c5c2c] text-white scale-105'
                  : 'bg-black/60 border-white/20 text-white/70 hover:text-white hover:border-white/50 hover:bg-white/10'
              }`}
            >
              {justAdded ? <Check size={13} strokeWidth={2.5} /> : <ShoppingBag size={13} strokeWidth={1.5} />}
            </button>

            {/* 3D View Button (Mobile Friendly Link) */}
            <Link
              href={`/producto/${slug}`}
              title="Ver en 360°"
              className="w-8 h-8 rounded-full border border-white/20 bg-black/60 text-white/70 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
            </Link>

            <ShareButton
              title={`${name} — STENCIL2`}
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/producto/${slug}`}
            />
          </div>
        </div>

        {/* Hover CTA bar */}
        <div className="overflow-hidden h-0 group-hover:h-10 transition-all duration-300 ease-in-out mt-2">
          <div className="flex items-center justify-center border border-white/20 py-2 bg-black/40 backdrop-blur-sm">
            <span className="font-code text-[9px] tracking-[0.25em] text-white uppercase">
              VER MODELO →
            </span>
          </div>
        </div>
      </div>

      {/* Bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-cta scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

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
