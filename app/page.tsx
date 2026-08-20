import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import RicikanHighlight from '@/components/public/RicikanHighlight';
import PrimbonPreviewSection from '@/components/public/PrimbonPreviewSection';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Library,
  Flame,
} from 'lucide-react';

export const revalidate = 60; 

export default async function HomePage() {
  const supabase = await createClient();

  const { data: featuredCollections } = await supabase
    .from('collections')
    .select(`
      id,
      collection_code,
      title,
      slug,
      estimated_period,
      origin,
      category:categories(name),
      dhapur:dhapurs(name),
      images:collection_images(image_url, is_primary)
    `)
    .eq('status', 'PUBLISHED')
    .eq('featured', true)
    .is('deleted_at', null)
    .limit(3);

  const { data: latestCollections } = await supabase
    .from('collections')
    .select(`
      id,
      collection_code,
      title,
      slug,
      created_at,
      category:categories(name),
      dhapur:dhapurs(name),
      images:collection_images(image_url, is_primary)
    `)
    .eq('status', 'PUBLISHED')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(6);

  const categoryCards = [
    {
      title: 'Keris Jawa',
      desc: 'Senjata tikam berlekuk (luk) maupun lurus dengan keagungan filosofi dan kelestarian pamor.',
      href: '/koleksi?kategori=keris',
      countText: 'Lurus & Luk 3 s/d Luk 29',
    },
    {
      title: 'Tombak Pusaka',
      desc: 'Pusaka berbilah tajam penopang kepemimpinan dengan ragam wujud Kala Wijan hingga Luk Khusus.',
      href: '/koleksi?kategori=tombak',
      countText: 'Tombak Lurus & Ber-luk',
    },
    {
      title: 'Pedang Jawa',
      desc: 'Senjata sabet warisan Jawa dengan karakteristik bilah khusus seperti Luwuk, Lameng, dan Suduk Maru.',
      href: '/koleksi?kategori=pedang-jawa',
      countText: '9 Dhapur Klasik Jawa',
    },
  ];

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB]">
      
      {/* 1. HERO SECTION (DENGAN LOGO SQUARE PNG) */}
      <section className="px-4 max-w-5xl mx-auto text-center space-y-8 pt-32 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase font-mono tracking-widest shadow-lg">
          <Sparkles className="w-4 h-4" />
          <span>Digital Museum & Heritage Archive</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <div className="space-y-5">
          {/* LOGO SQUARE (PNG) */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center mx-auto shadow-2xl overflow-hidden border border-[#D4AF37]/30 bg-[#121212]">
            <img 
              src="https://res.cloudinary.com/dmmpuvtwx/image/upload/v1786837618/logo_a1zfbh.png" 
              alt="Logo Square Rumah Pusaka" 
              className="w-full h-full object-contain p-2" 
            />
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#D4AF37] font-bold tracking-tight leading-tight">
            Rumah Pusaka Banyumas
          </h1>
          <p className="text-lg sm:text-2xl font-serif italic text-[#F5F2EB]/90 font-light">
            "Warisan yang Dirawat, Sejarah yang Diingat."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/koleksi"
            className="w-full sm:w-auto px-7 py-3.5 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-105"
          >
            <Compass className="w-4 h-4" />
            <span>Jelajahi Koleksi</span>
          </Link>
        </div>
      </section>

      {/* 2. TENTANG RUMAH PUSAKA BANYUMAS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#D4AF37]/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 border-l-2 border-[#D4AF37] pl-6">
            <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.2em] block">
              Sekilas Museum & Arsip
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#D4AF37] leading-tight">
              Mendedikasikan Pelestarian Pengetahuan Pusaka
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-[#F5F2EB]/70 leading-relaxed">
            <p>
              <strong>Rumah Pusaka Banyumas</strong> berdiri sebagai ruang arsip digital yang mendokumentasikan setiap spesifikasi fisikal, latar sejarah, nilai filosofis, serta klasifikasi rinci dari setiap artefak pusaka.
            </p>
            <p>
              Dengan memadukan pendekatan kuratorial arsip sejarah dan teknologi modern, platform ini membuka akses seluas-luasnya bagi masyarakat, akademisi, dan generasi muda untuk mempelajari warisan budaya luhur tanpa batasan jarak.
            </p>
            <div className="pt-2">
              <Link
                href="/tentang"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] hover:underline uppercase tracking-wider"
              >
                <span>Baca Selengkapnya Tentang Visi Kami</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KOLEKSI PILIHAN (FEATURED COLLECTIONS) */}
      {featuredCollections && featuredCollections.length > 0 && (
        <section className="py-20 bg-[#0A0A0A] border-t border-[#D4AF37]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[#D4AF37] text-xs uppercase tracking-[0.2em] mb-2">
                  <Flame className="w-4 h-4" />
                  <span>Koleksi Utama</span>
                </div>
                <h2 className="text-3xl font-serif text-[#D4AF37]">
                  Artefak Pilihan Kurator
                </h2>
              </div>
              <Link
                href="/koleksi"
                className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 uppercase tracking-wider font-semibold"
              >
                <span>Lihat Semua Koleksi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCollections.map((item: any) => {
                const primaryImage =
                  item.images?.find((img: any) => img.is_primary)?.image_url ||
                  item.images?.[0]?.image_url ||
                  '/images/placeholder-pusaka.jpg';

                return (
                  <Link
                    key={item.id}
                    href={`/koleksi/${item.slug}`}
                    className="group bg-[#121212] rounded-xl border border-[#D4AF37]/30 overflow-hidden hover:border-[#D4AF37] transition-all duration-300 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/3] bg-black relative overflow-hidden">
                        <img
                          src={primaryImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono px-2.5 py-1 rounded">
                          {item.collection_code}
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <div className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">
                          {item.category?.name} • {item.dhapur?.name || 'Dhapur Tidak Ditentukan'}
                        </div>
                        <h3 className="font-serif text-lg text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#F5F2EB]/60">
                          {item.estimated_period || item.origin ? (
                            <>
                              {item.estimated_period && <span>{item.estimated_period}</span>}
                              {item.estimated_period && item.origin && <span> • </span>}
                              {item.origin && <span>{item.origin}</span>}
                            </>
                          ) : (
                            'Informasi asal belum tersedia'
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#D4AF37]">
                      <span>Lihat Detail Artefak</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. JELAJAHI BERDASARKAN KATEGORI */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.2em] block">
            Kategori Klasifikasi
          </span>
          <h2 className="text-3xl font-serif text-[#D4AF37]">
            Jelajahi Berdasarkan Golongan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoryCards.map((card, idx) => (
            <Link
              key={idx}
              href={card.href}
              className="p-8 rounded-xl border border-white/10 bg-[#121212] hover:border-[#D4AF37]/60 hover:bg-black/60 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="p-3 w-fit rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                  <Library className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-[#F5F2EB]/60 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-medium text-[#D4AF37]">
                <span>{card.countText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. SEKSI ANATOMI RICIKAN */}
      <RicikanHighlight />

      {/* 6. KOLEKSI TERBARU */}
      {latestCollections && latestCollections.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.2em] block mb-1">
                Arsip Baru Ditambahkan
              </span>
              <h2 className="text-3xl font-serif text-[#D4AF37]">
                Koleksi Terbaru
              </h2>
            </div>
            <Link
              href="/koleksi"
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 uppercase tracking-wider font-semibold"
            >
              <span>Lihat Seluruh Katalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestCollections.map((item: any) => {
              const primaryImage =
                item.images?.find((img: any) => img.is_primary)?.image_url ||
                item.images?.[0]?.image_url ||
                '/images/placeholder-pusaka.jpg';

              return (
                <Link
                  key={item.id}
                  href={`/koleksi/${item.slug}`}
                  className="bg-[#121212] rounded-lg border border-white/10 overflow-hidden hover:border-[#D4AF37]/50 transition-all group flex items-center p-3 gap-4"
                >
                  <div className="w-20 h-20 bg-black rounded shrink-0 overflow-hidden border border-white/10">
                    <img
                      src={primaryImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-[#D4AF37] font-mono">
                      {item.collection_code}
                    </div>
                    <h3 className="font-serif text-sm text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors truncate">
                      {item.title}
                    </h3>
                    <div className="text-[11px] text-[#F5F2EB]/50 truncate mt-0.5">
                      {item.category?.name} • {item.dhapur?.name || 'Dhapur N/A'}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. PREVIEW PRIMBON PUSAKA DI BERANDA */}
      <PrimbonPreviewSection />

      {/* 8. BOTTOM EXPLORE ARCHIVE CTA (MENGARAH KE /KHAZANAH) */}
      <section className="py-16 bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#0D0D0D] border-t border-[#D4AF37]/20 text-center px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="p-3 w-fit rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-serif text-[#D4AF37]">
            Mari Mengintai Khazanah Sejarah
          </h2>
          <p className="text-xs sm:text-sm text-[#F5F2EB]/70 leading-relaxed">
            Selami ratusan dokumentasi dhapur, kelengkapan ricikan, serta uraian narasi budaya koleksi pusaka Rumah Pusaka Banyumas[cite: 1].
          </p>
          <div>
            <Link
              href="/khazanah"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D4AF37] hover:bg-[#C5A059] text-black text-xs font-bold uppercase tracking-[0.15em] rounded-lg transition-all shadow-xl hover:scale-105"
            >
              <span>Masuki Khazanah Sejarah</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}