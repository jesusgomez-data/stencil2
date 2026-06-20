import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/stencil2' },
  { label: 'TikTok',    href: 'https://www.tiktok.com/@stencil.2' },
  { label: 'Facebook',  href: 'https://www.facebook.com/stencil2' },
]

const HELP_LINKS = [
  { label: 'Envíos',              href: '/envio'    },
  { label: 'Devoluciones',        href: '/envio'    },
  { label: 'Preguntas frecuentes',href: '/faq'      },
]

const INFO_LINKS = [
  { label: 'Términos y condiciones', href: '/terminos'   },
  { label: 'Política de privacidad', href: '/privacidad' },
]

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/[0.07]">

      {/* Main row */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[280px_1fr_160px_200px] gap-10 lg:gap-8">

          {/* Brand */}
          <div className="flex flex-col items-center text-center space-y-6">
            <Link href="/" className="flex items-center">
              <Image src="/images/logo-grenade-white.png" alt="STENCIL2" width={36} height={58} className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300" />
            </Link>
            <p className="font-code text-[10px] tracking-[0.2em] text-slate-400/70 uppercase">
              JOINING CULTURE
            </p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-code text-[10px] text-white/35 hover:text-white transition-colors tracking-wide"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <p className="font-code text-[11px] tracking-widest text-white uppercase">
              SUSCRÍBETE Y OBTÉN 10% OFF
            </p>
            <div className="flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 bg-white/[0.04] border border-white/15 text-white font-code text-[11px] px-4 py-2.5 placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors min-w-0"
              />
              <button className="bg-white/10 border border-white/20 text-white px-3 py-2.5 hover:bg-white hover:text-black transition-colors flex-shrink-0">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Ayuda */}
          <div className="space-y-3">
            <p className="font-code text-[10px] tracking-widest text-white/30 uppercase">AYUDA</p>
            <nav className="space-y-2">
              {HELP_LINKS.map(({ label, href }) => (
                <div key={label}>
                  <Link href={href} className="font-code text-[10px] text-white/40 hover:text-white transition-colors">
                    {label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Información */}
          <div className="space-y-3">
            <p className="font-code text-[10px] tracking-widest text-white/30 uppercase">INFORMACIÓN</p>
            <nav className="space-y-2">
              {INFO_LINKS.map(({ label, href }) => (
                <div key={label}>
                  <Link href={href} className="font-code text-[10px] text-white/40 hover:text-white transition-colors">
                    {label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06] px-6 lg:px-8 py-4">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-code text-[10px] tracking-widest text-white/20 uppercase">
            © STENCIL2 2026 — TODOS LOS DERECHOS RESERVADOS
          </p>
          <span className="font-code text-[10px] tracking-wider text-white/15 uppercase">
            ESPAÑA
          </span>
        </div>
      </div>
    </footer>
  )
}
