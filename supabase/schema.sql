-- ============================================================================
-- STENCIL2 — Esquema Completo de Base de Datos (PostgreSQL / Supabase)
-- Mercado: España (EUR, IVA 21% incluido)
-- ============================================================================

-- 1. Extensiones y funciones auxiliares
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- 2. Tabla: public.products (Catálogo de gafas STENCIL2)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_key text UNIQUE NOT NULL,
  letter text NOT NULL,
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  subtitle text,
  slug text UNIQUE NOT NULL,
  aliases text[] NOT NULL DEFAULT '{}',
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price numeric(10,2),
  gender text NOT NULL DEFAULT 'unisex' CHECK (gender IN ('men', 'women', 'unisex')),
  model text NOT NULL CHECK (model IN ('wayfarer', 'round', 'shield', 'aviator', 'cat-eye', 'sport')),
  description text,
  composition text,
  material text,
  lens text,
  frame_color text,
  glasses_color text,
  frame_type text,
  logo text,
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  sizes jsonb NOT NULL DEFAULT '{}'::jsonb,
  main_image text,
  gallery text[] NOT NULL DEFAULT '{}',
  model_3d_url text,
  stock integer NOT NULL DEFAULT 50 CHECK (stock >= 0),
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);
CREATE INDEX IF NOT EXISTS idx_products_gender ON public.products (gender);
CREATE INDEX IF NOT EXISTS idx_products_featured_active ON public.products (is_featured, is_active);

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 3. Tabla: public.product_variants (Variantes de color y stock por SKU)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku text UNIQUE NOT NULL,
  color_label text NOT NULL,
  color_hex text NOT NULL,
  stock integer NOT NULL DEFAULT 25 CHECK (stock >= 0),
  price_override numeric(10,2),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants (product_id);

-- ============================================================================
-- 4. Tabla: public.profiles (Clientes, direcciones y programa de fidelidad)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  default_shipping_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  loyalty_points integer NOT NULL DEFAULT 0 CHECK (loyalty_points >= 0),
  tier text NOT NULL DEFAULT 'member' CHECK (tier IN ('member', 'silver', 'gold', 'vip')),
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (lower(email));
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON public.profiles (auth_user_id);

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 5. Tabla: public.promo_codes (Cupones y recompensas de lealtad)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text,
  discount_type text NOT NULL CHECK (discount_type IN ('percent', 'fixed', 'free_shipping', 'fixed_total')),
  discount_value numeric(10,2) NOT NULL DEFAULT 0,
  min_order_amount numeric(10,2) NOT NULL DEFAULT 0,
  free_shipping boolean NOT NULL DEFAULT false,
  points_cost integer NOT NULL DEFAULT 0,
  max_uses integer,
  used_count integer NOT NULL DEFAULT 0,
  expires_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promo_codes_code_active ON public.promo_codes (upper(code), is_active);

-- ============================================================================
-- 6. Tabla: public.orders (Pedidos y pagos Stripe)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_email text NOT NULL,
  customer_name text,
  customer_phone text,
  stripe_id text UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  discount numeric(10,2) NOT NULL DEFAULT 0,
  taxable_base numeric(10,2) NOT NULL DEFAULT 0,
  tax numeric(10,2) NOT NULL DEFAULT 0,
  shipping numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  promo_code text,
  points_earned integer NOT NULL DEFAULT 0,
  shipping_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  tracking_number text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders (lower(customer_email));
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_id ON public.orders (stripe_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 7. Tabla: public.order_items (Líneas de pedido)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_slug text NOT NULL,
  product_code text,
  product_name text NOT NULL,
  model text,
  color_hex text,
  color_label text,
  unit_price numeric(10,2) NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  line_total numeric(10,2) NOT NULL,
  image text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items (product_id);

-- ============================================================================
-- 8. Tabla: public.loyalty_transactions (Historial de puntos S2)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  customer_email text NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  points_delta integer NOT NULL,
  reason text NOT NULL,
  reward_code text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_tx_customer_id ON public.loyalty_transactions (customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_tx_email ON public.loyalty_transactions (lower(customer_email));

-- ============================================================================
-- 9. Tabla: public.favorites (Favoritos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email text,
  session_id text,
  product_slug text NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_favorites_email ON public.favorites (lower(customer_email));
CREATE INDEX IF NOT EXISTS idx_favorites_session ON public.favorites (session_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_unique_email_slug
  ON public.favorites (lower(customer_email), product_slug)
  WHERE customer_email IS NOT NULL;

-- ============================================================================
-- 10. Tabla: public.newsletter_subscribers (Comunidad / Newsletter Footer)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  promo_code_sent text DEFAULT 'S2-WELCOME10',
  privacy_accepted boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  source text DEFAULT 'footer',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers (lower(email));

-- ============================================================================
-- 11. Tabla: public.contact_messages (Formulario de soporte /contacto)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  message text NOT NULL,
  privacy_accepted boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages (status, created_at DESC);

-- ============================================================================
-- 12. Tabla: public.distributor_leads (Solicitudes B2B Distribuidor Oficial)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.distributor_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  company_name text,
  phone text,
  notes text,
  privacy_accepted boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_distributor_leads_status ON public.distributor_leads (status, created_at DESC);

-- ============================================================================
-- 13. Vistas útiles para catálogo y resumen de pedidos
-- ============================================================================
CREATE OR REPLACE VIEW public.v_active_catalog AS
SELECT
  p.id,
  p.product_key,
  p.letter,
  p.code,
  p.name,
  p.subtitle,
  p.slug,
  p.price,
  p.compare_at_price,
  p.gender,
  p.model,
  p.main_image,
  p.stock,
  p.is_featured,
  COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'sku', pv.sku,
          'color_label', pv.color_label,
          'color_hex', pv.color_hex,
          'stock', pv.stock
        )
        ORDER BY pv.created_at
      )
      FROM public.product_variants pv
      WHERE pv.product_id = p.id AND pv.is_active = true
    ),
    '[]'::jsonb
  ) AS variants
