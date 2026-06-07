# STENCIL2 — Ecommerce de Gafas de Sol Premium

## Descripción del proyecto
Tienda online de gafas de sol con identidad urbana/streetwear. Ecommerce completo con visor 3D interactivo, pasarela de pagos Stripe, catálogo por género (MEN/WOMEN) y programa de lealtad. Mercado: España. Idioma: Español.

---

## Cliente
- **Marca:** STENCIL2
- **Código interno:** S2
- **Slogan:** Por definir (placeholder: "JOINING CULTURE")
- **Mercado:** España — precios en EUR, IVA incluido
- **Ciudad:** España (tienda online, envío nacional e internacional)

---

## Identidad visual

### Colores
```
--color-black:     #000000   /* Fondo principal, navbar, botones CTA */
--color-white:     #FFFFFF   /* Texto sobre negro, fondo de cards */
--color-red-cta:   #CC0000   /* Botón "Completar pedido", acentos */
--color-gray-light:#F5F5F5   /* Fondos secundarios, footer */
--color-gray-mid:  #888888   /* Textos secundarios, modelo/código */
--color-blue-acc:  #4A90D9   /* Acento comunidad/newsletter (azul STENCIL2) */
```

### Tipografía
```
Font 1 (Display/Headings): Minion Variable Concept — Semibolt
  → Uso: nombres de producto "Gafas de sol", títulos de sección, precio
  → Google Fonts alternativa: "Playfair Display" weight 600 (si Minion no está disponible)

Font 2 (Body/Descriptivo): Source Code Variable — Light
  → Uso: modelo, código S2-001, subtextos, descripciones técnicas
  → Google Fonts: "Source Code Pro" weight 300

Font 3 (UI/Interfaz): Minion Variable Concept — Medium
  → Uso: precios destacados, labels, navegación
```

### Logo
- Archivo: `/public/images/logo.png` (granada con S2 dentro + texto STENCIL2)
- Versión negra sobre blanco y blanca sobre negro
- Tamaño en navbar: 40x40px (icono) o 120px ancho (versión texto)
- Nunca distorsionar ni aplicar filtros de color

### Estética general
- Streetwear premium — limpio, urbano, contrastado
- Fotografía editorial: modelos con gafas en entornos urbanos/nocturnos
- NO usar gradientes decorativos
- Botones: bordes cuadrados o ligeramente redondeados (border-radius: 2-4px)
- Todo en MAYÚSCULAS para CTAs y navegación principal

---

## Stack tecnológico

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v3
- **3D:** React Three Fiber + @react-three/drei
- **Animaciones:** Framer Motion
- **Iconos:** Lucide React

### Backend / Base de datos
- **BaaS:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email + Google OAuth)
- **Storage:** Supabase Storage (imágenes de productos, modelos 3D)
- **API Routes:** Next.js API Routes

### Pagos
- **Pasarela principal:** Stripe (tarjeta de crédito/débito)
- **Métodos adicionales:** PayPal (Stripe integration), Compra ahora/paga después
- **Moneda:** EUR
- **IVA:** 21% incluido en precio mostrado

### Email
- **Proveedor:** Resend (transaccional)
- **Templates:** React Email
- **Emails a implementar:**
  1. Confirmación de pedido
  2. Pedido enviado + tracking
  3. Bienvenida al programa de lealtad
  4. Recuperación de carrito abandonado
  5. Newsletter de la comunidad STENCIL2

### Deploy / Infraestructura
- **Hosting:** Vercel (producción)
- **Dominio:** [PENDIENTE — confirmar con cliente]
- **CDN:** Vercel Edge Network (imágenes optimizadas con next/image)
- **Variables de entorno:** Ver `.env.example`

---

## Estructura de páginas

```
/ (Home)
├── Hero — imagen editorial + CTA "TIENDA DE GAFAS"
├── Visor 3D — modelo interactivo destacado
├── Catálogo preview — 6 productos destacados
├── Comunidad STENCIL2 — newsletter signup
└── Footer

/tienda (Catálogo general)
/tienda/hombre (MEN)
/tienda/mujer (WOMEN)
/producto/[slug] (Página de producto individual)
/carrito (Cesta)
/checkout (Pago)
/cuenta (Área de cliente)
/cuenta/pedidos
/cuenta/favoritos
/admin (Panel de administración — ruta protegida)
/admin/productos
/admin/pedidos
```

---

## Base de datos — Esquema Supabase

### Tabla: `products`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
name          text NOT NULL                    -- "Gafas de sol"
model_name    text NOT NULL                    -- "S2-001", "S2-002"...
slug          text UNIQUE NOT NULL             -- "gafas-sol-s2-001"
price         decimal(10,2) NOT NULL           -- 29.00
gender        text CHECK (gender IN ('men', 'women', 'unisex'))
stock         integer DEFAULT 0
description   text
composition   text                             -- "100% Acetato"
images        text[]                           -- array de URLs Supabase Storage
model_3d_url  text                             -- URL del archivo .glb para visor 3D
is_featured   boolean DEFAULT false
is_active     boolean DEFAULT true
created_at    timestamptz DEFAULT now()
```

### Tabla: `orders`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES auth.users(id)
stripe_id       text UNIQUE                    -- payment_intent id
status          text DEFAULT 'pending'         -- pending/paid/shipped/delivered/cancelled
items           jsonb                          -- [{product_id, qty, price}]
subtotal        decimal(10,2)
promo_discount  decimal(10,2) DEFAULT 0
shipping        decimal(10,2) DEFAULT 0
total           decimal(10,2)
promo_code      text
shipping_address jsonb
created_at      timestamptz DEFAULT now()
```

### Tabla: `profiles`
```sql
id          uuid PRIMARY KEY REFERENCES auth.users(id)
email       text
full_name   text
loyalty_points integer DEFAULT 0
created_at  timestamptz DEFAULT now()
```

