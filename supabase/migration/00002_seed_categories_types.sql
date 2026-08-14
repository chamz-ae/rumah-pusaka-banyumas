-- =========================================================================
-- RUMAH PUSAKA BANYUMAS - SEED DATA MASTER CATEGORIES & TYPES
-- Database: Supabase PostgreSQL
-- =========================================================================

-- 1. INSERT MASTER CATEGORIES (DENGAN FIXED UUID UNTUK RELASI)
INSERT INTO public.categories (id, name, slug, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Keris', 'keris', 'Senjata tikam golongan belati dengan keindahan pamor dan lekukan luk.'),
  ('22222222-2222-2222-2222-222222222222', 'Tombak', 'tombak', 'Senjata pusaka berbilah tajam yang dipasang pada tongkat atau landeyan.'),
  ('33333333-3333-3333-3333-333333333333', 'Pedang Jawa', 'pedang-jawa', 'Senjata sabet warisan Jawa dengan ragam bentuk bilah khas.')
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 2. INSERT TYPES UNTUK KERIS
INSERT INTO public.types (category_id, name, slug, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Lurus', 'lurus', 'Keris dengan bilah lurus tanpa lekukan luk.'),
  ('11111111-1111-1111-1111-111111111111', 'Luk', 'luk', 'Keris dengan bilah berlekuk (ber-luk).')
ON CONFLICT (category_id, slug) DO NOTHING;

-- 3. INSERT TYPES UNTUK TOMBAK (SESUAI DOCUMENT RUJUKAN)
INSERT INTO public.types (category_id, name, slug, description) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Tombak Lurus', 'tombak-lurus', 'Klasifikasi tombak berbilah lurus.'),
  ('22222222-2222-2222-2222-222222222222', 'Tombak Kala Wijan', 'tombak-kala-wijan', 'Klasifikasi tombak dengan karakteristik bentuk khas Kala Wijan.'),
  ('22222222-2222-2222-2222-222222222222', 'Tombak Luk Lima', 'tombak-luk-lima', 'Klasifikasi tombak berlekuk lima.'),
  ('22222222-2222-2222-2222-222222222222', 'Tombak Luk Tujuh', 'tombak-luk-tujuh', 'Klasifikasi tombak berlekuk tujuh.'),
  ('22222222-2222-2222-2222-222222222222', 'Tombak Luk Sembilan', 'tombak-luk-sembilan', 'Klasifikasi tombak berlekuk sembilan.'),
  ('22222222-2222-2222-2222-222222222222', 'Tombak Luk Sebelas', 'tombak-luk-sebelas', 'Klasifikasi tombak berlekuk sebelas.'),
  ('22222222-2222-2222-2222-222222222222', 'Tombak Luk Khusus', 'tombak-luk-khusus', 'Klasifikasi tombak bentuk atau luk khusus.')
ON CONFLICT (category_id, slug) DO NOTHING;

-- 4. INSERT TYPES UNTUK PEDANG JAWA
INSERT INTO public.types (category_id, name, slug, description) VALUES
  ('33333333-3333-3333-3333-333333333333', 'Pedang Jawa', 'pedang-jawa', 'Klasifikasi pedang warisan Jawa.')
ON CONFLICT (category_id, slug) DO NOTHING;