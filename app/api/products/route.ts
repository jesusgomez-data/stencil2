import { NextResponse } from 'next/server'
import { getProductsFromDb, getProductBySlugFromDb } from '@/lib/db'

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
  } catch (error: any) {
    console.error('[API /products] Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Error al obtener productos' },
      { status: 500 }
    )
  }
}
