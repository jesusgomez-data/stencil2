'use client'

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
  return (
    <section id="models-hero-section" className="bg-black py-8 md:py-12 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header minimalista alineado con el resto del sitio */}
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

        {/* Banner Hero compacto y cinematográfico */}
        <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[480px] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/20 transition-all duration-500 group bg-[#050505]">
          {/* Imagen de los modelos: encuadre alto para que las caras y gafas queden despejadas */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/ejemploModels.png"
              alt="Modelos Stencil2"
              fill
              priority
              quality={95}
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover object-[center_18%] sm:object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>

          {/* Gradiente suave solo en el tercio inferior para que los rostros queden 100% nítidos */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 78%, rgba(0,0,0,0.92) 100%)',
            }}
          />

          {/* Contenido inferior: tipografía reducida y sin tapar las caras de los modelos */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-7 md:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-md">
              <h4 className="font-bebas text-2xl sm:text-3xl md:text-4xl text-white tracking-wide leading-none drop-shadow-md">
                EL ESTILO NO SE PIDE. SE IMPONE.
              </h4>
              <p className="font-code text-[11px] text-white/60 mt-1 leading-snug drop-shadow-sm">
                Diseñadas para el asfalto. Acetato pulido a mano y protección UV400.
              </p>
            </div>

            {/* Acciones y accesos rápidos a los modelos de la foto */}
            <div className="flex flex-col sm:items-end gap-2.5 flex-shrink-0">
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-sm bg-white text-black font-code text-[10px] font-bold tracking-[0.14em] uppercase hover:bg-neutral-200 transition-colors shadow-sm self-start sm:self-end"
              >
                <span>EXPLORAR MODELOS</span>
                <ArrowRight size={11} strokeWidth={2.2} />
              </Link>

              {/* Píldoras discretas de los modelos */}
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
