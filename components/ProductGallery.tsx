'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { getShotLabel } from '@/lib/imageCatalog'

/* ─── Tipos ─────────────────────────────────────────────────────────── */

export interface ProductGalleryProps {
  images: string[]
  productName: string
  productCode: string
  letter: string
  initialIndex?: number
  open: boolean
  onClose: () => void
}

/* ─── Lightbox premium ─────────────────────────────────────────────── */

/**
 * Visor/galería premium de un único modelo de gafas.
 *
 * Reglas del sistema de imágenes:
 *  - Las imágenes recibidas pertenecen SIEMPRE al mismo modelo (letra).
 *  - La navegación se detiene al principio y al final de la galería:
 *    NUNCA salta a otro modelo.
 *  - El orden es natural (A1 → A2 → A10 → A11).
 *  - La información del modelo permanece fija; solo cambia la fotografía.
 */
export default function ProductGallery({
  images,
  productName,
  productCode,
  letter,
  initialIndex = 0,
  open,
  onClose,
}: ProductGalleryProps) {
  const [index, setIndex] = useState(initialIndex)
  const [direction, setDirection] = useState(0)
  const [mounted, setMounted] = useState(false)
  const touchX = useRef<number | null>(null)
  const total = images.length

  useEffect(() => setMounted(true), [])

  // Sincroniza el índice inicial cuando se abre con una toma concreta
  useEffect(() => {
    if (open) setIndex(initialIndex)
  }, [open, initialIndex])

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= total) return // bloqueado: no sale del modelo
      setDirection(next > index ? 1 : -1)
      setIndex(next)
    },
    [index, total]
  )

  const prev = useCallback(() => go(index - 1), [go, index])
  const next = useCallback(() => go(index + 1), [go, index])

  // Teclado: ← → para navegar, ESC para cerrar
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = 'unset'
    }
  }, [open, prev, next, onClose])

  // Swipe táctil (móvil)
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 48) {
      if (dx < 0) next()
      else prev()
    }
    touchX.current = null
  }

  if (!open || !mounted) return null

  const current = images[index]
  const label = getShotLabel(current)

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`Galería del modelo ${productName}`}
      onClick={onClose}
    >
      {/* ── Barra superior: info del modelo + cerrar ── */}
      <div
        className="flex items-center justify-between px-5 md:px-10 pt-5 pb-3 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-baseline gap-3 md:gap-4 min-w-0">
          <span className="font-code text-[9px] tracking-[0.3em] text-white/30 uppercase shrink-0">
            MODELO {letter}
          </span>
          <h2 className="font-display text-sm md:text-lg font-semibold text-white uppercase truncate">
            {productName}
          </h2>
          <span className="font-code text-[9px] tracking-[0.2em] text-white/30 uppercase hidden sm:inline">
            {productCode}
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="font-code text-[10px] tracking-[0.25em] text-white/40 uppercase">
            {label} · {index + 1}/{total}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar galería"
            className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.03] text-white/70 hover:text-white hover:border-white/40 flex items-center justify-center transition-all active:scale-90"
          >
            <X size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* ── Imagen principal ── */}
      <div
        className="relative flex-1 min-h-0 overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center p-4 sm:p-10"
          >
            <Image
              src={current}
              alt={`${productName} — toma ${label}`}
              fill
              sizes="(max-width: 768px) 100vw, 90vw"
              className="object-contain"
              priority
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Flechas — nunca salen del modelo (ocultas en los extremos) */}
        {index > 0 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Toma anterior"
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:border-white/40 hover:bg-black/60 flex items-center justify-center transition-all active:scale-90"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
        )}
        {index < total - 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Toma siguiente"
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:border-white/40 hover:bg-black/60 flex items-center justify-center transition-all active:scale-90"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* ── Miniaturas del mismo modelo ── */}
      {total > 1 && (
        <div
          className="px-4 md:px-10 pb-5 pt-3 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center gap-2 md:gap-3 overflow-x-auto pb-1"
            style={{ scrollbarWidth: 'thin' }}
          >
            {images.map((img, i) => {
              const active = i === index
              return (
                <button
                  key={img}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Ir a la toma ${getShotLabel(img)}`}
                  className={`relative w-14 h-14 md:w-[72px] md:h-[72px] rounded-lg overflow-hidden border transition-all duration-300 flex-shrink-0 ${
                    active
                      ? 'border-white/70 bg-white/[0.08]'
                      : 'border-white/[0.08] bg-white/[0.02] opacity-50 hover:opacity-100 hover:border-white/25'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${productName} — toma ${getShotLabel(img)}`}
                    fill
                    sizes="96px"
                    className="object-contain p-1.5"
                    draggable={false}
                  />
                  <span className="absolute bottom-0.5 left-1.5 font-code text-[7px] tracking-wider text-white/50 uppercase">
                    {getShotLabel(img)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </motion.div>,
    document.body
  )
}
