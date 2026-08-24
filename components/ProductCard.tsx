'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Maximize2 } from 'lucide-react'
import {
  WayfarerSVG,
  RoundSVG,
  ShieldSVG,
  AviatorSVG,
  CatEyeSVG,
  SportSVG,
} from './SunglassesIllustration'

import ProductGallery from './ProductGallery'
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const images = gallery && gallery.length > 0 ? gallery : image ? [image] : []

  return (
    <Link href={`/producto/${slug}`} className="group block relative overflow-hidden h-full" style={{ background: bg }}>
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

      {/* Gender tag */}
      <div className="absolute top-5 left-5">
        <span className="font-code text-[9px] tracking-[0.25em] text-white/30 uppercase">{gender}</span>
      </div>

      {/* Model letter tag */}
      <div className="absolute top-5 right-12">
        <span className="font-code text-[9px] tracking-[0.25em] text-white/30 uppercase">MODELO {letter}</span>
      </div>

      {/* Corner arrow */}
      <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0">
        <ArrowUpRight size={16} className="text-white/60" strokeWidth={1.5} />
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-code text-[10px] tracking-widest text-gray-mid uppercase mb-1">{code}</p>
            <p className="font-display text-base font-semibold text-white leading-tight">{name}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-xl font-semibold text-white">{price}</p>
            <p className="font-code text-[9px] tracking-widest text-gray-mid">EUR</p>
          </div>
        </div>

        {/* Hover CTA bar */}
        <div className="overflow-hidden h-0 group-hover:h-10 transition-all duration-300 ease-in-out mt-2">
          <div className="flex items-center justify-center border border-white/20 py-2.5">
            <span className="font-code text-[10px] tracking-widest text-white uppercase">
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
