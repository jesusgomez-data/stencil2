import { NextResponse } from 'next/server'
import { getProductsFromDb, getProductBySlugFromDb } from '@/lib/db'

// Depende de los parámetros de la URL: siempre se renderiza bajo demanda
export const dynamic = 'force-dynamic'
// Sin caché de datos: los cambios de precio en Supabase deben verse al instante
export const fetchCache = 'force-no-store'
export const revalidate = 0

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    const gender = searchParams.get('gender')
    const featured = searchParams.get('featured')

    if (slug) {
      const { product, source } = await getProductBySlugFromDb(slug)
      if (!product) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
      }
      return NextResponse.json({ product, source })
    }

    const { products, source } = await getProductsFromDb()
    let filtered = products

    if (gender && ['men', 'women', 'unisex'].includes(gender)) {
      filtered = filtered.filter((p) => p.gender === gender || p.gender === 'unisex')
    }

    if (featured === 'true') {
      filtered = filtered.filter((p) => p.isFeatured)
    }

    return NextResponse.json({
      products: filtered,
      count: filtered.length,
      source,
    })
  } catch (error) {
    console.error('[API /products] Error:', error)
    return NextResponse.json(
      { error: 'No se pudieron obtener los productos en este momento' },
      { status: 500 }
    )
  }
}
