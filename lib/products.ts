import { GlassesModel, ProductColor, Product } from '@/types'

export const PRODUCTS: Product[] = [
  {
    id: 'classic-blue',
    code: 'S2-001',
    name: 'CLASSIC BLUE',
    price: 29.00,
    gender: 'unisex',
    model: 'wayfarer',
    slug: 'classic-blue',
    description: 'La montura Classic Blue combina nuestra icónica forma Wayfarer con un sutil acabado translúcido. Lentes polarizadas de alta resistencia con protección total UV400. Diseñadas para destacar en cualquier escenario urbano.',
    composition: '100% Acetato premium, bisagras de 5 dientes reforzadas',
    isFeatured: true,
    image: '/images/classic-blue-ref.png',
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
    code: 'S2-002',
    name: 'ONYX BLACK',
    price: 29.00,
    gender: 'unisex',
    model: 'wayfarer',
    slug: 'onyx-black',
    description: 'Minimalismo y sofisticación en su forma más pura. La montura Onyx Black es el clásico atemporal de STENCIL2. Fabricadas con acetato pulido a mano para un acabado brillante inigualable y durabilidad extrema.',
    composition: '100% Acetato orgánico, lentes CR-39 polarizadas',
    isFeatured: true,
    image: '/images/onyx-black-ref.png',
    frameColor: '#1a1a1a',
    colors: [
      { label: 'Negro', hex: '#1a1a1a' },
      { label: 'Havana', hex: '#7A3B20' },
      { label: 'Azul', hex: '#0D2147' }
    ]
  },
  {
    id: 'olive-crystal',
    code: 'S2-003',
    name: 'OLIVE CRYSTAL',
    price: 29.00,
    gender: 'unisex',
    model: 'round',
    slug: 'olive-crystal',
    description: 'Montura redonda de inspiración retro adaptada a la cultura urbana. El color Olive Crystal presenta un tono verde oliva cristalino con varillas de metal ligero. Lentes oscuras polarizadas para una máxima nitidez visual.',
    composition: 'Combinación de acetato inyectado y patillas de acero inoxidable',
    isFeatured: true,
    image: '/images/olive-crystal-ref.png',
    frameColor: '#3A5A28',
    colors: [
      { label: 'Verde', hex: '#3A5A28' },
      { label: 'Havana', hex: '#7A3B20' },
      { label: 'Negro', hex: '#1a1a1a' }
    ]
  },
  {
    id: 'smoke-grey',
    code: 'S2-004',
    name: 'SMOKE GREY',
    price: 29.00,
    gender: 'unisex',
    model: 'sport',
    slug: 'smoke-grey',
    description: 'Diseño deportivo y aerodinámico optimizado para el día a día. Estructura envolvente ultra ligera en gris humo mate que garantiza un ajuste perfecto y cómodo durante horas de uso continuado.',
    composition: 'TR90 (polímero termoplástico de memoria de forma de alta flexibilidad)',
    isFeatured: true,
    image: '/images/smoke-grey-ref.png',
    frameColor: '#555555',
    colors: [
      { label: 'Gris Humo', hex: '#555555' },
      { label: 'Negro', hex: '#1a1a1a' },
      { label: 'Verde', hex: '#1C3B1C' }
    ]
  },
  {
    id: 'aviator-gold',
    code: 'S2-005',
    name: 'AVIATOR GOLD',
    price: 35.00,
    gender: 'men',
    model: 'aviator',
    slug: 'aviator-gold',
    description: 'Nuestra reinterpretación del estilo aviador tradicional. Montura de metal dorado súper fina con doble puente característico de STENCIL2. Lentes tintadas en color verde oscuro G-15 con filtro UV integral.',
    composition: 'Montura de aleación de níquel y cobre con tratamiento anticorrosión dorado',
    isFeatured: false,
    image: '/images/classic-blue-ref.png', // Fallback illustration visual
    frameColor: '#C4822A',
    colors: [
      { label: 'Havana', hex: '#C4822A' },
      { label: 'Negro', hex: '#1a1a1a' }
    ]
  },
  {
    id: 'cat-eye-obsidian',
    code: 'S2-006',
    name: 'CAT-EYE OBSIDIAN',
    price: 35.00,
    gender: 'women',
    model: 'cat-eye',
    slug: 'cat-eye-obsidian',
    description: 'La silueta Cat-Eye Obsidian destaca por sus ángulos pronunciados y su estética de vanguardia urbana. Diseñadas para realzar la mirada, combinan un aire retro chic con líneas completamente contemporáneas.',
    composition: '100% Acetato pulido brillante, alma metálica en patillas',
    isFeatured: false,
    image: '/images/onyx-black-ref.png', // Fallback illustration visual
    frameColor: '#1a1a1a',
    colors: [
      { label: 'Negro', hex: '#1a1a1a' },
      { label: 'Havana', hex: '#7A3B20' }
    ]
  },
  {
    id: 'shield-matrix',
    code: 'S2-007',
    name: 'SHIELD MATRIX',
    price: 39.00,
    gender: 'unisex',
    model: 'shield',
    slug: 'shield-matrix',
    description: 'Máxima expresión del streetwear cyberpunk. Shield Matrix ofrece una lente de pantalla de una sola pieza con una montura minimalista superior. Diseño futurista sin bordes inferiores para una visión periférica total.',
    composition: 'Lente monolítica de policarbonato de alta resistencia a impactos',
    isFeatured: false,
    image: '/images/onyx-black-ref.png', // Fallback illustration visual
    frameColor: '#1a1a1a',
    colors: [
      { label: 'Negro', hex: '#1a1a1a' },
      { label: 'Azul', hex: '#0D2147' }
    ]
  },
  {
    id: 'sport-wrap',
    code: 'S2-008',
    name: 'SPORT WRAP',
    price: 29.00,
    gender: 'men',
    model: 'sport',
    slug: 'sport-wrap',
    description: 'Rendimiento y estilo técnico unidos. Montura ergonómica envolvente diseñada para actividades dinámicas y estilo de vida activo. Almohadillas nasales y varillas de goma antideslizantes para una sujeción superior.',
    composition: 'Montura TR90 flexible, terminales de goma hidrofílica antideslizante',
    isFeatured: false,
    image: '/images/smoke-grey-ref.png', // Fallback illustration visual
    frameColor: '#1C3B1C',
    colors: [
      { label: 'Verde', hex: '#1C3B1C' },
      { label: 'Negro', hex: '#1a1a1a' }
    ]
  }
]
