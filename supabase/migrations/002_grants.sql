-- ============================================================================
-- STENCIL2 — Permisos de tablas (GRANTs)
-- Los proyectos nuevos de Supabase ya no conceden permisos automáticos sobre
-- tablas creadas por SQL. Toda la app accede desde el servidor con la Secret
-- key (service_role); el público (anon/authenticated) solo lee el catálogo.
-- Idempotente: seguro para re-ejecutar.
-- ============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Servidor (Secret key): acceso completo
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Público: solo lectura del catálogo activo (RLS filtra is_active = true)
GRANT SELECT ON public.products, public.product_variants TO anon, authenticated;
