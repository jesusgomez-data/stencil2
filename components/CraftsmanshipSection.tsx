'use client'

import { SunMedium, Layers, ShieldCheck, Feather } from 'lucide-react'

/* ─── Esquemas técnicos en SVG (Blueprints de ingeniería óptica) ─── */

function PolarizedLensDrawing() {
  return (
    <svg viewBox="0 0 160 85" fill="none" className="w-full h-full text-white/70" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="42" x2="150" y2="42" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.2" />
      <line x1="80" y1="8" x2="80" y2="76" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.2" />
      {/* Perfil curvo de la lente */}
      <path d="M 68 12 C 84 12 96 26 96 42 C 96 58 84 72 68 72 C 77 58 77 26 68 12 Z" fill="rgba(255,255,255,0.05)" stroke="currentColor" strokeWidth="1.4" />
      {/* Lámina polarizada interior */}
      <line x1="80" y1="16" x2="80" y2="68" stroke="#00E575" strokeWidth="1.6" strokeOpacity="0.85" />
      <line x1="76" y1="19" x2="76" y2="65" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="84" y1="19" x2="84" y2="65" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
      {/* Rayos UV bloqueados */}
      <path d="M 18 32 L 54 39" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      <path d="M 16 52 L 54 45" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      <path d="M 54 39 L 40 20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.3" />
      {/* Haz polarizado nítido resultante */}
      <path d="M 96 42 L 138 42" stroke="#00E575" strokeWidth="1.6" strokeOpacity="0.9" />
      <polygon points="142,42 135,39 135,45" fill="#00E575" />
      <text x="16" y="20" fill="currentColor" fillOpacity="0.4" fontSize="7" fontFamily="monospace">UV400</text>
      <text x="96" y="32" fill="#00E575" fillOpacity="0.8" fontSize="7" fontFamily="monospace">100% POLARIZED</text>
    </svg>
  )
}

function AcetateFrameDrawing() {
  return (
    <svg viewBox="0 0 160 85" fill="none" className="w-full h-full text-white/70" xmlns="http://www.w3.org/2000/svg">
      {/* Silueta técnica de montura wayfarer */}
      <rect x="22" y="22" width="48" height="38" rx="7" stroke="currentColor" strokeWidth="1.6" fill="rgba(255,255,255,0.03)" />
      <rect x="90" y="22" width="48" height="38" rx="7" stroke="currentColor" strokeWidth="1.6" fill="rgba(255,255,255,0.03)" />
      {/* Puente */}
      <path d="M 70 33 Q 80 29 90 33" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Patillas */}
      <path d="M 22 28 L 10 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 138 28 L 150 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Puntos de mira ópticos */}
      <circle cx="46" cy="41" r="1.5" fill="#00E575" />
      <line x1="40" y1="41" x2="52" y2="41" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.4" />
      <line x1="46" y1="35" x2="46" y2="47" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="114" cy="41" r="1.5" fill="#00E575" />
      <line x1="108" y1="41" x2="120" y2="41" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.4" />
      <line x1="114" y1="35" x2="114" y2="47" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.4" />
      {/* Cota de medición milimétrica */}
      <line x1="22" y1="72" x2="138" y2="72" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="3 2" />
      <line x1="22" y1="69" x2="22" y2="75" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1="138" y1="69" x2="138" y2="75" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
      <text x="64" y="74" fill="currentColor" fillOpacity="0.4" fontSize="7" fontFamily="monospace">145 mm</text>
      <text x="22" y="15" fill="currentColor" fillOpacity="0.4" fontSize="7" fontFamily="monospace">72H POLISHED</text>
    </svg>
  )
}

function HingeDrawing() {
  return (
    <svg viewBox="0 0 160 85" fill="none" className="w-full h-full text-white/70" xmlns="http://www.w3.org/2000/svg">
      {/* Bisagra frontal */}
      <rect x="32" y="28" width="28" height="28" rx="2" stroke="currentColor" strokeWidth="1.2" fill="rgba(255,255,255,0.03)" />
      {/* 5 Dientes de articulación intercalados */}
      <rect x="60" y="20" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1" fill="#141414" />
      <rect x="60" y="29" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1" fill="#141414" />
      <rect x="60" y="38" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1" fill="#141414" />
      <rect x="60" y="47" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1" fill="#141414" />
      <rect x="60" y="56" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1" fill="#141414" />
      {/* Pasador de acero inoxidable */}
      <line x1="65" y1="16" x2="65" y2="67" stroke="#00E575" strokeWidth="1.8" strokeLinecap="round" />
      {/* Placa lateral de la patilla */}
      <rect x="70" y="28" width="38" height="28" rx="2" stroke="currentColor" strokeWidth="1.2" fill="rgba(255,255,255,0.03)" />
      {/* Tornillos micro */}
      <circle cx="46" cy="42" r="3" stroke="currentColor" strokeWidth="0.8" />
      <line x1="44" y1="42" x2="48" y2="42" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="94" cy="42" r="3" stroke="currentColor" strokeWidth="0.8" />
      <line x1="92" y1="42" x2="96" y2="42" stroke="currentColor" strokeWidth="0.8" />
      {/* Arco de apertura */}
      <path d="M 115 28 A 22 22 0 0 1 126 50" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.4" />
      <polygon points="127,52 123,48 129,47" fill="currentColor" fillOpacity="0.6" />
      <text x="122" y="24" fill="currentColor" fillOpacity="0.4" fontSize="7" fontFamily="monospace">95°</text>
      <text x="32" y="15" fill="currentColor" fillOpacity="0.4" fontSize="7" fontFamily="monospace">STEEL 5-BARREL</text>
    </svg>
  )
}

