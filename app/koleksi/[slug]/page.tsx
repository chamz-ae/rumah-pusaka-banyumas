import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DetailGallery from '@/components/public/DetailGallery';
import CollectionCard, { PublicCollectionItem } from '@/components/public/CollectionCard';
import ShareButton from '@/components/public/ShareButton';
import ArtefactInteractions from '@/components/public/ArtefactInteractions';
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Scroll,
  BookOpen,
  CheckCircle2,
  Calendar,
  MapPin,
  Layers,
  User,
  MessageCircle,
} from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: collection } = await supabase
    .from('collections')
    .select(`
      title,
      description,
      category:categories(name),
      images:collection_images(image_url, is_primary)
    `)
    .eq('slug', slug)
    .eq('status', 'PUBLISHED')
    .is('deleted_at', null)
    .maybeSingle();

  if (!collection) {
    return {
      title: 'Artefak Tidak Ditemukan — Rumah Pusaka Banyumas',
    };
  }

  const categoryObj = collection.category as any;
  const categoryName = Array.isArray(categoryObj) ? categoryObj[0]?.name : categoryObj?.name;

  const primaryImage =
    collection.images?.find((img: any) => img.is_primary)?.image_url ||
    collection.images?.[0]?.image_url ||
    '/images/og-default.jpg';

  const pageTitle = `${collection.title} (${categoryName || 'Pusaka'}) — Rumah Pusaka Banyumas`;
  const pageDescription =
    collection.description ||
    `Dokumentasi resmi arsip museum digital untuk artefak ${collection.title}. Warisan Budaya Rumah Pusaka Banyumas.`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `/koleksi/${slug}`,
      siteName: 'Rumah Pusaka Banyumas',
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: collection.title,
        },
      ],
      locale: 'id_ID',
      type: 'article',
    },
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch Detail Koleksi & Profil Kolektor Pemilik
  const { data: collection } = await supabase
    .from('collections')
    .select(`
      *,
      category:categories(name, slug),
      type:types(name, slug),
      dhapur:dhapurs(name),
      ricikan_rel:collection_ricikan(
        ricikan:ricikan(id, name, slug)
      ),
      images:collection_images(id, image_url, alt_text, is_primary),
      collector:profiles(id, username, full_name, avatar_url, location, phone_number, is_verified)
    `)
    .eq('slug', slug)
    .eq('status', 'PUBLISHED')
    .is('deleted_at', null)
    .maybeSingle();

  if (!collection) {
    notFound();
  }

  // Fetch Hitungan Likes & List Komentar
  const { count: likeCount } = await supabase
    .from('collection_likes')
    .select('id', { count: 'exact', head: true })
    .eq('collection_id', collection.id);

  const { data: comments } = await supabase
    .from('collection_comments')
    .select(`
      id,
      content,
      created_at,
      user_id,
      user:profiles(full_name, username, avatar_url, is_verified)
    `)
    .eq('collection_id', collection.id)
    .order('created_at', { ascending: false });

  // 2. Fetch Koleksi Serupa
  const { data: relatedCollections } = await supabase
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
      images:collection_images(image_url, is_primary),
      collector:profiles(username, full_name, avatar_url, is_verified)
    `)
    .eq('status', 'PUBLISHED')
    .eq('category_id', collection.category_id)
    .neq('id', collection.id)
    .is('deleted_at', null)
    .limit(3);

  const categoryObj = collection.category as any;
  const categoryName = Array.isArray(categoryObj) ? categoryObj[0]?.name : categoryObj?.name;
  const ricikanList = collection.ricikan_rel?.map((r: any) => r.ricikan).filter(Boolean) || [];
  const collector = (collection as any).collector;

  const whatsappUrl = collector?.phone_number
    ? `https://api.whatsapp.com/send?phone=${collector.phone_number.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Halo ${collector.full_name}, saya tertarik berdiskusi tentang artefak "${collection.title}" di Rumah Pusaka Banyumas.`)}`
    : null;

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB] pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Navigasi & Tombol Bagikan */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          href="/koleksi"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] hover:underline uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Seluruh Koleksi</span>
        </Link>

        <ShareButton
          title={collection.title}
          slug={collection.slug}
          categoryName={categoryName}
        />
      </div>

      {/* SECTION 1: HEADER & IDENTITAS ARTEFAK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
        <div className="lg:col-span-6">
          <DetailGallery
            images={collection.images || []}
            title={collection.title}
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="bg-black border border-[#D4AF37]/50 text-[#D4AF37] font-mono text-xs px-3 py-1 rounded-full shadow-md">
                {collection.collection_code}
              </span>
              <span className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                {categoryName || 'Pusaka'}
              </span>
              {collection.luk && (
                <span className="bg-white/5 border border-white/10 text-[#F5F2EB]/80 text-xs font-medium px-3 py-1 rounded-full">
                  Luk {collection.luk}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#D4AF37] font-bold leading-tight">
              {collection.title}
            </h1>
          </div>

          {/* KOTAK PEMILIK / KOLEKTOR */}
          {collector && (
            <div className="p-4 rounded-xl border border-[#D4AF37]/30 bg-[#121212] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#D4AF37] overflow-hidden shrink-0 flex items-center justify-center">
                  {collector.avatar_url ? (
                    <img
                      src={collector.avatar_url}
                      alt={collector.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-[#D4AF37]" />
                  )}
                </div>
                <div>
                  <div className="text-[10px] uppercase text-[#D4AF37] font-bold tracking-wider">
                    Dikoleksi Oleh
                  </div>
                  <Link
                    href={`/kolektor/${collector.username}`}
                    className="font-serif text-sm font-bold text-[#F5F2EB] hover:underline flex items-center gap-1"
                  >
                    <span>{collector.full_name}</span>
                    {collector.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Diskusi</span>
                  </a>
                )}
                <Link
                  href={`/kolektor/${collector.username}`}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#D4AF37] rounded-lg"
                >
                  Galeri
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 p-5 rounded-xl border border-[#D4AF37]/20 bg-[#121212]">
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#D4AF37]/70 font-semibold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Dhapur Pusaka</span>
              </div>
              <div className="text-sm font-serif font-bold text-[#F5F2EB]">
                {(collection.dhapur as any)?.name || 'Tidak Ditentukan'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#D4AF37]/70 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Estimasi Tangguh / Era</span>
              </div>
              <div className="text-sm font-serif font-bold text-[#F5F2EB]">
                {collection.estimated_period || 'Belum Dicatat'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#D4AF37]/70 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Asal Daerah (Origin)</span>
              </div>
              <div className="text-sm font-serif font-bold text-[#F5F2EB]">
                {collection.origin || 'Belum Dicatat'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#D4AF37]/70 font-semibold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Pamor / Material</span>
              </div>
              <div className="text-sm font-serif font-bold text-[#F5F2EB]">
                {collection.material || 'Belum Dicatat'}
              </div>
            </div>
          </div>

          {collection.description && (
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                Deskripsi Umum
              </h3>
              <p className="text-xs sm:text-sm text-[#F5F2EB]/80 leading-relaxed font-light">
                {collection.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: RICIKAN PUSAKA */}
      {ricikanList.length > 0 && (
        <section className="mb-16 p-8 rounded-2xl border border-[#D4AF37]/20 bg-[#121212] space-y-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4 text-[#D4AF37]">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-serif text-xl font-bold">
              Kelengkapan Ricikan Bilah
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {ricikanList.map((ric: any) => (
              <div
                key={ric.id}
                className="p-3 rounded-lg border border-[#D4AF37]/30 bg-[#1A1A1A] text-xs font-medium text-[#D4AF37] flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                <span className="truncate">{ric.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: SEJARAH & FILOSOFI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="p-8 rounded-2xl border border-white/10 bg-[#121212] space-y-4">
          <div className="flex items-center gap-2 text-[#D4AF37] border-b border-white/10 pb-3">
            <Scroll className="w-5 h-5" />
            <h2 className="font-serif text-lg font-bold">Catatan Historis & Asal-Usul</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#F5F2EB]/80 leading-relaxed whitespace-pre-line font-light">
            {collection.historical_description || 'Uraian historiografi peristiwa atau riwayat kepemilikan artefak ini belum dimasukkan dalam catatan kurator.'}
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-white/10 bg-[#121212] space-y-4">
          <div className="flex items-center gap-2 text-[#D4AF37] border-b border-white/10 pb-3">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="font-serif text-lg font-bold">Filosofi & Makna Kebudayaan</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#F5F2EB]/80 leading-relaxed whitespace-pre-line font-light">
            {collection.cultural_description || 'Nilai ajaran moral, pasren, serta tuah filosofis tradisional khas Jawa untuk pusaka ini belum dicatat.'}
          </p>
        </div>
      </div>

      {/* SECTION 4: APRESIASI LIKES & DISKUSI KOMUNITAS */}
      <div className="mb-16">
        <ArtefactInteractions
          collectionId={collection.id}
          initialLikeCount={likeCount || 0}
          initialComments={comments || []}
        />
      </div>

      {/* SECTION 5: KOLEKSI SERUPA */}
      {relatedCollections && relatedCollections.length > 0 && (
        <section className="pt-12 border-t border-[#D4AF37]/20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.2em] block mb-1">
                Eksplorasi Lanjutan
              </span>
              <h2 className="text-2xl font-serif text-[#D4AF37]">
                Koleksi Serupa
              </h2>
            </div>
            <Link
              href="/koleksi"
              className="text-xs text-[#D4AF37] hover:underline uppercase tracking-wider font-semibold"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedCollections.map((item: any) => (
              <CollectionCard key={item.id} item={item as PublicCollectionItem} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}