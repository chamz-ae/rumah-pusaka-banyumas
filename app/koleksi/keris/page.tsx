import { createClient } from '@/lib/supabase/server';
import CollectionCard, { PublicCollectionItem } from '@/components/public/CollectionCard';
import { Sparkles, Library } from 'lucide-react';

export const revalidate = 60;

export default async function KerisCategoryPage() {
  const supabase = await createClient();

  // Ambil data kategori Keris
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, description')
    .eq('slug', 'keris')
    .single();

  let collections: any[] = [];
  if (category) {
    const { data } = await supabase
      .from('collections')
      .select(`
        id,
        collection_code,
        title,
        slug,
        luk,
        estimated_period,
        origin,
        category:categories(name, slug),
        dhapur:dhapurs(name),
        images:collection_images(image_url, is_primary)
      `)
      .eq('status', 'PUBLISHED')
      .eq('category_id', category.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    collections = data || [];
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB] pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-[0.2em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Klasifikasi Khusus</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif text-[#D4AF37]">
          Koleksi Keris Jawa
        </h1>

        <p className="text-xs sm:text-sm text-[#F5F2EB]/70 leading-relaxed max-w-2xl mx-auto">
          {category?.description || 'Dokumentasi keris lurus serta keris berlekuk (Luk 3 hingga Luk 29) dengan keragaman pamor dan filosofi.'}
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-[#121212]/50 max-w-xl mx-auto p-8">
          <Library className="w-12 h-12 text-[#D4AF37]/40 mx-auto mb-4" />
          <p className="text-xs text-[#F5F2EB]/60">Belum ada koleksi keris yang dipublikasikan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((item) => (
            <CollectionCard key={item.id} item={item as PublicCollectionItem} />
          ))}
        </div>
      )}
    </main>
  );
}