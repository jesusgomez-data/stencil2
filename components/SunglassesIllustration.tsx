import { SVGProps } from 'react'

type GlassesProps = SVGProps<SVGSVGElement> & { color?: string }

/* S2-001 — Classic Wayfarer */
export function WayfarerSVG({ color = 'white', ...props }: GlassesProps) {
  return (
    <svg viewBox="0 0 400 130" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* lens fills */}
      <rect x="56" y="18" width="116" height="82" rx="7" fill={color} fillOpacity="0.1" />
      <rect x="228" y="18" width="116" height="82" rx="7" fill={color} fillOpacity="0.1" />
      {/* frames */}
      <rect x="55" y="17" width="118" height="84" rx="8" stroke={color} strokeWidth="5.5" />
      <rect x="227" y="17" width="118" height="84" rx="8" stroke={color} strokeWidth="5.5" />
      {/* bridge */}
      <path d="M173 58 Q200 48 227 58" stroke={color} strokeWidth="5" strokeLinecap="round" />
      {/* temples */}
      <path d="M55 46 L18 50" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M345 46 L382 50" stroke={color} strokeWidth="5" strokeLinecap="round" />
      {/* lens reflections */}
      <line x1="70" y1="32" x2="128" y2="32" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.35" />
      <line x1="242" y1="32" x2="300" y2="32" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.35" />
      {/* hinge dots */}
      <circle cx="55" cy="59" r="3.5" fill={color} fillOpacity="0.6" />
      <circle cx="345" cy="59" r="3.5" fill={color} fillOpacity="0.6" />
    </svg>
  )
}

/* S2-002 — Round / Circle */
export function RoundSVG({ color = 'white', ...props }: GlassesProps) {
  return (
    <svg viewBox="0 0 400 130" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* fills */}
      <ellipse cx="128" cy="65" rx="56" ry="52" fill={color} fillOpacity="0.09" />
      <ellipse cx="272" cy="65" rx="56" ry="52" fill={color} fillOpacity="0.09" />
      {/* frames — thin wire */}
      <ellipse cx="128" cy="65" rx="56" ry="52" stroke={color} strokeWidth="4" />
      <ellipse cx="272" cy="65" rx="56" ry="52" stroke={color} strokeWidth="4" />
      {/* bridge */}
      <path d="M184 60 Q200 51 216 60" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      {/* nose pads */}
      <line x1="189" y1="67" x2="184" y2="76" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="211" y1="67" x2="216" y2="76" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* temples */}
      <path d="M73 52 L28 48" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d="M327 52 L372 48" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* reflection arc */}
      <path d="M92 38 Q128 24 164 38" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" fill="none" />
      <path d="M236 38 Q272 24 308 38" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" fill="none" />
    </svg>
  )
}

/* S2-003 — Shield / Mono-Lens */
export function ShieldSVG({ color = 'white', ...props }: GlassesProps) {
  return (
    <svg viewBox="0 0 400 130" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* fill */}
      <path
        d="M48 25 Q44 10 62 10 L338 10 Q356 10 352 25 L346 100 Q344 118 326 118 L74 118 Q56 118 54 100 Z"
        fill={color} fillOpacity="0.1"
      />
      {/* outer frame */}
      <path
        d="M48 25 Q44 10 62 10 L338 10 Q356 10 352 25 L346 100 Q344 118 326 118 L74 118 Q56 118 54 100 Z"
        stroke={color} strokeWidth="6"
      />
      {/* subtle inner nose ridge */}
      <path d="M188 62 Q200 56 212 62" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5" />
      {/* temples */}
      <path d="M48 46 L14 52" stroke={color} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M352 46 L386 52" stroke={color} strokeWidth="5.5" strokeLinecap="round" />
      {/* top highlight */}
      <path d="M70 22 L330 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
    </svg>
  )
}

