import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import CollectionCard, { PublicCollectionItem } from '@/components/public/CollectionCard';
import { Compass, Sparkles } from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Mari Mengintai Khazanah Sejarah — Rumah Pusaka Banyumas',
  description: 'Galeri katalog visual murni seluruh artefak pusaka tosan aji yang telah diinventarisasi.',
};

export default async function KhazanahSejarahPage() {
  const supabase = await createClient();

  // Fetch seluruh artefak published tanpa fitur filter/search
  const { data: collections } = await supabase
    .from('collections')
    .select(`
      id,
      collection_code,
      title,
      slug,
      luk,
      estimated_period,
      origin,
      material,
      category:categories(name, slug),
      dhapur:dhapurs(name),
      images:collection_images(image_url, is_primary),
      collector:profiles!created_by(username, full_name, avatar_url, is_verified)
    `)
    .eq('status', 'PUBLISHED')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB] pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>GALERI VISUAL KHASANAH SEJARAH</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#D4AF37] font-bold">
          Mengintai Khazanah Sejarah Tosan Aji
        </h1>
        <p className="text-xs sm:text-sm text-[#F5F2EB]/70 leading-relaxed font-light">
          Nikmati keindahan visual dokumentasi seluruh koleksi Keris, Tombak, dan Pedang Jawa yang tersimpan dalam arsip digital Rumah Pusaka Banyumas.
        </p>
      </div>

      {collections && collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((item: any) => (
            <CollectionCard key={item.id} item={item as PublicCollectionItem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#121212] border border-white/10 rounded-2xl space-y-3">
          <p className="text-sm font-serif text-[#D4AF37]">
            Belum Ada Koleksi Dipublikasikan
          </p>
          <p className="text-xs text-[#F5F2EB]/60">
            Arsip kebudayaan sedang dalam proses kurasi oleh tim dewan kurator museum.
          </p>
        </div>
      )}
    </main>
  );
}