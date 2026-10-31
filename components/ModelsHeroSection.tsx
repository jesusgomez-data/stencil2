'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    // Normalizado de -1 a 1 desde el centro
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setMousePos({ x, y })
  }

  const handleMouseEnter = () => setIsHovered(true)

  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePos({ x: 0, y: 0 })
  }

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

        {/* Banner Hero con efectos especiales y paralaje 3D interactivo */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[480px] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/25 transition-colors duration-500 group bg-[#050505] select-none"
        >
          {/* Contenedor de imagen con paralaje dinámico al mover el cursor */}
          <div
            className="absolute inset-0 z-0 will-change-transform"
            style={{
              transform: isHovered
                ? `scale(1.045) translate3d(${mousePos.x * -12}px, ${mousePos.y * -8}px, 0)`
                : 'scale(1.0) translate3d(0px, 0px, 0)',
              transition: isHovered
                ? 'transform 0.12s ease-out'
                : 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
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
          </div>

          {/* Destello de luz interactivo tipo "lente solar" que sigue suavemente al cursor */}
          <div
            className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 ease-out will-change-[opacity]"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(circle 380px at ${(mousePos.x / 2 + 0.5) * 100}% ${(mousePos.y / 2 + 0.5) * 100}%, rgba(255, 235, 200, 0.13) 0%, rgba(255, 255, 255, 0.04) 35%, transparent 75%)`,
            }}
          />

          {/* Barrido de luz anamórfico tipo cine al entrar con el cursor */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="absolute -inset-full w-[250%] h-[200%] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -rotate-45 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1000 ease-in-out" />
          </div>

          {/* Viñeta sutil en esquinas para profundidad de cine */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
            }}
          />

          {/* Gradiente inferior para legibilidad del texto sin oscurecer los rostros */}
          <div
            className="absolute inset-0 z-15 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 78%, rgba(0,0,0,0.92) 100%)',
            }}
          />

          {/* Contenido inferior interactivo */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-7 md:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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