FROM public.products p
WHERE p.is_active = true;

-- ============================================================================
-- 14. Row Level Security (RLS)
-- ============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributor_leads ENABLE ROW LEVEL SECURITY;

-- Lectura pública del catálogo activo y cupones activos
DROP POLICY IF EXISTS "Public read active products" ON public.products;
CREATE POLICY "Public read active products" ON public.products
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read active variants" ON public.product_variants;
CREATE POLICY "Public read active variants" ON public.product_variants
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read active promo codes" ON public.promo_codes;
CREATE POLICY "Public read active promo codes" ON public.promo_codes
  FOR SELECT USING (is_active = true);

-- Inserción pública controlada para formularios, newsletter, favoritos y checkout invitado
DROP POLICY IF EXISTS "Public insert newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public insert newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (privacy_accepted = true);

DROP POLICY IF EXISTS "Public update newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public update newsletter" ON public.newsletter_subscribers
  FOR UPDATE USING (true) WITH CHECK (privacy_accepted = true);

DROP POLICY IF EXISTS "Public insert contact messages" ON public.contact_messages;
CREATE POLICY "Public insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (privacy_accepted = true);

DROP POLICY IF EXISTS "Public insert distributor leads" ON public.distributor_leads;
CREATE POLICY "Public insert distributor leads" ON public.distributor_leads
  FOR INSERT WITH CHECK (privacy_accepted = true);

DROP POLICY IF EXISTS "Public insert favorites" ON public.favorites;
CREATE POLICY "Public insert favorites" ON public.favorites
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read favorites" ON public.favorites;
CREATE POLICY "Public read favorites" ON public.favorites
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public delete favorites" ON public.favorites;
CREATE POLICY "Public delete favorites" ON public.favorites
  FOR DELETE USING (true);

-- Pedidos y perfiles (autenticados o flujo servidor / invitado)
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users read own orders" ON public.orders;
CREATE POLICY "Users read own orders" ON public.orders
  FOR SELECT USING (
    auth.role() = 'service_role'
    OR (auth.uid() IS NOT NULL AND customer_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()))
  );

DROP POLICY IF EXISTS "Public insert order items" ON public.order_items;
CREATE POLICY "Public insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users read own order items" ON public.order_items;
CREATE POLICY "Users read own order items" ON public.order_items
  FOR SELECT USING (
    auth.role() = 'service_role'
    OR order_id IN (
      SELECT id FROM public.orders
      WHERE customer_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users manage own profile" ON public.profiles;
CREATE POLICY "Users manage own profile" ON public.profiles
  FOR ALL USING (auth.role() = 'service_role' OR auth.uid() = auth_user_id)
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() = auth_user_id OR auth_user_id IS NULL);

DROP POLICY IF EXISTS "Users read own loyalty transactions" ON public.loyalty_transactions;
CREATE POLICY "Users read own loyalty transactions" ON public.loyalty_transactions
  FOR SELECT USING (
    auth.role() = 'service_role'
    OR customer_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
  );

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Servidor (Secret key): acceso completo
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Público: solo lectura del catálogo activo (RLS filtra is_active = true)
GRANT SELECT ON public.products, public.product_variants TO anon, authenticated;
