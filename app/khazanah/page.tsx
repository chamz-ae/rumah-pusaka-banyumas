import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import CollectionCard, { PublicCollectionItem } from '@/components/public/CollectionCard';
import { Compass, Search, X } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Khazanah Sejarah & Informasi — Rumah Pusaka Banyumas',
  description: 'Pencarian artikel sejarah, arsip, dan informasi kebudayaan tosan aji.',
};

export default async function KhazanahSejarahPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }> | { q?: string };
}) {
  const supabase = await createClient();
  
  const resolvedParams = await Promise.resolve(searchParams);
  const query = resolvedParams?.q?.trim() || '';

  let dbQuery = supabase
    .from('collections')
    .select(`
      id, collection_code, title, slug, luk, estimated_period, origin, material, description,
      category:categories(name, slug), dhapur:dhapurs(name),
      images:collection_images(image_url, is_primary),
      collector:profiles!created_by(username, full_name, avatar_url, is_verified)
    `)
    .eq('status', 'PUBLISHED')
    .is('deleted_at', null);

  if (query) {
    // 1. Ambil ID Kategori yang cocok dengan kueri
    const { data: matchedCategories } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', `%${query}%`);
    const catIds = matchedCategories?.map((c: any) => c.id) || [];

    // 2. Ambil ID Dhapur yang cocok dengan kueri
    const { data: matchedDhapurs } = await supabase
      .from('dhapurs')
      .select('id')
      .ilike('name', `%${query}%`);
    const dhapurIds = matchedDhapurs?.map((d: any) => d.id) || [];

    // 3. Susun daftar pencarian teks pada kolom yang tersedia
    let orConditions = [
      `title.ilike.%${query}%`,
      `collection_code.ilike.%${query}%`,
      `origin.ilike.%${query}%`,
      `estimated_period.ilike.%${query}%`,
      `description.ilike.%${query}%`
    ];

    // 4. Tambahkan filter relasi ID jika ditemukan
    if (catIds.length > 0) {
      orConditions.push(`category_id.in.(${catIds.join(',')})`);
    }
    if (dhapurIds.length > 0) {
      orConditions.push(`dhapur_id.in.(${dhapurIds.join(',')})`);
    }

    dbQuery = dbQuery.or(orConditions.join(','));
  }

  const { data: collections, error } = await dbQuery.order('created_at', { ascending: false });

  if (error) {
    console.error('Khazanah Search Error:', error.message);
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB] pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header Khazanah Sejarah */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-wider font-mono">
          <Compass className="w-3.5 h-3.5" />
          <span>KHAZANAH SEJARAH & ARSIP</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#D4AF37] font-bold">
          Khazanah Sejarah & Informasi
        </h1>
        <p className="text-xs sm:text-sm text-[#F5F2EB]/70 leading-relaxed font-light">
          Cari dan telusuri informasi sejarah, arsip dokumentasi, serta narasi budaya pusaka.
        </p>

        {/* Form Search Khusus Informasi */}
        <form method="GET" action="/khazanah" className="pt-4 max-w-xl mx-auto flex items-center gap-2 bg-[#121212] border border-[#D4AF37]/40 rounded-xl px-4 py-2.5 shadow-xl">
          <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Cari kategori, dhapur, asal, tahun, deskripsi..."
            className="w-full bg-transparent text-xs sm:text-sm text-[#F5F2EB] placeholder:text-[#F5F2EB]/40 outline-none"
          />
          {query && (
            <Link href="/khazanah" className="p-1 text-[#F5F2EB]/40 hover:text-[#D4AF37]" title="Reset Pencarian">
              <X className="w-4 h-4" />
            </Link>
          )}
          <button type="submit" className="px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase rounded-lg hover:bg-[#C5A059] transition-colors shrink-0">
            Cari
          </button>
        </form>
      </div>

      {/* Hasil Pencarian Informasi */}
      {collections && collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((item: any) => (
            <CollectionCard key={item.id} item={item as PublicCollectionItem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#121212] border border-white/10 rounded-2xl space-y-3 max-w-lg mx-auto">
          <p className="text-sm font-serif text-[#D4AF37]">Tidak menemukan hasil untuk "{query}"</p>
          <p className="text-xs text-[#F5F2EB]/60">Coba gunakan kata kunci lain seperti nama wilayah, dhapur, atau kategori.</p>
          <div className="pt-2">
            <Link href="/khazanah" className="inline-block px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs rounded-xl font-bold uppercase">
              Muat Ulang Semua Arsip
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}