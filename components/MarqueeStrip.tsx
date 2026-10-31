'use client'

const ITEMS = [
  'EDICIÓN LIMITADA 2026',
  'LENTES POLARIZADAS UV400',
  'ACETATO PULIDO A MANO',
  'DISEÑADO EN ESPAÑA',
  'BISAGRAS REFORZADAS DE 5 DIENTES',
  'ENVÍO GRATIS Y RÁPIDO',
  'GARANTÍA DE 30 DÍAS',
  'VISOR INTERACTIVO 360°',
]

export default function MarqueeStrip() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="w-full overflow-hidden border-y border-white/[0.06] bg-[#050505] py-3.5 select-none">
      <div className="flex animate-marquee">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center flex-shrink-0">
            <span className="font-code text-[10px] tracking-[0.24em] text-white/50 uppercase whitespace-nowrap px-3">
              {item}
            </span>
            <span className="text-white/20 text-[7px] mx-1 flex-shrink-0">◆</span>
          </div>
        ))}
      </div>
    </div>
  )
}
