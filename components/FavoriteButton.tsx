'use client'

import { useState, useEffect, useCallback } from 'react'
import { Heart } from 'lucide-react'

const STORAGE_KEY = 'stencil2:favorites'

export interface FavoriteButtonProps {
  slug: string
  className?: string
}

function loadFavorites(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

/**
 * Botón de "me gusta" (corazón) con persistencia local.
 * El like se guarda por slug en localStorage del navegador.
 */
export default function FavoriteButton({ slug, className = '' }: FavoriteButtonProps) {
  const [liked, setLiked] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    setLiked(loadFavorites().includes(slug))
  }, [slug])

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setLiked((prev) => {
        const favs = loadFavorites()
        const next = prev ? favs.filter((s) => s !== slug) : [...favs, slug]
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          // almacenamiento no disponible
        }
        return !prev
      })
    },
    [slug]
  )

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={liked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      aria-pressed={liked}
      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all active:scale-90 ${
        liked
          ? 'border-[#CC0000]/60 bg-[#CC0000]/15 text-[#CC0000]'
          : 'border-white/[0.12] bg-black/30 text-white/45 hover:text-white hover:border-white/40'
      } ${className}`}
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <Heart
        size={11}
        strokeWidth={2}
        className={liked ? 'fill-current' : ''}
      />
    </button>
  )
}
