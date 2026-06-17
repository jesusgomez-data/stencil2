import type { Metadata } from 'next'
import { Playfair_Display, Source_Code_Pro, Bebas_Neue } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-code',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'STENCIL2 | Gafas de Sol — Diseñado para los días de sol',
  description:
    'Descubre la colección de gafas de sol STENCIL2. Diseño urbano, calidad premium. Desde 29€. Envío gratuito a partir de 50€. España.',
  keywords: [
    'gafas de sol',
    'gafas sol hombre',
    'gafas sol mujer',
    'gafas sol baratas España',
    'gafas sol 29 euros',
    'gafas sol streetwear',
    'STENCIL2',
  ],
  openGraph: {
    title: 'STENCIL2 | Gafas de Sol',
    description: 'Diseño urbano, calidad premium. Desde 29€.',
    siteName: 'STENCIL2',
    locale: 'es_ES',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${playfairDisplay.variable} ${sourceCodePro.variable} ${bebasNeue.variable}`}>
      <body className="bg-black text-white antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
