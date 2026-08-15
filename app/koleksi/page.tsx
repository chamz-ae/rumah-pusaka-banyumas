import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import CollectionCard, { PublicCollectionItem } from '@/components/public/CollectionCard';
import FilterPanel from '@/components/public/FilterPanel';
import SearchBar from '@/components/public/SearchBar';
import { Sparkles, Layers, User, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Pencarian & Seluruh Koleksi — Rumah Pusaka Banyumas',
  description: 'Eksplorasi artefak pusaka, dhapur, pamor, serta profil kolektor terpercaya.',
};

export default async function PublicCollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}) {
  const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams;
  
  const qParam = typeof resolvedParams?.q === 'string' ? resolvedParams.q : '';
  const kategoriParam = typeof resolvedParams?.kategori === 'string' ? resolvedParams.kategori : '';
  const tipeParam = typeof resolvedParams?.tipe === 'string' ? resolvedParams.tipe : '';
  const dhapurParam = typeof resolvedParams?.dhapur === 'string' ? resolvedParams.dhapur : '';
  const lukParam = typeof resolvedParams?.luk === 'string' ? resolvedParams.luk : '';

  const queryText = qParam.trim();
  const safeSearch = queryText.replace(/[^a-zA-Z0-9 _-]/g, '');

  const supabase = await createClient();

  // Fetch Data Master Filter
  const { data: categories } = await supabase.from('categories').select('id, name, slug').order('name');
  const { data: types } = await supabase.from('types').select('id, name, slug, category_id').order('name');
  const { data: dhapurs } = await supabase.from('dhapurs').select('id, name, category_id, type_id, luk').order('name');
  const { data: ricikanList } = await supabase.from('ricikan').select('id, name, slug').order('name');

  // 1. CARI KOLEKTOR (BERDASARKAN NAMA / USERNAME)
  let matchingCollectors: any[] = [];
  if (safeSearch) {
    const { data: collectors } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url, location, is_verified')
      .or(`full_name.ilike.%${safeSearch}%,username.ilike.%${safeSearch}%`)
      .limit(6);
    matchingCollectors = collectors || [];
  }

  // 2. CARI PUSAKA & SPESIFIKASI TERKAIT
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
      material,
      category:categories(name, slug),
      dhapur:dhapurs(name),
      images:collection_images(image_url, is_primary),
      collector:profiles!created_by(username, full_name, avatar_url, is_verified)
    `)
    .eq('status', 'PUBLISHED')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (safeSearch) {
    query = query.or(
      `title.ilike.%${safeSearch}%,collection_code.ilike.%${safeSearch}%,origin.ilike.%${safeSearch}%,estimated_period.ilike.%${safeSearch}%,material.ilike.%${safeSearch}%`
    );
  }

  if (kategoriParam) {
    const selectedCat = categories?.find((c) => c.slug === kategoriParam);
    if (selectedCat) query = query.eq('category_id', selectedCat.id);
  }
  if (tipeParam) {
    const selectedType = types?.find((t) => t.slug === tipeParam);
    if (selectedType) query = query.eq('type_id', selectedType.id);
  }
  if (dhapurParam) {
    query = query.eq('dhapur_id', dhapurParam);
  }
  if (lukParam) {
    query = query.eq('luk', parseInt(lukParam));
  }

  const { data: collections } = await query;

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB] pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* HEADER PENCARIAN */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mesin Pencari Museum & Komunitas</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#D4AF37] font-bold">
          {queryText ? `Hasil Pencarian: "${queryText}"` : 'Eksplorasi Seluruh Koleksi'}
        </h1>
        <p className="text-xs sm:text-sm text-[#F5F2EB]/70 leading-relaxed font-light">
          Cari berdasarkan nama pusaka, dhapur, pamor, tangguh, asal daerah, maupun profil kolektor.
        </p>
      </div>

      {/* SEARCH BAR & FILTER PANEL */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <SearchBar initialQuery={queryText} />
        <FilterPanel
          categories={categories || []}
          types={types || []}
          dhapurs={dhapurs || []}
          ricikanList={ricikanList || []}
          selectedCategory={kategoriParam}
          selectedType={tipeParam}
          selectedDhapur={dhapurParam}
          selectedLuk={lukParam}
        />
      </div>

      {/* HASIL 1: PENCARIAN KOLEKTOR (JIKA ADA MATCH) */}
      {queryText && matchingCollectors.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-[#D4AF37] font-serif font-bold text-lg">
            <User className="w-5 h-5" />
            <h2>Kolektor Ditemukan ({matchingCollectors.length})</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingCollectors.map((col) => (
              <Link
                key={col.id}
                href={`/kolektor/${col.username}`}
                className="p-4 rounded-xl border border-white/10 bg-[#121212] hover:border-[#D4AF37]/50 transition-all flex items-center justify-between group shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#D4AF37] flex items-center justify-center overflow-hidden shrink-0">
                    {col.avatar_url ? (
                      <img src={col.avatar_url} alt={col.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-[#D4AF37]" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#F5F2EB] group-hover:text-[#D4AF37] flex items-center gap-1">
                      <span>{col.full_name}</span>
                      {col.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </div>
                    <div className="text-[11px] text-[#D4AF37] font-mono">@{col.username}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#F5F2EB]/40 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* HASIL 2: GRID KOLEKSI PUSAKA */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-6 text-xs text-[#F5F2EB]/60">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <span>Menampilkan <strong>{collections?.length || 0}</strong> Artefak Pusaka</span>
          </div>
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
              {queryText ? `Tidak Ada Artefak yang Cocok dengan "${queryText}"` : 'Belum Ada Koleksi Dipublikasikan'}
            </p>
            <p className="text-xs text-[#F5F2EB]/60">
              Coba gunakan kata kunci lain seperti nama dhapur (Sengkelat, Nagasasra), pamor, atau asal daerah.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}