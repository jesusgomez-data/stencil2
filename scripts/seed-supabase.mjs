import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) continue
    const key = line.slice(0, eqIdx).trim()
    let val = line.slice(eqIdx + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) {
      process.env[key] = val
    }
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env.local'))
loadEnvFile(path.resolve(process.cwd(), '.env'))

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const ACTIVE_KEY = SERVICE_KEY || ANON_KEY

if (!SUPABASE_URL || !ACTIVE_KEY) {
  console.error(
    'Error: Faltan variables NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local'
  )
  process.exit(1)
}

if (!SERVICE_KEY) {
  console.warn(
    'Aviso: SUPABASE_SERVICE_ROLE_KEY está vacío en .env.local. Se intentará con ANON_KEY, pero las políticas RLS requieren service_role para insertar en el catálogo.'
  )
}

const supabase = createClient(SUPABASE_URL, ACTIVE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const PRODUCTS = [
  {
    product_key: 'onyx-black',
    letter: 'B',
    code: 'GLT6642-C1',
    name: 'IBZEN -SOIRESNAES',
    subtitle: 'Edición limitada',
    slug: 'ibzen-soires-naes',
    aliases: ['ibsen-soires-naes'],
    price: 49.0,
    compare_at_price: 59.0,
    gender: 'unisex',
    model: 'wayfarer',
    description:
      'Minimalismo y sofisticación en su forma más pura. Fabricadas con acetato pulido a mano para un acabado brillante inigualable y durabilidad extrema.',
    composition: '100% Acetato orgánico, lentes CR-39 polarizadas',
    material: 'Acetato',
    lens: 'No polarizado',
    frame_color: '#C4822A',
    glasses_color: 'Carey Ambar',
    frame_type: 'Carey Negro Ambar',
    logo: 'Dorado',
    colors: [
      { label: 'Carey Ambar', hex: '#C4822A' },
      { label: 'Negro', hex: '#1a1a1a' },
      { label: 'Azul', hex: '#0D2147' },
    ],
    sizes: { varillas: '145 mm', puente: '19 mm', frontal: '52 mm', altura: '50 mm' },
    main_image: '/images/b01.png',
    gallery: [
      '/images/b01.png',
      '/images/b02.png',
      '/images/b03.png',
      '/images/b04.png',
      '/images/b05.png',
      '/images/b06.png',
      '/images/b07.mp4',
    ],
    stock: 60,
    is_featured: true,
    is_active: true,
  },
  {
    product_key: 'classic-blue',
    letter: 'A',
    code: 'GLT6652-C4',
    name: 'FLERSY - SOIRES NAES',
    subtitle: 'Edición limitada',
    slug: 'flersy-soires-naes',
    aliases: ['flersy-naes-soires', 'flersy-soires', 'kso-kc'],
    price: 49.0,
    compare_at_price: 59.0,
    gender: 'unisex',
    model: 'wayfarer',
    description:
      'La montura FLERSY - SOIRES NAES combina nuestra icónica forma Wayfarer. Lentes polarizadas de alta resistencia con protección total UV400. Diseñadas para destacar en cualquier escenario urbano.',
    composition: '100% Acetato premium, bisagras de 5 dientes reforzadas',
    material: 'Acetato',
    lens: 'No polarizado',
    frame_color: '#1a1a1a',
    glasses_color: 'Negro Clasic',
    frame_type: 'Negro',
    logo: 'Dorado',
    colors: [
      { label: 'Negro Clasic', hex: '#1a1a1a' },
      { label: 'Azul', hex: '#0D2147' },
      { label: 'Havana', hex: '#7A3B20' },
      { label: 'Verde', hex: '#1C3B1C' },
    ],
    sizes: { varillas: '145 mm', puente: '26 mm', frontal: '47 mm', altura: '45 mm' },
    main_image: '/images/a01.png',
    gallery: [
      '/images/a01.png',
      '/images/a02.png',
      '/images/a03.png',
      '/images/a04.png',
      '/images/a05.png',
      '/images/a06.png',
    ],
    stock: 80,
    is_featured: true,
    is_active: true,
  },
  {
    product_key: 'olive-crystal',
    letter: 'C',
    code: 'GLT96153S-C4',
    name: 'BLACKEYE - UTK',
    subtitle: 'Edición limitada',
    slug: 'blackeye-utk',
    aliases: ['tropical-smoke'],
    price: 39.0,
    compare_at_price: 47.0,
    gender: 'unisex',
    model: 'round',
    description:
      'Montura redonda de inspiración retro adaptada a la cultura urbana. Lentes oscuras polarizadas para una máxima nitidez visual.',
    composition: 'Combinación de acetato inyectado y patillas de acero inoxidable',
    material: 'Acetato',
    lens: 'No polarizado',
    frame_color: '#7A3B20',
    glasses_color: 'Habana Clasic',
    frame_type: 'Azul ahumado',
    logo: 'Dorado',
    colors: [
      { label: 'Habana Clasic', hex: '#7A3B20' },
      { label: 'Verde', hex: '#3A5A28' },
      { label: 'Negro', hex: '#1a1a1a' },
    ],
    sizes: { varillas: '145 mm', puente: '26 mm', frontal: '47 mm', altura: '45 mm' },
    main_image: '/images/c01.png',
    gallery: [
      '/images/c01.png',
      '/images/c02.png',
      '/images/c03.png',
      '/images/c04.png',
      '/images/c05.png',
      '/images/c6.png',
    ],
    stock: 60,
    is_featured: true,
    is_active: true,
  },
  {
    product_key: 'smoke-grey',
    letter: 'D',
    code: 'GLT6630-C3',
    name: 'RUBEN (RUBEN - SMOKE TROPICAL)',
    subtitle: 'Edición limitada',
    slug: 'ruben-smoke-tropical',
    aliases: ['rubel-smoke-tropical', 'rubel', 'ruben', 'spice-fler', 'smoke-tropical'],
    price: 39.0,
    compare_at_price: 47.0,
    gender: 'unisex',
    model: 'sport',
    description:
      'Diseño geométrico y moderno optimizado para el día a día. Estructura envolvente ultra ligera que garantiza un ajuste perfecto.',
    composition: 'TR90 (polímero termoplástico de memoria de forma de alta flexibilidad)',
    material: 'Acetato',
    lens: 'No polarizado',
    frame_color: '#1a1a1a',
    glasses_color: 'Negro',
    frame_type: 'Negro',
    logo: 'Dorado',
    colors: [
      { label: 'Negro', hex: '#1a1a1a' },
      { label: 'Gris Humo', hex: '#555555' },
      { label: 'Verde', hex: '#1C3B1C' },
    ],
    sizes: { varillas: '145 mm', puente: '21 mm', frontal: '49 mm', altura: '46 mm' },
    main_image: '/images/d01.png',
    gallery: ['/images/d01.png', '/images/d02.png', '/images/d03.png'],
    stock: 60,
    is_featured: true,
    is_active: true,
  },
  {
    product_key: 'aviator-gold',
    letter: 'X',
    code: 'S2-005',
    name: 'AVIATOR GOLD',
    subtitle: null,
    slug: 'aviator-gold',
    aliases: [],
    price: 35.0,
    compare_at_price: 42.0,
    gender: 'unisex',
    model: 'aviator',
    description:
      'Nuestra reinterpretación del estilo aviador tradicional. Montura de metal dorado súper fina con doble puente característico de STENCIL2. Lentes tintadas en color verde oscuro G-15 con filtro UV integral.',
    composition: 'Montura de aleación de níquel y cobre con tratamiento anticorrosión dorado',
    material: null,
    lens: null,
    frame_color: '#C4822A',
    glasses_color: null,
    frame_type: null,
    logo: null,
    colors: [
      { label: 'Havana', hex: '#C4822A' },
      { label: 'Negro', hex: '#1a1a1a' },
    ],
    sizes: {},
    main_image: null,
    gallery: [],
    stock: 0,
    is_featured: false,
    is_active: false,
  },
]

const VARIANTS = [
  { product_key: 'onyx-black', sku: 'GLT6642-C1-AMBAR', color_label: 'Carey Ambar', color_hex: '#C4822A', stock: 20, is_active: true },
  { product_key: 'onyx-black', sku: 'GLT6642-C1-NEGRO', color_label: 'Negro', color_hex: '#1a1a1a', stock: 20, is_active: true },
  { product_key: 'onyx-black', sku: 'GLT6642-C1-AZUL', color_label: 'Azul', color_hex: '#0D2147', stock: 20, is_active: true },

  { product_key: 'classic-blue', sku: 'GLT6652-C4-NEGRO', color_label: 'Negro Clasic', color_hex: '#1a1a1a', stock: 20, is_active: true },
  { product_key: 'classic-blue', sku: 'GLT6652-C4-AZUL', color_label: 'Azul', color_hex: '#0D2147', stock: 20, is_active: true },
  { product_key: 'classic-blue', sku: 'GLT6652-C4-HAVANA', color_label: 'Havana', color_hex: '#7A3B20', stock: 20, is_active: true },
  { product_key: 'classic-blue', sku: 'GLT6652-C4-VERDE', color_label: 'Verde', color_hex: '#1C3B1C', stock: 20, is_active: true },

  { product_key: 'olive-crystal', sku: 'GLT96153S-C4-HABANA', color_label: 'Habana Clasic', color_hex: '#7A3B20', stock: 20, is_active: true },
  { product_key: 'olive-crystal', sku: 'GLT96153S-C4-VERDE', color_label: 'Verde', color_hex: '#3A5A28', stock: 20, is_active: true },
  { product_key: 'olive-crystal', sku: 'GLT96153S-C4-NEGRO', color_label: 'Negro', color_hex: '#1a1a1a', stock: 20, is_active: true },

  { product_key: 'smoke-grey', sku: 'GLT6630-C3-NEGRO', color_label: 'Negro', color_hex: '#1a1a1a', stock: 20, is_active: true },
  { product_key: 'smoke-grey', sku: 'GLT6630-C3-HUMO', color_label: 'Gris Humo', color_hex: '#555555', stock: 20, is_active: true },
  { product_key: 'smoke-grey', sku: 'GLT6630-C3-VERDE', color_label: 'Verde', color_hex: '#1C3B1C', stock: 20, is_active: true },

  { product_key: 'aviator-gold', sku: 'S2-005-HAVANA', color_label: 'Havana', color_hex: '#C4822A', stock: 0, is_active: false },
  { product_key: 'aviator-gold', sku: 'S2-005-NEGRO', color_label: 'Negro', color_hex: '#1a1a1a', stock: 0, is_active: false },
]

const PROMO_CODES = [
  {
    code: 'S2-WELCOME10',
    description: '10% de descuento de bienvenida al suscribirse o canjear 250 puntos',
    discount_type: 'percent',
    discount_value: 10.0,
    min_order_amount: 0,
    free_shipping: false,
    points_cost: 250,
    is_active: true,
  },
  {
    code: 'S2-10OFF',
    description: '10% de descuento adicional canjeable por 100 puntos S2',
    discount_type: 'percent',
    discount_value: 10.0,
    min_order_amount: 0,
    free_shipping: false,
    points_cost: 100,
    is_active: true,
  },
  {
    code: 'S2-FREE',
    description: 'Envío urgente gratuito sin compra mínima (150 puntos S2)',
    discount_type: 'free_shipping',
    discount_value: 0.0,
    min_order_amount: 0,
    free_shipping: true,
    points_cost: 150,
    is_active: true,
  },
  {
    code: 'PRUEBA1',
    description: 'Cupón de prueba para testear pasarela de pago (total 1.00 EUR)',
    discount_type: 'fixed_total',
    discount_value: 1.0,
    min_order_amount: 0,
    free_shipping: true,
    points_cost: 0,
    is_active: true,
  },
]

function failWithGuidance(step, error) {
  const msg = error?.message || String(error)
  const code = error?.code || ''
  console.error(`\n[ERROR en ${step}] ${code ? `(${code}) ` : ''}${msg}`)

  if (
    code === '42P01' ||
    code === 'PGRST205' ||
    msg.includes('Could not find the table') ||
    msg.includes('relation')
  ) {
    console.error(
      '-> Las tablas todavía no existen en Supabase. Ejecuta primero supabase/schema.sql en el SQL Editor de tu proyecto Supabase.'
    )
  } else if (
    code === '42501' ||
    msg.toLowerCase().includes('row-level security') ||
    msg.toLowerCase().includes('permission denied')
  ) {
    console.error(
      '-> Permiso denegado por RLS. Añade SUPABASE_SERVICE_ROLE_KEY en .env.local (Project Settings -> API -> service_role) y vuelve a ejecutar npm run db:seed.'
    )
  }
  process.exit(1)
}

async function runSeed() {
  console.log(`Conectando a Supabase: ${SUPABASE_URL}`)

  const { data: upsertedProducts, error: prodError } = await supabase
    .from('products')
    .upsert(PRODUCTS, { onConflict: 'product_key' })
    .select('id, product_key')

  if (prodError) {
    failWithGuidance('upsert products', prodError)
  }

  const productIdByKey = new Map(
    (upsertedProducts || []).map((row) => [row.product_key, row.id])
  )

  const variantRows = VARIANTS.map(({ product_key, ...rest }) => {
    const product_id = productIdByKey.get(product_key)
    if (!product_id) {
      throw new Error(`No se encontró product_id para product_key=${product_key}`)
    }
    return { product_id, ...rest }
  })

  const { data: upsertedVariants, error: varError } = await supabase
    .from('product_variants')
    .upsert(variantRows, { onConflict: 'sku' })
    .select('id')

  if (varError) {
    failWithGuidance('upsert product_variants', varError)
  }

  const { data: upsertedPromos, error: promoError } = await supabase
    .from('promo_codes')
    .upsert(PROMO_CODES, { onConflict: 'code' })
    .select('code')

  if (promoError) {
    failWithGuidance('upsert promo_codes', promoError)
  }

  console.log(
    `Seed completado: ${upsertedProducts?.length ?? 0} productos, ${upsertedVariants?.length ?? 0} variantes, ${upsertedPromos?.length ?? 0} códigos promocionales.`
  )
}

runSeed().catch((err) => failWithGuidance('seed-supabase', err))
