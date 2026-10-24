'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function EditorialHeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:col-span-2 xl:col-span-1 xl:row-span-2 xl:h-auto h-[390px] aspect-[3/4] sm:aspect-auto border border-white/[0.055] hover:border-white/20 group flex flex-col justify-end p-6 md:p-8 z-10 select-none transition-colors duration-500 bg-black">
      {/* Foto única de la campaña */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <Image
          src="/images/a07.png"
          alt="JOINING CULTURE — Nueva colección"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center opacity-[0.68] group-hover:opacity-80 group-hover:scale-[1.03] transition-[opacity,transform] duration-700"
        />
      </div>

      {/* Gradientes oscuros para asegurar la legibilidad del texto */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      {/* Texto superior y título */}
      <div className="relative z-10 text-left mb-6">
        <p className="font-code text-[8px] tracking-[0.35em] text-white/50 uppercase mb-3">
          NUEVA COLECCIÓN
        </p>
        <h2 className="font-bebas text-[38px] leading-[0.88] text-white tracking-wide drop-shadow-sm">
          JOINING<br />CULTURE
        </h2>
      </div>

      {/* CTA */}
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