/* S2-004 — Aviator */
export function AviatorSVG({ color = 'white', ...props }: GlassesProps) {
  return (
    <svg viewBox="0 0 400 140" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* left lens fill */}
      <path
        d="M62 20 L168 20 Q180 20 179 32 Q178 74 150 102 Q136 116 118 116 Q84 116 68 94 Q52 72 58 44 Q60 20 62 20 Z"
        fill={color} fillOpacity="0.1"
      />
      {/* right lens fill */}
      <path
        d="M232 20 L338 20 Q340 20 342 44 Q348 72 332 94 Q316 116 282 116 Q264 116 250 102 Q222 74 221 32 Q220 20 232 20 Z"
        fill={color} fillOpacity="0.1"
      />
      {/* left frame */}
      <path
        d="M62 20 L168 20 Q180 20 179 32 Q178 74 150 102 Q136 116 118 116 Q84 116 68 94 Q52 72 58 44 Q60 20 62 20 Z"
        stroke={color} strokeWidth="4.5"
      />
      {/* right frame */}
      <path
        d="M232 20 L338 20 Q340 20 342 44 Q348 72 332 94 Q316 116 282 116 Q264 116 250 102 Q222 74 221 32 Q220 20 232 20 Z"
        stroke={color} strokeWidth="4.5"
      />
      {/* double bridge */}
      <path d="M179 24 Q200 20 221 24" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M179 32 Q200 28 221 32" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      {/* temples */}
      <path d="M62 26 L22 24" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d="M338 26 L378 24" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* lens top reflection */}
      <line x1="75" y1="30" x2="168" y2="30" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
      <line x1="232" y1="30" x2="325" y2="30" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
    </svg>
  )
}

/* S2-005 — Cat-Eye */
export function CatEyeSVG({ color = 'white', ...props }: GlassesProps) {
  return (
    <svg viewBox="0 0 400 130" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* left lens fill */}
      <path
        d="M60 80 Q52 58 58 38 Q64 18 90 14 L155 10 Q170 8 175 20 L178 55 Q179 68 168 78 Q152 90 120 92 Q82 94 60 80 Z"
        fill={color} fillOpacity="0.1"
      />
      {/* right lens fill */}
      <path
        d="M340 80 Q348 58 342 38 Q336 18 310 14 L245 10 Q230 8 225 20 L222 55 Q221 68 232 78 Q248 90 280 92 Q318 94 340 80 Z"
        fill={color} fillOpacity="0.1"
      />
      {/* left frame */}
      <path
        d="M60 80 Q52 58 58 38 Q64 18 90 14 L155 10 Q170 8 175 20 L178 55 Q179 68 168 78 Q152 90 120 92 Q82 94 60 80 Z"
        stroke={color} strokeWidth="5"
      />
      {/* right frame */}
      <path
        d="M340 80 Q348 58 342 38 Q336 18 310 14 L245 10 Q230 8 225 20 L222 55 Q221 68 232 78 Q248 90 280 92 Q318 94 340 80 Z"
        stroke={color} strokeWidth="5"
      />
      {/* bridge */}
      <path d="M178 37 Q200 30 222 37" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* temples */}
      <path d="M60 55 L20 52" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M340 55 L380 52" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
      {/* upper reflection */}
      <line x1="90" y1="22" x2="158" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
      <line x1="242" y1="16" x2="310" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
    </svg>
  )
}

/* S2-006 — Sport Wrap */
export function SportSVG({ color = 'white', ...props }: GlassesProps) {
  return (
    <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* fill */}
      <path
        d="M30 32 Q22 14 50 12 L350 12 Q378 14 370 32 L368 78 Q368 102 346 108 Q310 118 280 110 L220 100 Q200 96 180 100 L120 110 Q90 118 54 108 Q32 102 32 78 Z"
        fill={color} fillOpacity="0.1"
      />
      {/* frame */}
      <path
        d="M30 32 Q22 14 50 12 L350 12 Q378 14 370 32 L368 78 Q368 102 346 108 Q310 118 280 110 L220 100 Q200 96 180 100 L120 110 Q90 118 54 108 Q32 102 32 78 Z"
        stroke={color} strokeWidth="6"
      />
      {/* inner lens seam */}
      <path d="M185 40 Q200 34 215 40 L218 80 Q200 88 182 80 Z" stroke={color} strokeWidth="2" strokeOpacity="0.4" fill="none" />
      {/* outer frame ridge */}
      <path d="M32 36 Q24 24 50 20 L350 20 Q376 24 368 36" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.35" />
      {/* temples */}
      <path d="M30 44 L4 54" stroke={color} strokeWidth="6" strokeLinecap="round" />
      <path d="M370 44 L396 54" stroke={color} strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}