function ErgonomicsDrawing() {
  return (
    <svg viewBox="0 0 160 85" fill="none" className="w-full h-full text-white/70" xmlns="http://www.w3.org/2000/svg">
      {/* Perfil lateral de patilla ergonómica */}
      <path d="M 18 36 L 48 34 Q 92 34 114 40 Q 134 46 142 62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Líneas de distribución aerodinámica y agarre */}
      <path d="M 22 24 Q 68 22 108 28 Q 128 32 148 44" stroke="#00E575" strokeWidth="1" strokeOpacity="0.65" strokeDasharray="3 3" fill="none" />
      <path d="M 26 46 Q 72 44 102 48 Q 118 52 128 64" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="2 2" fill="none" />
      {/* Puntos de presión anatómica cero */}
      <circle cx="48" cy="34" r="2.5" fill="#00E575" />
      <circle cx="134" cy="46" r="2.5" fill="#00E575" />
      {/* Insignia de peso pluma */}
      <rect x="66" y="52" width="42" height="18" rx="3" fill="#111" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
      <text x="74" y="65" fill="#00E575" fontSize="8.5" fontWeight="bold" fontFamily="monospace">~32g</text>
      <text x="18" y="16" fill="currentColor" fillOpacity="0.4" fontSize="7" fontFamily="monospace">ERGONOMIC FIT</text>
    </svg>
  )
}

/* ─── Datos de las 4 características técnicas ─── */

const FEATURES = [
  {
    title: 'POLARIZADAS UV400',
    desc: 'Visión nítida y cero reflejos bajo el sol.',
    badge: 'CAT. 3 / UV400',
    Drawing: PolarizedLensDrawing,
    Icon: SunMedium,
  },
  {
    title: 'ACETATO ORGÁNICO',
    desc: 'Pulido a mano durante 72 horas para alto brillo.',
    badge: 'ALTO BRILLO',
    Drawing: AcetateFrameDrawing,
    Icon: Layers,
  },
  {
    title: 'BISAGRAS DE ACERO',
    desc: 'Estructura de 5 dientes sin desajustes.',
    badge: 'REFORZADAS',
    Drawing: HingeDrawing,
    Icon: ShieldCheck,
  },
  {
    title: 'AJUSTE ULTRA-LIGHT',
    desc: 'Ergonomía anatómica que no presiona la nariz.',
    badge: '32 GRAMOS',
    Drawing: ErgonomicsDrawing,
    Icon: Feather,
  },
]

export default function CraftsmanshipSection() {
  return (
    <section id="craftsmanship-section" className="bg-black py-10 md:py-14 border-t border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Cabecera limpia y directa de una sola línea */}
        <div className="flex items-center justify-between pb-4 mb-6">
          <h3 className="font-code text-[10px] tracking-[0.28em] text-white/42 uppercase">
            ESTÁNDARES DE CALIDAD
          </h3>
          <span className="font-code text-[10px] tracking-widest text-white/30 uppercase hidden sm:block">
            MATERIALES & INGENIERÍA ÓPTICA
          </span>
        </div>

        {/* Grid adaptable: en móvil tarjetas horizontales amplias con dibujo a la izquierda; en desktop tarjetas verticales con dibujo arriba */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {FEATURES.map((feat) => {
            const Drawing = feat.Drawing
            const Icon = feat.Icon

            return (
              <div
                key={feat.title}
                className="relative p-4 sm:p-5 rounded-2xl bg-[#060606] hover:bg-[#0c0c0c] border border-white/[0.07] hover:border-white/30 transition-all duration-300 ease-out transform hover:scale-[1.02] sm:hover:scale-[1.05] hover:shadow-[0_15px_35px_rgba(0,0,0,0.9)] hover:z-20 cursor-default flex flex-row sm:flex-col justify-between items-center sm:items-stretch gap-3.5 sm:gap-4 group select-none overflow-hidden"
              >
                {/* Cuadro visual con el esquema técnico / dibujo blueprint */}
                <div className="w-[105px] h-[78px] sm:w-full sm:h-[105px] rounded-xl bg-black/60 border border-white/[0.06] group-hover:border-white/20 p-1 flex items-center justify-center flex-shrink-0 transition-colors duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  <Drawing />
                </div>

                {/* Contenido textual con badge e iconos */}
                <div className="flex-1 min-w-0 flex flex-col justify-between sm:justify-start">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-code text-[8px] sm:text-[8.5px] font-bold tracking-wider text-white/50 group-hover:text-white/80 uppercase bg-white/[0.04] group-hover:bg-white/[0.08] px-2 py-0.5 rounded-sm border border-white/[0.05] group-hover:border-white/20 transition-all duration-300 whitespace-nowrap">
                      {feat.badge}
                    </span>
                    <Icon
                      size={14}
                      strokeWidth={1.8}
                      className="text-white/30 group-hover:text-white transition-colors flex-shrink-0 hidden sm:block"
                    />
                  </div>

                  <h4 className="font-bebas text-lg sm:text-xl text-white tracking-wide uppercase leading-tight mt-1 mb-0.5 group-hover:text-white transition-colors truncate sm:whitespace-normal">
                    {feat.title}
                  </h4>
                  <p className="font-code text-[10px] sm:text-[10.5px] text-white/45 group-hover:text-white/70 leading-snug transition-colors line-clamp-2">
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
