-- =========================================================================
-- RUMAH PUSAKA BANYUMAS - FIX PROFILES SYNC & AUTOMATIC TRIGGER
-- Database: Supabase PostgreSQL
-- =========================================================================

-- 1. SINKRONKAN SEMUA USER DARI auth.users KE public.profiles
INSERT INTO public.profiles (id, email, name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', email) AS name, 
  'admin' AS role
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 2. BUAT FUNGSI TRIGGER PENANGAN USER BARU
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 
    'admin'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. PASANG TRIGGER OTOMATIS PADA TABEL auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();