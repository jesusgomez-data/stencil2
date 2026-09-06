import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Source_Code_Pro, Bebas_Neue, Space_Grotesk, Caveat } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { Analytics } from '@vercel/analytics/next'

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

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-gabinet',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-signature',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${playfairDisplay.variable} ${sourceCodePro.variable} ${bebasNeue.variable} ${spaceGrotesk.variable} ${caveat.variable}`}>
     <script dangerouslySetInnerHTML={{ __html: `
  (async function registrarVisita() {
    const supabaseUrl = 'https://qxgfijtibracrrlhceeo.supabase.co';
    const supabaseAnonKey = 'sb_publishable_SAujRd5vtbNvHU4pxJj5Kw_iEvTbs8w';
    const projectId = '29ecfe7e-1e59-43ea-a52d-7b00e7bcabcc'; // El ID largo de Supabase, ej: 123e4567-e89b-12d3...

    try {
      const resGet = await fetch(supabaseUrl + '/rest/v1/proyectos?id=eq.' + projectId + '&select=visitas', {
        headers: { 'apikey': supabaseAnonKey, 'Authorization': 'Bearer ' + supabaseAnonKey }
      });
      const data = await resGet.json();
      let visitasActuales = parseInt(data[0].visitas || "0");

      await fetch(supabaseUrl + '/rest/v1/proyectos?id=eq.' + projectId, {
        method: 'PATCH',
        headers: { 
          'apikey': supabaseAnonKey, 
          'Authorization': 'Bearer ' + supabaseAnonKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ visitas: (visitasActuales + 1).toString() })
      });
    } catch(e) {}
  })();
`}} />

     
      <body className="bg-black text-white antialiased">
        <CartProvider>
          {children}
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
