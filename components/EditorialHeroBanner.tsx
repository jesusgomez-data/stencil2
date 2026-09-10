'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    src: '/images/JOINING.jpg',
    alt: 'JOINING CULTURE — Look 01',
    subtitle: 'NUEVA COLECCIÓN',
  },
  {
    src: '/images/a06.png',
    alt: 'JOINING CULTURE — Look 02',
    subtitle: 'NUEVA COLECCIÓN',
  },
  {
    src: '/images/a07.png',
    alt: 'JOINING CULTURE — Look 03',
    subtitle: 'NUEVA COLECCIÓN',
  },
  {
    src: '/images/b06.png',
    alt: 'JOINING CULTURE — Look 04',
    subtitle: 'NUEVA COLECCIÓN',
  },
  {
    src: '/images/fot1.png',
    alt: 'JOINING CULTURE — Look 05',
    subtitle: 'NUEVA COLECCIÓN',
  },
]

const SLIDE_DURATION = 8000 // 8 segundos por diapositiva

export default function EditorialHeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [cycleKey, setCycleKey] = useState(0) // Para reiniciar la animación del timer al cambiar manualmente
  const touchStartX = useRef<number | null>(null)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length)
    setCycleKey((k) => k + 1)
  }, [])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
    setCycleKey((k) => k + 1)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
    setCycleKey((k) => k + 1)
  }, [])

  // Auto-rotación de 8 segundos
  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      goToNext()
    }, SLIDE_DURATION)

    return () => clearInterval(timer)
  }, [isPaused, cycleKey, goToNext])

  // Precarga de imágenes en memoria del navegador
  useEffect(() => {
    SLIDES.forEach((slide) => {
      if (typeof window !== 'undefined') {
        const img = new window.Image()
        img.src = slide.src
      }
    })
  }, [])

  // Control de gestos táctiles (swipe en mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setIsPaused(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const diff = touchStartX.current - e.changedTouches[0].clientX
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          goToNext()
        } else {
          goToPrev()
        }
      }
    }
    touchStartX.current = null
    setIsPaused(false)
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:h-auto h-[390px] aspect-[3/4] sm:aspect-auto lg:aspect-auto border border-white/[0.055] hover:border-white/20 group flex flex-col justify-end p-6 md:p-8 z-10 select-none transition-colors duration-500 bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Precarga oculta para Next.js image optimizer */}
      <div className="hidden" aria-hidden="true">
        {SLIDES.map((slide) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt=""
            width={10}
            height={10}
            priority
          />
        ))}
      </div>

      {/* Capa de imágenes animadas con Framer Motion (Crossfade + Ken Burns) */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{ opacity: 0.68, scale: 1.07 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 8, ease: 'linear' },
            }}
            className="absolute inset-0"
          >
            <Image
              src={SLIDES[currentIndex].src}
              alt={SLIDES[currentIndex].alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center group-hover:brightness-110 transition-[filter] duration-700"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gradientes oscuros para asegurar legibilidad suprema del texto */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.95) 100%)',
        }}
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Barras superiores de progreso estilo Stories / Editorial de Lujo */}
      <div className="absolute top-4 left-5 right-5 md:top-5 md:left-6 md:right-6 z-20 flex items-center gap-1.5 pointer-events-auto">
        {SLIDES.map((_, idx) => {
          const isPassed = idx < currentIndex
          const isCurrent = idx === currentIndex

          return (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                goToSlide(idx)
              }}
              aria-label={`Ir a foto ${idx + 1}`}
              className="group/bar relative flex-1 h-[2.5px] rounded-full bg-white/20 overflow-hidden transition-all duration-300 hover:h-[3.5px] hover:bg-white/30 cursor-pointer"
            >
              {isPassed && (
                <div className="h-full w-full bg-white/80 rounded-full" />
              )}
              {isCurrent && (
                <div
                  key={`progress-${currentIndex}-${cycleKey}`}
                  className="h-full w-full bg-white rounded-full origin-left animate-editorial-progress"
                  style={{
                    animationPlayState: isPaused ? 'paused' : 'running',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Flechas de navegación sutiles (visibles al hover en desktop) */}
      <div className="absolute inset-y-0 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            goToPrev()
          }}
          aria-label="Foto anterior"
          className="pointer-events-auto w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-black/70 hover:scale-105 active:scale-95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0"
        >
          <ChevronLeft size={14} strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            goToNext()
          }}
          aria-label="Foto siguiente"
          className="pointer-events-auto w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-black/70 hover:scale-105 active:scale-95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0"
        >
          <ChevronRight size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Grupo de texto superior */}
      <div className="relative z-10 text-left mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="font-code text-[8px] tracking-[0.35em] text-white/50 uppercase">
            NUEVA COLECCIÓN
          </p>
          <span className="font-code text-[8px] tracking-[0.2em] text-white/30 tabular-nums">
            0{currentIndex + 1} / 0{SLIDES.length}
          </span>
        </div>
        <h2 className="font-bebas text-[38px] leading-[0.88] text-white tracking-wide drop-shadow-sm">
          JOINING<br />CULTURE
        </h2>
      </div>

      {/* Grupo de texto inferior / CTA */}
      <div className="relative z-10 text-left">
        <Link
          href="/tienda"
          className="group/cta inline-flex items-center font-code text-[9px] tracking-widest text-white/60 hover:text-white transition-all uppercase"
        >
          <span className="border-b border-white/25 group-hover/cta:border-white pb-1 mr-3 transition-colors">
            VER COLECCIÓN
          </span>
          <ArrowRight
            size={10}
            strokeWidth={2}
            className="group-hover/cta:translate-x-1 transition-transform duration-300"
          />
        </Link>
      </div>
    </div>
  )
}
