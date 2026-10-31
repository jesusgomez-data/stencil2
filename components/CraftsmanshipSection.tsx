'use client'

import { SunMedium, Layers, ShieldCheck, Feather } from 'lucide-react'

const FEATURES = [
  {
    title: 'POLARIZADAS UV400',
    desc: 'Visión nítida y cero reflejos.',
    badge: 'CAT. 3 / UV400',
    Icon: SunMedium,
  },
  {
    title: 'ACETATO ORGÁNICO',
    desc: 'Pulido a mano durante 72 horas.',
    badge: 'ALTO BRILLO',
    Icon: Layers,
  },
  {
    title: 'BISAGRAS DE ACERO',
    desc: 'Estructura de 5 dientes sin holguras.',
    badge: 'REFORZADAS',
    Icon: ShieldCheck,
  },
  {
    title: 'AJUSTE ULTRA-LIGHT',
    desc: 'Ergonomía que no presiona la nariz.',
    badge: '32 GRAMOS',
    Icon: Feather,
  },
]

export default function CraftsmanshipSection() {
  return (
    <section id="craftsmanship-section" className="bg-black py-8 sm:py-10 md:py-14 border-t border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Cabecera limpia y directa */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-6">
          <h3 className="font-code text-[10px] tracking-[0.28em] text-white/42 uppercase">
            ESTÁNDARES DE CALIDAD
          </h3>
          <span className="font-code text-[10px] tracking-widest text-white/30 uppercase hidden sm:block">
            MATERIALES & INGENIERÍA ÓPTICA
          </span>
        </div>

        {/* Grid adaptable: en móvil tarjetas horizontales cómodas sin texto apretado; en desktop 4 columnas con zoom interactivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {FEATURES.map((feat) => {
            const Icon = feat.Icon

            return (
              <div
                key={feat.title}
                className="relative p-4 sm:p-6 rounded-xl bg-[#060606] hover:bg-[#0c0c0c] border border-white/[0.07] hover:border-white/30 transition-all duration-300 ease-out transform hover:scale-[1.02] sm:hover:scale-[1.05] hover:shadow-[0_15px_35px_rgba(0,0,0,0.9)] hover:z-20 cursor-default flex flex-row sm:flex-col justify-start sm:justify-between items-center sm:items-stretch gap-3.5 sm:gap-4 group select-none min-h-0 sm:min-h-[170px]"
              >
                {/* Icono con contenedor refinado */}
                <div className="flex items-start justify-between gap-2 sm:w-full">
                  <div className="p-2 sm:p-2.5 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.08] border border-white/[0.05] transition-colors duration-300 flex-shrink-0">
                    <Icon
                      size={20}
                      strokeWidth={1.7}
                      className="text-white/45 group-hover:text-white transition-all duration-300 transform group-hover:scale-110"
                    />
                  </div>

                  {/* Badge en desktop en la esquina superior derecha */}
                  <span className="hidden sm:inline-block font-code text-[8.5px] sm:text-[9px] tracking-wider text-white/40 group-hover:text-white/75 uppercase bg-white/[0.04] group-hover:bg-white/[0.08] px-2 py-0.5 rounded-sm border border-white/[0.05] group-hover:border-white/20 transition-all duration-300 whitespace-nowrap">
                    {feat.badge}
                  </span>
                </div>

                {/* Textos: en móvil alineados horizontalmente con holgura; en desktop abajo */}
                <div className="flex-1 min-w-0 sm:mt-3">
                  <div className="flex items-center justify-between gap-2 sm:block">
                    <h4 className="font-bebas text-lg sm:text-xl md:text-2xl text-white tracking-wide uppercase leading-tight group-hover:translate-x-0.5 transition-transform duration-300 truncate sm:whitespace-normal">
                      {feat.title}
                    </h4>

                    {/* Badge visible en móvil alineado a la derecha sin deformarse */}
                    <span className="sm:hidden font-code text-[8px] tracking-wider text-white/50 uppercase bg-white/[0.04] px-1.5 py-0.5 rounded-sm border border-white/[0.05] whitespace-nowrap flex-shrink-0">
                      {feat.badge}
                    </span>
                  </div>

                  <p className="font-code text-[10.5px] sm:text-[11px] text-white/45 group-hover:text-white/70 leading-snug transition-colors duration-300 mt-0.5">
                    {feat.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
