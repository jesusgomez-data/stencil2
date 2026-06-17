'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Eye, ShieldCheck, Heart } from 'lucide-react'

export default function NosotrosPage() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-10 max-w-4xl mx-auto w-full text-left">
        {/* Header */}
        <div className="border-b border-white/[0.07] pb-6 mb-10">
          <p className="font-code text-[9px] tracking-[0.35em] text-white/30 uppercase mb-2">LA MARCA</p>
          <h1 className="font-bebas text-[48px] md:text-[64px] tracking-wide leading-none text-white uppercase">SOBRE NOSOTROS</h1>
        </div>

        {/* Narrative */}
        <div className="space-y-8 font-code text-xs text-white/50 leading-relaxed uppercase">
          <p className="font-display text-lg font-semibold text-white/90 normal-case leading-normal">
            Nacidos en las calles, diseñados para los días de sol. STENCIL2 representa la unión de la ingeniería óptica con la cultura urbana y el streetwear de vanguardia.
          </p>

          <p>
            Fundada en 2026 en España, STENCIL2 surge de la necesidad de ofrecer gafas de sol de alta gama sin el sobreprecio habitual de las marcas de lujo. Nos centramos en lo esencial: monturas de acetato orgánico cortado a mano, polímeros de memoria flexible y lentes polarizadas de protección total UV400.
          </p>

          <p>
            Creemos que las gafas de sol no son un simple accesorio, sino una extensión de la identidad personal. Por eso, cada modelo se produce en ediciones limitadas bajo estrictos controles de calidad, asegurando que cada pieza que sale de nuestro almacén sea única.
          </p>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/[0.06] mt-8">
            <div className="space-y-2">
              <Eye size={16} className="text-[#C4822A]" />
              <p className="font-bold text-white text-[11px]">CALIDAD ÓPTICA</p>
              <p className="text-[10px] text-white/30 leading-normal">Lentes polarizadas de categoría 3 que garantizan una protección absoluta contra la radiación UV400 y reducen los reflejos al mínimo.</p>
            </div>
            <div className="space-y-2">
              <ShieldCheck size={16} className="text-[#C4822A]" />
              <p className="font-bold text-white text-[11px]">DURABILIDAD TÉCNICA</p>
              <p className="text-[10px] text-white/30 leading-normal">Monturas fabricadas en acetato italiano pulido a mano y polímero flexible TR90 con alma metálica y bisagras reforzadas de acero.</p>
            </div>
            <div className="space-y-2">
              <Heart size={16} className="text-[#C4822A]" />
              <p className="font-bold text-white text-[11px]">CULTURA URBANA</p>
              <p className="text-[10px] text-white/30 leading-normal">Nuestros diseños se inspiran en la música, el arte callejero y la arquitectura urbana de las grandes metrópolis.</p>
            </div>
          </div>

          {/* Call to action */}
          <div className="pt-10 text-center">
            <Link
              href="/tienda"
              className="inline-block font-code text-[10px] tracking-widest text-black bg-white hover:bg-white/80 px-10 py-4 font-bold transition-all uppercase rounded-sm"
            >
              EXPLORAR LA COLECCIÓN
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
