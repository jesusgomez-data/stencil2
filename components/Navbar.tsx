'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'

const NAV_LINKS = [
  { label: 'INICIO',        href: '/' },
  { label: 'COLECCIONES',   href: '/tienda' },
  { label: 'SOBRE NOSOTROS',href: '/nosotros' },
  { label: 'CONTACTO',      href: '/contacto' },
]

// Custom Minimal Luxury SVG Icons
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-[17px] h-[17px] transition-transform duration-300" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-[17px] h-[17px] transition-transform duration-300" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const ShoppingBagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-[17px] h-[17px] transition-transform duration-300" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function Navbar() {
  const { cartItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [menuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/[0.05]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="relative flex items-center justify-between h-20">

          {/* Logo — LEFT */}
          <Link href="/" aria-label="STENCIL2 — Inicio" className="flex items-center flex-shrink-0 z-50">
            <Image
              src="/images/logo-grenade-white.png"
              alt="STENCIL2"
              width={48}
              height={78}
              className="h-12 md:h-14 w-auto object-contain hover:scale-105 transition-transform duration-300"
              priority
            />
          </Link>

          {/* Nav links — CENTRE (desktop) */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-9">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = label === 'INICIO' ? pathname === '/' : pathname.startsWith(href) && href !== '/'
              return (
                <Link
                  key={label}
                  href={href}
                  className={`font-code text-[10px] tracking-[0.28em] transition-all duration-300 uppercase whitespace-nowrap relative py-1.5 ${
                    isActive
                      ? 'text-white font-medium'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1.2px] bg-white"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Icons — RIGHT */}
          <div className="flex items-center gap-4.5 z-50">
            <button aria-label="Buscar" className="text-white/40 hover:text-white hover:scale-105 transition-all p-1.5 group">
              <SearchIcon />
            </button>

            <Link href="/cuenta" aria-label="Mi cuenta" className="text-white/40 hover:text-white hover:scale-105 transition-all p-1.5 group">
              <UserIcon />
            </Link>

            <Link
              href="/carrito"
              aria-label={`Carrito (${totalItems} artículos)`}
              className="relative text-white/40 hover:text-white hover:scale-105 transition-all p-1.5 group"
            >
              <ShoppingBagIcon />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-white text-black text-[7px] font-code w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none scale-90 font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hamburguesa — mobile only */}
            <button
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white/40 hover:text-white transition-colors p-1.5"
            >
              {menuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú mobile full screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-black flex flex-col justify-between pt-28 pb-12 px-8 lg:hidden"
          >
            {/* Mobile navigation links */}
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map(({ label, href }, idx) => {
                const isActive = label === 'INICIO' ? pathname === '/' : pathname.startsWith(href) && href !== '/'
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 + 0.1 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`font-code text-sm tracking-[0.22em] uppercase block py-2 ${
                        isActive ? 'text-white font-medium' : 'text-white/40'
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Footer info in mobile menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="border-t border-white/[0.08] pt-8 flex flex-col gap-4"
            >
              <div className="flex items-center">
                <Image src="/images/logo-grenade-white.png" alt="STENCIL2" width={28} height={44} className="h-10 w-auto object-contain" />
              </div>
              <p className="font-code text-[9px] tracking-[0.2em] text-white/30 uppercase">
                © STENCIL2 — JOINING CULTURE
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

