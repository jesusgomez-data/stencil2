import { GlassesModel, ProductColor, Product } from '@/types'
import { getModelGallery, getModelMainImage } from '@/lib/imageCatalog'

/**
 * Catálogo de productos STENCIL2.
 *
 * Cada producto se identifica por una LETRA (modelo de gafa). Las imágenes se
 * asignan AUTOMÁTICAMENTE desde el catálogo de imágenes (image-catalog.json):
 *   - A → KSO-KC  (a01, a02, a03...)
 *   - B → IBZEN-SOIRES NAES    (b01, b02, b03...)
 *   - C → MAGMAFLOW  (c01, c02, c03...)
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
  logo?: string
  material?: string
  lens?: string
  sizes?: {
    varillas: string
    puente: string
    frontal: string
    altura: string
  }
}

const SEEDS: ProductSeed[] = [
  {
    id: 'classic-blue',
    letter: 'A',
    code: 'GLT6652-C4',
    name: 'Kso -KC',
    price: 29.00,
    gender: 'unisex',
    model: 'wayfarer',
    slug: 'kso-kc',
    description: 'La montura Kso -KC combina nuestra icónica forma Wayfarer. Lentes polarizadas de alta resistencia con protección total UV400. Diseñadas para destacar en cualquier escenario urbano.',
    composition: '100% Acetato premium, bisagras de 5 dientes reforzadas',
    isFeatured: true,
    frameColor: '#1a1a1a',
    colors: [
      { label: 'Negro Clasic', hex: '#1a1a1a' },
      { label: 'Azul', hex: '#0D2147' },
      { label: 'Havana', hex: '#7A3B20' },
      { label: 'Verde', hex: '#1C3B1C' }
    ],
    logo: 'Dorado',
    material: 'Acetato',
    lens: 'Polarized TAC 1.1 / No polarizado',
    sizes: { varillas: '145 mm', puente: '26 mm', frontal: '47 mm', altura: '45 mm' }
  },
  {
    id: 'onyx-black',
    letter: 'B',
    code: 'GLT6642-C1',
    name: 'Ibsen Soires Naes',
    price: 29.00,
    gender: 'unisex',
    model: 'wayfarer',
    slug: 'ibsen-soires-naes',
    description: 'Minimalismo y sofisticación en su forma más pura. Fabricadas con acetato pulido a mano para un acabado brillante inigualable y durabilidad extrema.',
    composition: '100% Acetato orgánico, lentes CR-39 polarizadas',
    isFeatured: true,
    frameColor: '#C4822A',
    colors: [
      { label: 'Carey Ambar', hex: '#C4822A' },
      { label: 'Negro', hex: '#1a1a1a' },
      { label: 'Azul', hex: '#0D2147' }
    ],
    logo: 'Dorado',
    material: 'Acetato',
    lens: 'Polarized TAC 1.1 / No polarizado',
    sizes: { varillas: '145 mm', puente: '19 mm', frontal: '52 mm', altura: '50 mm' }
  },
  {
    id: 'olive-crystal',
    letter: 'C',
    code: 'GLT96153S-C4',
    name: 'Tropical Smoke',
    price: 29.00,
    gender: 'unisex',
    model: 'round',
    slug: 'tropical-smoke',
    description: 'Montura redonda de inspiración retro adaptada a la cultura urbana. Lentes oscuras polarizadas para una máxima nitidez visual.',
    composition: 'Combinación de acetato inyectado y patillas de acero inoxidable',
    isFeatured: true,
    frameColor: '#7A3B20',
    colors: [
      { label: 'Habana Clasic', hex: '#7A3B20' },
      { label: 'Verde', hex: '#3A5A28' },
      { label: 'Negro', hex: '#1a1a1a' }
    ],
    logo: 'Dorado',
    material: 'Acetato',
    lens: 'Polarized TAC 1.1 / No polarizado',
    sizes: { varillas: '145 mm', puente: '26 mm', frontal: '47 mm', altura: '45 mm' }
  },
  {
    id: 'smoke-grey',
    letter: 'D',
    code: 'GLT6630-C3',
    name: 'Spice Fler',
    price: 29.00,
    gender: 'unisex',
    model: 'sport',
    slug: 'spice-fler',
    description: 'Diseño geométrico y moderno optimizado para el día a día. Estructura envolvente ultra ligera que garantiza un ajuste perfecto.',
    composition: 'TR90 (polímero termoplástico de memoria de forma de alta flexibilidad)',
    isFeatured: true,
    frameColor: '#1a1a1a',
    colors: [
      { label: 'Negro', hex: '#1a1a1a' },
      { label: 'Gris Humo', hex: '#555555' },
      { label: 'Verde', hex: '#1C3B1C' }
    ],
    logo: 'Dorado',
    material: 'Acetato',
    lens: 'Polarized TAC 1.1 / No polarizado',
    sizes: { varillas: '145 mm', puente: '21 mm', frontal: '49 mm', altura: '46 mm' }
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
    colors: seed.colors,
    logo: seed.logo,
    material: seed.material,
    lens: seed.lens,
    sizes: seed.sizes
  }
}

export const PRODUCTS: Product[] = SEEDS
  .filter((seed) => seed.slug !== 'aviator-gold')
  .map(buildProduct)

/** Busca un producto por su slug. */
export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

/** Devuelve los productos destacados para la home. */
export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isFeatured)
}
