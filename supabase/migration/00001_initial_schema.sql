-- =========================================================================
-- RUMAH PUSAKA BANYUMAS - INITIAL DATABASE SCHEMA MIGRATION
-- Database: Supabase PostgreSQL
-- =========================================================================

-- 1. EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFILES (ADMINISTRATOR)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABEL CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABEL TYPES
CREATE TABLE IF NOT EXISTS public.types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_category_type_slug UNIQUE(category_id, slug)
);

-- 5. TABEL DHAPURS
CREATE TABLE IF NOT EXISTS public.dhapurs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  type_id UUID REFERENCES public.types(id) ON DELETE CASCADE,
  luk INT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABEL RICIKAN
CREATE TABLE IF NOT EXISTS public.ricikan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TABEL COLLECTIONS (KOLEKSI PUSAKA)
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  
  category_id UUID NOT NULL REFERENCES public.categories(id),
  type_id UUID REFERENCES public.types(id),
  dhapur_id UUID REFERENCES public.dhapurs(id),
  luk INT,

  description TEXT,
  historical_description TEXT,
  cultural_description TEXT,
  physical_description TEXT,

  origin TEXT,
  provenance TEXT,
  estimated_period TEXT,
  material TEXT,
  dimensions TEXT,
  condition TEXT,
  authenticity_notes TEXT,

  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PRIVATE', 'PUBLISHED')),
  featured BOOLEAN NOT NULL DEFAULT false,

  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 8. TABEL COLLECTION_RICIKAN (MANY-TO-MANY RELASI)
CREATE TABLE IF NOT EXISTS public.collection_ricikan (
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  ricikan_id UUID NOT NULL REFERENCES public.ricikan(id) ON DELETE CASCADE,
  notes TEXT,
  PRIMARY KEY (collection_id, ricikan_id)
);

-- 9. TABEL COLLECTION_IMAGES (GALERI FOTO)
CREATE TABLE IF NOT EXISTS public.collection_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);