'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import {
  WayfarerSVG,
  RoundSVG,
  ShieldSVG,
  AviatorSVG,
  CatEyeSVG,
  SportSVG,
} from './SunglassesIllustration'

export type GlassesModel = 'wayfarer' | 'round' | 'shield' | 'aviator' | 'cat-eye' | 'sport'

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
  code:    string
  name:    string
  price:   string
  gender:  'MEN' | 'WOMEN' | 'UNISEX'
  model:   GlassesModel
  slug:    string
  isLarge?: boolean
}

export default function ProductCard({ code, name, price, gender, model, slug, isLarge }: ProductCardProps) {
  const Illustration = ILLUSTRATIONS[model]
  const bg = BG_COLORS[model]

  return (
    <Link href={`/producto/${slug}`} className="group block relative overflow-hidden h-full" style={{ background: bg }}>
      {/* Glow spot */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 bg-white/[0.03] blur-2xl rounded-full" />
      </div>

      {/* Illustration */}
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

      {/* Gender tag */}
      <div className="absolute top-5 left-5">
        <span className="font-code text-[9px] tracking-[0.25em] text-white/30 uppercase">{gender}</span>
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
    </Link>
  )
}