### Tabla: `promo_codes`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
code        text UNIQUE NOT NULL               -- "S2-005252"
discount    decimal(5,2)                       -- porcentaje o fijo
type        text CHECK (type IN ('percent','fixed'))
max_uses    integer
used_count  integer DEFAULT 0
expires_at  timestamptz
is_active   boolean DEFAULT true
```

---

## Componentes clave

### 1. Visor 3D (`/components/Viewer3D.tsx`)
- Usar `@react-three/fiber` + `@react-three/drei`
- Cargar modelo `.glb` desde Supabase Storage
- Controles: OrbitControls (drag=rotar, scroll=zoom)
- Iluminación: HDR environment + directional lights
- Vista desde todos los ángulos: frontal, lateral, superior, logo patilla
- Selector de color: cambiar material del frame en tiempo real

### 2. Navbar (`/components/Navbar.tsx`)
- Logo centrado en mobile, izquierda en desktop
- Iconos: carrito (con contador), cuenta, búsqueda, menú hamburguesa
- Sticky con backdrop blur al hacer scroll
- Menú: HOME | MEN | WOMEN

### 3. ProductCard (`/components/ProductCard.tsx`)
- Imagen producto con hover (segunda imagen)
- Nombre: "Gafas de sol" (Minion Semibolt)
- Modelo: "S2-001" (Source Code Light)
- Precio: "29.00" (Minion Medium)

### 4. Cart (`/components/Cart.tsx`)
- Drawer lateral en mobile
- Items con cantidad (selector 1-10)
- Código promocional expandible (formato: S2-XXXXXX)
- Subtotal, promoción, envío, total (IVA incluido)
- CTA: "COMPLETAR PEDIDO" (botón negro)
- Info: envío gratuito a partir de 50€, devoluciones gratuitas

### 5. Footer (`/components/Footer.tsx`)
- Links: HOME | MEN | WOMEN
- Comunidad STENCIL2: newsletter email input
- Redes: Facebook, X (Twitter), Instagram, TikTok, YouTube
- Ciudad: ESPAÑA
- Copyright: ©2026 STENCIL2 — TODO LOS DERECHOS RESERVADOS
- Logo en footer (versión pequeña)

---

## Reglas de negocio

### Envío
- Envío gratuito a partir de 50€
- Opciones: estándar y urgente
- Envío internacional disponible

### Devoluciones
- 14 días para devoluciones
- Devoluciones gratuitas (excepto productos personalizados)

### Programa de lealtad STENCIL2
- Signup por email
- Descuento 10% en primer pedido al suscribirse
- Puntos acumulables por compra
- Notificaciones: noticias, promociones, productos y ofertas

### Códigos promocionales
- Formato: `S2-XXXXXX` (ej: S2-005252)
- Aplicable en carrito antes de checkout

### Categorías
- MEN: gafas hombre
- WOMEN: gafas mujer
- Sin categoría unisex visible (usar gender='unisex' internamente)

---

## SEO

### Keywords principales
- "gafas de sol", "gafas sol hombre", "gafas sol mujer"
- "gafas sol baratas España", "gafas sol 29 euros"
- "gafas sol streetwear", "gafas sol urbanas"
- "STENCIL2", "stencil2 gafas"

### Metadatos por página
```tsx
// Home
title: "STENCIL2 | Gafas de Sol — Diseñado para los días de sol"
description: "Descubre la colección de gafas de sol STENCIL2. Diseño urbano, calidad premium. Desde 29€. Envío gratuito a partir de 50€. España."

// Producto
title: "[Nombre modelo] | STENCIL2 Gafas de Sol"
description: "Gafas de sol [modelo] de STENCIL2. 100% Acetato. 29€. Envío rápido a toda España."
```

---

## Variables de entorno (`.env.local`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend (email)
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=STENCIL2
```

---

## Comandos del proyecto

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build producción
npm run build

# Lint
npm run lint

# Preview producción local
npm run start
```

---

## Convenciones de código

- Componentes en PascalCase: `ProductCard.tsx`
- Hooks en camelCase con prefijo `use`: `useCart.ts`
- Páginas en kebab-case: `app/tienda/hombre/page.tsx`
- Types/interfaces en `types/` folder
- Helpers/utils en `lib/` folder
- Componentes UI reutilizables en `components/ui/`
- Componentes de negocio en `components/`

---

## Estado actual del proyecto

- [x] CLAUDE.md creado
- [ ] Repositorio GitHub inicializado
- [ ] Next.js scaffolding
- [ ] Supabase configurado
- [ ] Stripe configurado
- [ ] Componentes base
- [ ] Visor 3D
- [ ] Ecommerce completo
- [ ] Deploy en Vercel

---

## Notas importantes para Claude Code

1. **Siempre** usar `Source Code Variable` para textos tipo modelo/código y `Minion Variable Concept` para headings. Si no están disponibles como web fonts, cargar desde Google Fonts los equivalentes indicados arriba.
2. **Nunca** usar gradientes decorativos — la marca es flat, blanco/negro con rojo solo en CTA.
3. Los botones CTA principales van en **negro con texto blanco en mayúsculas**. Solo "COMPLETAR PEDIDO" va en rojo.
4. El logo es una **imagen**, nunca recrear con SVG/texto.
5. Precios **siempre** con formato `29.00` (dos decimales, sin símbolo € al lado izquierdo).
6. **IVA siempre incluido** en precio mostrado — nunca mostrar precio sin IVA al usuario final.
7. El visor 3D es la pieza estrella del proyecto — debe funcionar perfectamente en mobile.
8. Categorías de navegación: solo HOME, MEN, WOMEN — en mayúsculas siempre.
