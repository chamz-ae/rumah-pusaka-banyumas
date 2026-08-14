import { createBrowserClient } from '@supabase/ssr';

/**
 * Membuat Supabase Client untuk komponen yang berjalan di browser (Client Component)
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}