import { GlassesModel, ProductColor, Product } from '@/types'
import { getModelGallery, getModelMainImage } from '@/lib/imageCatalog'

/**
 * Catálogo de productos STENCIL2.
 *
 * Cada producto se identifica por una LETRA (modelo de gafa). Las imágenes se
 * asignan AUTOMÁTICAMENTE desde el catálogo de imágenes (image-catalog.json):
 *   - A → CLASSIC BLUE   (a01, a02, a03...)
 *   - B → ONYX BLACK     (b01, b02, b03...)
 *   - C → OLIVE CRYSTAL  (c01, c02, c03...)
 *   - D → SMOKE GREY     (d01, d02, d03...)
 *   - X → AVIATOR GOLD   (x01, x02, x03...)
 *
 * Para añadir tomas nuevas basta con colocar los archivos en public/images/
 * con la nomenclatura LETRA+NÚMERO y regenerar el catálogo:
 *   npm run images:build
 */

interface ProductSeed {
  id: string
  letter: string
  code: string
  name: string
  price: number
  gender: 'men' | 'women' | 'unisex'
  model: GlassesModel
  slug: string
  description: string
  composition: string
  isFeatured?: boolean
  frameColor: string
  colors: ProductColor[]
}

const SEEDS: ProductSeed[] = [
  {
    id: 'classic-blue',
    letter: 'A',
    code: 'S2-001',
    name: 'CLASSIC BLUE',
    price: 29.00,
    gender: 'unisex',
    model: 'wayfarer',
    slug: 'classic-blue',
    description: 'La montura Classic Blue combina nuestra icónica forma Wayfarer con un sutil acabado translúcido. Lentes polarizadas de alta resistencia con protección total UV400. Diseñadas para destacar en cualquier escenario urbano.',
    composition: '100% Acetato premium, bisagras de 5 dientes reforzadas',
    isFeatured: true,
    frameColor: '#0D2147',
    colors: [
      { label: 'Azul', hex: '#0D2147' },
      { label: 'Negro', hex: '#1a1a1a' },
      { label: 'Havana', hex: '#7A3B20' },
      { label: 'Verde', hex: '#1C3B1C' }
    ]
  },
  {
    id: 'onyx-black',
    letter: 'B',
    code: 'S2-002',
    name: 'ONYX BLACK',
    price: 29.00,
    gender: 'unisex',
    model: 'wayfarer',
    slug: 'onyx-black',
    description: 'Minimalismo y sofisticación en su forma más pura. La montura Onyx Black es el clásico atemporal de STENCIL2. Fabricadas con acetato pulido a mano para un acabado brillante inigualable y durabilidad extrema.',
    composition: '100% Acetato orgánico, lentes CR-39 polarizadas',
    isFeatured: true,
    frameColor: '#1a1a1a',
    colors: [
      { label: 'Negro', hex: '#1a1a1a' },
      { label: 'Havana', hex: '#7A3B20' },
      { label: 'Azul', hex: '#0D2147' }
    ]
  },
  {
    id: 'olive-crystal',
    letter: 'C',
    code: 'S2-003',
    name: 'OLIVE CRYSTAL',
    price: 29.00,
    gender: 'unisex',
    model: 'round',
    slug: 'olive-crystal',
    description: 'Montura redonda de inspiración retro adaptada a la cultura urbana. El color Olive Crystal presenta un tono verde oliva cristalino con varillas de metal ligero. Lentes oscuras polarizadas para una máxima nitidez visual.',
    composition: 'Combinación de acetato inyectado y patillas de acero inoxidable',
    isFeatured: true,
    frameColor: '#3A5A28',
    colors: [
      { label: 'Verde', hex: '#3A5A28' },
      { label: 'Havana', hex: '#7A3B20' },
      { label: 'Negro', hex: '#1a1a1a' }
    ]
  },
  {
    id: 'smoke-grey',
    letter: 'D',
    code: 'S2-004',
    name: 'SMOKE GREY',
    price: 29.00,
    gender: 'unisex',
    model: 'sport',
    slug: 'smoke-grey',
    description: 'Diseño deportivo y aerodinámico optimizado para el día a día. Estructura envolvente ultra ligera en gris humo mate que garantiza un ajuste perfecto y cómodo durante horas de uso continuado.',
    composition: 'TR90 (polímero termoplástico de memoria de forma de alta flexibilidad)',
    isFeatured: true,
    frameColor: '#555555',
    colors: [
      { label: 'Gris Humo', hex: '#555555' },
      { label: 'Negro', hex: '#1a1a1a' },
      { label: 'Verde', hex: '#1C3B1C' }
    ]
  },
  {
    id: 'aviator-gold',
    letter: 'X',
    code: 'S2-005',
    name: 'AVIATOR GOLD',
    price: 35.00,
    gender: 'men',
    model: 'aviator',
    slug: 'aviator-gold',
    description: 'Nuestra reinterpretación del estilo aviador tradicional. Montura de metal dorado súper fina con doble puente característico de STENCIL2. Lentes tintadas en color verde oscuro G-15 con filtro UV integral.',
    composition: 'Montura de aleación de níquel y cobre con tratamiento anticorrosión dorado',
    isFeatured: false,
    frameColor: '#C4822A',
    colors: [
      { label: 'Havana', hex: '#C4822A' },
      { label: 'Negro', hex: '#1a1a1a' }
    ]
  }
]

function buildProduct(seed: ProductSeed): Product {
  const gallery = getModelGallery(seed.letter)
  return {
    id: seed.id,
    letter: seed.letter,
    code: seed.code,
    name: seed.name,
    price: seed.price,
    gender: seed.gender,
    model: seed.model,
    slug: seed.slug,
    description: seed.description,
    composition: seed.composition,
    isFeatured: seed.isFeatured,
    image: getModelMainImage(seed.letter),
    gallery,
    frameColor: seed.frameColor,
    colors: seed.colors
  }
}

export const PRODUCTS: Product[] = SEEDS.map(buildProduct)

/** Busca un producto por su slug. */
export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

/** Devuelve los productos destacados para la home. */
export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isFeatured)
}
