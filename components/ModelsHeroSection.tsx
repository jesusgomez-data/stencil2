'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const FEATURED_MODELS = [
  {
    name: 'FLERSY',
    slug: 'flersy-soires-naes',
    price: '49€',
  },
  {
    name: 'IBZEN',
    slug: 'ibzen-soires-naes',
    price: '49€',
  },
  {
    name: 'BLACKEYE',
    slug: 'blackeye-utk',
    price: '39€',
  },
  {
    name: 'RUBEN SMOKE',
    slug: 'ruben-smoke-tropical',
    price: '39€',
  },
]

export default function ModelsHeroSection() {
  return (
    <section id="models-hero-section" className="bg-black py-8 md:py-12 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header minimalista */}
        <div className="flex items-center justify-between pb-3 mb-2">
          <h3 className="font-code text-[10px] tracking-[0.28em] text-white/42 uppercase">
            STREET EDITORIAL // MODELOS
          </h3>
          <Link
            href="/tienda"
            className="font-code text-[10px] tracking-widest text-white/40 hover:text-white transition-colors uppercase inline-flex items-center gap-1.5"
          >
            VER CATÁLOGO
            <ArrowRight size={11} strokeWidth={2} />
          </Link>
        </div>

        {/* Banner Hero: en móvil foto 16:9 completa arriba y texto abajo sin tapar nada; en desktop billboard con overlay */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-[#050505] select-none shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col md:block md:h-[460px] lg:h-[490px]">

          {/* Contenedor de la foto con ratio panorámico para ver a los 4 modelos completos */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[1.85/1] md:aspect-auto md:absolute md:inset-0 md:h-full overflow-hidden">
            {/* 1. Animación continua de cámara lenta (Ken Burns effect en bucle infinito) */}
            <motion.div
              className="absolute inset-0 z-0 will-change-transform"
              animate={{
                scale: [1.0, 1.05, 1.02, 1.05, 1.0],
                x: ['0%', '-1%', '0.8%', '-0.4%', '0%'],
                y: ['0%', '-0.8%', '0.4%', '-0.6%', '0%'],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Image
                src="/images/ejemploModels.png"
                alt="Modelos Stencil2"
                fill
                priority
                quality={95}
                sizes="(max-width: 768px) 100vw, 1400px"
                className="object-cover object-center"
              />
            </motion.div>

            {/* 2. Destello solar automático que barre las gafas periódicamente */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
              <motion.div
                className="absolute -top-[50%] -bottom-[50%] w-[160px] md:w-[240px] bg-gradient-to-r from-transparent via-white/[0.18] to-transparent -rotate-[22deg] blur-md will-change-transform"
                animate={{
                  left: ['-30%', '130%'],
                  opacity: [0, 0.9, 0.9, 0],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  repeatDelay: 5.2,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />
            </div>

            {/* 3. Resplandor solar ambiental en la esquina superior derecha */}
            <motion.div
              className="absolute -top-10 -right-10 w-[280px] h-[280px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none z-10 blur-[60px] md:blur-[80px]"
              style={{
                background: 'radial-gradient(circle, rgba(255,220,150,0.22) 0%, rgba(255,180,80,0.08) 50%, transparent 75%)',
              }}
              animate={{
                opacity: [0.35, 0.8, 0.35],
                scale: [0.95, 1.12, 0.95],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* 4. Viñeteado perimetral */}
            <div
              className="absolute inset-0 z-15 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)',
              }}
            />

            {/* 5. Gradiente inferior solo visible en desktop para fundir el texto en la parte inferior */}
            <div
              className="hidden md:block absolute inset-0 z-20 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 78%, rgba(0,0,0,0.92) 100%)',
              }}
            />
          </div>

          {/* Contenido: en móvil se coloca limpiamente DEBAJO de la foto (cero interferencia visual con los rostros); en desktop queda sobre el tercio inferior */}
          <div className="relative z-30 p-5 sm:p-6 md:absolute md:bottom-0 md:left-0 md:right-0 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[#050505] md:bg-transparent border-t border-white/[0.06] md:border-t-0">
            <div className="max-w-md">
              <h4 className="font-bebas text-2xl sm:text-3xl md:text-4xl text-white tracking-wide leading-none drop-shadow-md">
                EL ESTILO NO SE PIDE. SE IMPONE.
              </h4>
              <p className="font-code text-[10.5px] sm:text-[11px] text-white/60 mt-1 leading-snug drop-shadow-sm">
                Diseñadas para el asfalto. Acetato pulido a mano y protección UV400.
              </p>
            </div>

            {/* Acciones y accesos rápidos a los modelos */}
            <div className="flex flex-col sm:flex-row md:flex-col sm:items-center md:items-end gap-2.5 flex-shrink-0">
              <Link
                href="/tienda"
                className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-sm bg-white text-black font-code text-[10px] font-bold tracking-[0.14em] uppercase hover:bg-neutral-200 transition-colors shadow-sm w-full sm:w-auto"
              >
                <span>EXPLORAR MODELOS</span>
                <ArrowRight size={11} strokeWidth={2.2} />
              </Link>

              {/* Píldoras de los modelos */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {FEATURED_MODELS.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/producto/${m.slug}`}
                    className="inline-flex items-center justify-between sm:justify-start gap-1.5 px-2.5 py-1.5 rounded-sm bg-white/[0.04] md:bg-black/60 hover:bg-white hover:text-black text-white/80 border border-white/10 hover:border-white font-code text-[9px] tracking-wider transition-all duration-200"
                  >
                    <span>{m.name}</span>
                    <span className="text-white/40 font-normal">{m.price}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
