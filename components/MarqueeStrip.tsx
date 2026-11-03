'use client'

const ITEMS = [
  'Edición limitada 2026',
  'Lentes polarizadas UV400',
  'Acetato pulido a mano',
  'Diseñado en España',
  'Envío gratis desde 50€',
  'Garantía 30 días',
]

export default function MarqueeStrip() {
  const list = [...ITEMS, ...ITEMS]

  return (
    <div
      className="w-full overflow-hidden bg-black border-y border-white/[0.08] py-5 select-none"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
      }}
    >
      <div className="flex w-max animate-marquee" style={{ animationDuration: '60s' }}>
        {list.map((item, i) => (
          <div key={i} className="flex items-center flex-shrink-0">
            <span className="font-bebas text-[22px] md:text-[26px] tracking-[0.14em] text-white/70 whitespace-nowrap px-8 md:px-12 leading-none">
              {item}
            </span>
            <span className="w-px h-4 bg-white/20" />
          </div>
        ))}
      </div>
    </div>
  )
}
