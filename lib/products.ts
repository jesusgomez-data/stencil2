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
    image: '/images/a01.png?v=4',
    gallery: [
      '/images/a01.png?v=4',
      '/images/a02.png?v=4',
      '/images/a03.png?v=4',
    ],
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
    image: '/images/b01.png?v=4',
    gallery: [
      '/images/b01.png?v=4',
      '/images/b02.png?v=4',
      '/images/b03.png?v=4',
    ],
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
    image: '/images/c01.png?v=4',
    gallery: [
      '/images/c01.png?v=4',
      '/images/c02.png?v=4',
      '/images/c03.png?v=4',
      '/images/c04.png?v=4',
      '/images/c05.png?v=4',
    ],
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
    image: '/images/d02.png?v=4',
    gallery: [
      '/images/d02.png?v=4',
      '/images/d03.png?v=4',
      '/images/d04.png?v=4',
      '/images/d05.png?v=4',
      '/images/d06.png?v=4',
      '/images/d07.png?v=4',
    ],
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
    image: '/images/x.png?v=4',
    gallery: [
      '/images/x.png?v=4',
    ],
    frameColor: '#C4822A',
    colors: [
      { label: 'Havana', hex: '#C4822A' },
      { label: 'Negro', hex: '#1a1a1a' }
    ]
  }
]
