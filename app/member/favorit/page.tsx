import { createClient } from '@/lib/supabase/server';
import CollectionCard, { PublicCollectionItem } from '@/components/public/CollectionCard';
import { Heart, Layers } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function MemberFavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch Artefak yang Disukai (Liked) Oleh Member Ini
  const { data: likedData } = await supabase
    .from('collection_likes')
    .select(`
      created_at,
      collection:collections (
        id,
        collection_code,
        title,
        slug,
        luk,
        estimated_period,
        origin,
        category:categories(name, slug),
        dhapur:dhapurs(name),
        images:collection_images(image_url, is_primary),
        collector:profiles(username, full_name, avatar_url, is_verified)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const favoriteCollections = likedData?.map((item: any) => item.collection).filter(Boolean) || [];

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2 text-rose-400 mb-1">
          <Heart className="w-5 h-5 fill-rose-400" />
          <span className="text-xs uppercase font-mono font-bold tracking-wider">
            Arsip Pribadi
          </span>
        </div>
        <h1 className="text-2xl font-serif text-[#D4AF37] font-bold">
          Koleksi Favorit Saya
        </h1>
        <p className="text-xs text-[#F5F2EB]/60 mt-1">
          Daftar barang antik & pusaka buatan/milik kolektor lain yang Anda beri apresiasi.
        </p>
      </div>

      {favoriteCollections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCollections.map((item: any) => (
            <CollectionCard key={item.id} item={item as PublicCollectionItem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#121212] border border-white/10 rounded-2xl space-y-3">
          <div className="p-3 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-400 w-fit mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <p className="text-xs text-[#F5F2EB]/60">
            Anda belum menyukai pusaka manapun.
          </p>
          <Link
            href="/koleksi"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider rounded-lg"
          >
            <Layers className="w-4 h-4" />
            <span>Jelajahi Katalog Publik</span>
          </Link>
        </div>
      )}
    </div>
  );
}