'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Share2, Check, Link2, Mail, MessageCircle, Facebook, Instagram, Music2, Twitter,
  type LucideIcon,
} from 'lucide-react'

export interface ShareButtonProps {
  title: string
  url: string
  className?: string
}

interface ShareOption {
  label: string
  icon: LucideIcon
  href?: string
  copy?: boolean
}

/**
 * Botón de compartir premium.
 *
 * - Si el navegador soporta el Web Share API (navigator.share), abre el sheet
 *   nativo del sistema: el usuario puede compartir a WhatsApp, Instagram,
 *   Facebook, TikTok, correo o cualquier app instalada.
 * - Si no está disponible, despliega un menú minimalista con los enlaces
 *   directos a cada plataforma + "copiar enlace".
 */
export default function ShareButton({ title, url, className = '' }: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const options: ShareOption[] = [
    { label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'Instagram', icon: Instagram, copy: true },
    { label: 'TikTok', icon: Music2, copy: true },
    { label: 'X', icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { label: 'Correo', icon: Mail, href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ]

  const close = useCallback(() => setOpen(false), [])

  // Cierra el menú al hacer clic fuera o con ESC
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Web Share API nativo: sheet del sistema (WhatsApp, Instagram, etc.)
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text: title, url })
        return
      } catch {
        // usuario canceló o falló → mostramos el menú manual
      }
    }
    setOpen(true)
  }

  const handleCopy = async (e: React.MouseEvent, opt?: ShareOption) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
      if (opt?.copy) close()
    } catch {
      // clipboard no disponible
    }
  }

  return (
    <div ref={ref} className={`relative flex-shrink-0 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Compartir ${title}`}
        title="Compartir"
        className="w-7 h-7 rounded-full border border-white/[0.09] text-white/28 hover:text-white hover:border-white/52 hover:bg-white/[0.06] flex items-center justify-center transition-all active:scale-90"
      >
        {copied ? <Check size={11} strokeWidth={2.2} /> : <Share2 size={11} strokeWidth={2.2} />}
      </button>

      {/* Menú de plataformas */}
      {open && (
        <div
          className="absolute bottom-9 right-0 z-[80] w-[210px] rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl shadow-black/60 p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-code text-[7px] tracking-[0.3em] text-white/30 uppercase px-3 pt-1.5 pb-2">
            COMPARTIR
          </p>
          <div className="grid grid-cols-3 gap-1">
            {options.map((opt) => {
              const Icon = opt.icon
              const sharedClasses =
                'flex flex-col items-center gap-1.5 px-1 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors'
              // Opciones con enlace directo (WhatsApp, Facebook, X, Correo)
              if (opt.href) {
                return (
                  <a
                    key={opt.label}
                    href={opt.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={sharedClasses}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon size={15} strokeWidth={1.8} />
                    <span className="font-code text-[7px] tracking-wider uppercase">{opt.label}</span>
                  </a>
                )
              }
              // Opciones que copian el enlace (Instagram, TikTok — sin deep link público)
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={(e) => handleCopy(e, opt)}
                  className={sharedClasses}
                >
                  <Icon size={15} strokeWidth={1.8} />
                  <span className="font-code text-[7px] tracking-wider uppercase">{opt.label}</span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={(e) => handleCopy(e)}
            className="w-full mt-1.5 flex items-center justify-center gap-2 border-t border-white/[0.06] pt-2.5 pb-1 text-white/50 hover:text-white transition-colors font-code text-[8px] tracking-[0.2em] uppercase"
          >
            {copied ? <Check size={11} /> : <Link2 size={11} />}
            {copied ? 'ENLACE COPIADO' : 'COPIAR ENLACE'}
          </button>
        </div>
      )}
    </div>
  )
}
