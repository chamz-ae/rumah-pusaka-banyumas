import { createClient } from '@/lib/supabase/server';
import CollectionCard, { PublicCollectionItem } from '@/components/public/CollectionCard';
import FilterPanel from '@/components/public/FilterPanel';
import { Sparkles, Library } from 'lucide-react';

export const revalidate = 60;

export default async function PublicCollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    dhapur?: string;
    luk?: string;
    ricikan?: string;
  }>;
}) {
  const { q, category: categorySlug, dhapur: dhapurId, luk, ricikan: ricikanId } = await searchParams;
  const supabase = await createClient();

  // 1. Fetch Master Data untuk Filter
  const [categoriesRes, dhapursRes, ricikanRes] = await Promise.all([
    supabase.from('categories').select('id, name, slug').order('name'),
    supabase.from('dhapurs').select('id, name, category_id, luk').order('name'),
    supabase.from('ricikan').select('id, name').order('name'),
  ]);

  const categories = categoriesRes.data || [];
  const dhapurs = dhapursRes.data || [];
  const ricikanList = ricikanRes.data || [];

  // 2. Kueri Koleksi dengan Filter Dinamis (Hanya PUBLISHED & deleted_at IS NULL)
  let query = supabase
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
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  // Filter Kata Kunci (Pencarian Nama, Kode, Deskripsi, atau Asal)
  if (q && q.trim() !== '') {
    const searchPattern = `%${q.trim()}%`;
    query = query.or(
      `title.ilike.${searchPattern},collection_code.ilike.${searchPattern},origin.ilike.${searchPattern},description.ilike.${searchPattern}`
    );
  }

  // Filter Kategori
  if (categorySlug) {
    const matchedCategory = categories.find((c) => c.slug === categorySlug);
    if (matchedCategory) {
      query = query.eq('category_id', matchedCategory.id);
    }
  }

  // Filter Dhapur
  if (dhapurId) {
    query = query.eq('dhapur_id', dhapurId);
  }

  // Filter Jumlah Luk
  if (luk) {
    query = query.eq('luk', parseInt(luk, 10));
  }

  const { data: rawCollections } = await query;
  let collections = rawCollections || [];

  // Filter Ricikan (Jika ricikanId dipilih -> saring via relasi collection_ricikan)
  if (ricikanId && collections.length > 0) {
    const collectionIds = collections.map((c) => c.id);
    const { data: ricikanRels } = await supabase
      .from('collection_ricikan')
      .select('collection_id')
      .eq('ricikan_id', ricikanId)
      .in('collection_id', collectionIds);

    const validIds = new Set(ricikanRels?.map((r) => r.collection_id) || []);
    collections = collections.filter((c) => validIds.has(c.id));
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB] pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Katalog Museum */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-[0.2em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Katalog & Pencarian Museum Digital</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif text-[#D4AF37]">
          Khazanah Koleksi Pusaka
        </h1>

        <p className="text-xs sm:text-sm text-[#F5F2EB]/70 leading-relaxed max-w-2xl mx-auto">
          Gunakan bilah pencarian atau penyaring klasifikasi untuk menemukan artefak Keris, Tombak, dan Pedang Jawa.
        </p>
      </div>

      {/* FILTER PANEL COMPONENT */}
      <FilterPanel
        categories={categories}
        dhapurs={dhapurs}
        ricikanList={ricikanList}
      />

      {/* HASIL KATALOG GRID */}
      <div className="mb-4 flex items-center justify-between text-xs text-[#F5F2EB]/60">
        <span>Menampilkan <strong>{collections.length}</strong> artefak pusaka</span>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-[#121212]/50 max-w-xl mx-auto p-8 space-y-3">
          <Library className="w-12 h-12 text-[#D4AF37]/40 mx-auto" />
          <h3 className="font-serif text-lg text-[#D4AF37]">
            Pencarian Tidak Ditemukan
          </h3>
          <p className="text-xs text-[#F5F2EB]/60 leading-relaxed">
            Tidak ada koleksi publik yang cocok dengan kata kunci atau kombinasi filter Anda. Coba reset filter pencarian.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((item: any) => (
            <CollectionCard key={item.id} item={item as PublicCollectionItem} />
          ))}
        </div>
      )}
    </main>
  );
}