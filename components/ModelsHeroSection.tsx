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

        {/* Banner Hero Cinematográfico con Animación Autónoma */}
        <div className="relative w-full h-[360px] sm:h-[410px] md:h-[460px] lg:h-[490px] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#050505] select-none shadow-[0_20px_50px_rgba(0,0,0,0.8)]">

          {/* 1. Animación continua de cámara lenta (Ken Burns effect en bucle infinito) */}
          <motion.div
            className="absolute inset-0 z-0 will-change-transform"
            animate={{
              scale: [1.0, 1.07, 1.03, 1.06, 1.0],
              x: ['0%', '-1.2%', '1%', '-0.5%', '0%'],
              y: ['0%', '-1%', '0.5%', '-0.8%', '0%'],
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
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover object-[center_18%] sm:object-[center_20%]"
            />
          </motion.div>

          {/* 2. Destello solar / rayo anamórfico automático que barre las gafas cada 6 segundos */}
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

          {/* 3. Resplandor solar ambiental que respira en la esquina superior derecha (coincide con la luz real de la foto) */}
          <motion.div
            className="absolute -top-10 -right-10 w-[380px] h-[380px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none z-10 blur-[80px]"
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

          {/* 4. Viñeteado perimetral cinematográfico */}
          <div
            className="absolute inset-0 z-15 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)',
            }}
          />

          {/* 5. Gradiente inferior para legibilidad del texto sin oscurecer los rostros */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 78%, rgba(0,0,0,0.92) 100%)',
            }}
          />

          {/* Contenido inferior */}
          <div className="absolute bottom-0 left-0 right-0 z-30 p-5 sm:p-7 md:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-md">
              <h4 className="font-bebas text-2xl sm:text-3xl md:text-4xl text-white tracking-wide leading-none drop-shadow-md">
                EL ESTILO NO SE PIDE. SE IMPONE.
              </h4>
              <p className="font-code text-[11px] text-white/60 mt-1 leading-snug drop-shadow-sm">
                Diseñadas para el asfalto. Acetato pulido a mano y protección UV400.
              </p>
            </div>

            {/* Acciones y accesos rápidos a los modelos */}
            <div className="flex flex-col sm:items-end gap-2.5 flex-shrink-0">
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-sm bg-white text-black font-code text-[10px] font-bold tracking-[0.14em] uppercase hover:bg-neutral-200 transition-colors shadow-sm self-start sm:self-end"
              >
                <span>EXPLORAR MODELOS</span>
                <ArrowRight size={11} strokeWidth={2.2} />
              </Link>

              {/* Píldoras de los modelos */}
              <div className="flex flex-wrap items-center gap-1.5">
                {FEATURED_MODELS.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/producto/${m.slug}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-black/60 hover:bg-white hover:text-black text-white/80 border border-white/15 hover:border-white font-code text-[9px] tracking-wider transition-all duration-200"
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
