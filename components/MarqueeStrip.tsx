'use client'

const ITEMS = [
  'NUEVA COLECCIÓN 2026',
  'S2-001',
  'S2-002',
  'S2-003',
  'DISEÑADO EN ESPAÑA',
  'DESDE 29.00€',
  'ENVÍO GRATIS +50€',
  'VISOR 360°',
  'S2-004',
  'S2-005',
  'S2-006',
  'JOINING CULTURE',
]

export default function MarqueeStrip() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="w-full overflow-hidden border-y border-white/8 bg-white/[0.02] py-3 select-none">
      <div className="flex animate-marquee">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center flex-shrink-0">
            <span className="font-code text-[11px] tracking-[0.22em] text-white/50 uppercase whitespace-nowrap px-2">
              {item}
            </span>
            <span className="text-red-cta text-[8px] mx-2 flex-shrink-0">◆</span>
          </div>
        ))}
      </div>
    </div>
  )
}
