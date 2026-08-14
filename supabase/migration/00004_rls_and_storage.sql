-- =========================================================================
-- RUMAH PUSAKA BANYUMAS - ROW LEVEL SECURITY (RLS) & STORAGE POLICIES
-- Database: Supabase PostgreSQL & Storage
-- =========================================================================

-- 1. AKTIFKAN RLS PADA SELURUH TABEL
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dhapurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ricikan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_ricikan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_images ENABLE ROW LEVEL SECURITY;


-- 2. POLICY: MASTER DATA (READ-ONLY FOR PUBLIC, ALL FOR ADMIN)

-- Categories
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin All Categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Types
CREATE POLICY "Public Read Types" ON public.types FOR SELECT USING (true);
CREATE POLICY "Admin All Types" ON public.types FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Dhapurs
CREATE POLICY "Public Read Dhapurs" ON public.dhapurs FOR SELECT USING (true);
CREATE POLICY "Admin All Dhapurs" ON public.dhapurs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Ricikan
CREATE POLICY "Public Read Ricikan" ON public.ricikan FOR SELECT USING (true);
CREATE POLICY "Admin All Ricikan" ON public.ricikan FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Profiles
CREATE POLICY "Admin Read Profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin Manage Profiles" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);


-- 3. POLICY: COLLECTIONS (HANYA PUBLISHED UNTUK PUBLIK)

-- Collections Public: Hanya SELECT jika status = 'PUBLISHED' dan tidak di-soft-delete
CREATE POLICY "Public Read Collections" ON public.collections 
  FOR SELECT 
  USING (status = 'PUBLISHED' AND deleted_at IS NULL);

-- Collections Admin: Akses Penuh (DRAFT, PRIVATE, PUBLISHED)
CREATE POLICY "Admin All Collections" ON public.collections 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);


-- 4. POLICY: COLLECTION RICIKAN & IMAGES

-- Collection Ricikan
CREATE POLICY "Public Read Collection Ricikan" ON public.collection_ricikan FOR SELECT USING (true);
CREATE POLICY "Admin All Collection Ricikan" ON public.collection_ricikan FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Collection Images
CREATE POLICY "Public Read Collection Images" ON public.collection_images FOR SELECT USING (true);
CREATE POLICY "Admin All Collection Images" ON public.collection_images FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- 5. MEMBUAT BUCKET SUPABASE STORAGE "collection-images"
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'collection-images', 
  'collection-images', 
  true, 
  5242880, -- Maksimal ukuran file 5MB per gambar
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];


-- 6. POLICY SECURITY UNTUK STORAGE OBJECTS

-- Publik diizinkan membaca/melihat semua foto koleksi
CREATE POLICY "Public Read Storage Images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'collection-images');

-- Admin terautentikasi diizinkan upload, update, dan hapus foto
CREATE POLICY "Admin Upload Storage Images" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'collection-images');

CREATE POLICY "Admin Update Storage Images" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'collection-images');

CREATE POLICY "Admin Delete Storage Images" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'collection-images');