import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import CollectionCard, { PublicCollectionItem } from '@/components/public/CollectionCard';
import {
  User,
  MapPin,
  MessageCircle,
  Globe,
  ShieldCheck,
  Layers,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const revalidate = 60;

// Dynamic Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username, bio')
    .eq('username', username.toLowerCase())
    .maybeSingle();

  if (!profile) {
    return { title: 'Kolektor Tidak Ditemukan — Rumah Pusaka Banyumas' };
  }

  const title = `Galeri Digital ${profile.full_name} (@${profile.username}) — Rumah Pusaka Banyumas`;
  const description =
    profile.bio ||
    `Jelajahi dokumentasi koleksi barang antik dan pusaka milik ${profile.full_name} di Rumah Pusaka Banyumas.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
    },
  };
}

export default async function CollectorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  // 1. Fetch Profil Kolektor
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username.toLowerCase())
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  // 2. Fetch Koleksi Milik Kolektor Ini (Hanya Status PUBLISHED)
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
      category:categories(name, slug),
      dhapur:dhapurs(name),
      images:collection_images(image_url, is_primary),
      collector:profiles(username, full_name, avatar_url, is_verified)
    `)
    .eq('created_by', profile.id)
    .eq('status', 'PUBLISHED')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  const totalCollections = collections?.length || 0;
  const whatsappUrl = profile.phone_number
    ? `https://api.whatsapp.com/send?phone=${profile.phone_number.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Halo ${profile.full_name}, saya melihat galeri koleksi Anda di Rumah Pusaka Banyumas.`)}`
    : null;

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB] pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Navigasi Kembali */}
      <div>
        <Link
          href="/koleksi"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] hover:underline uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Utama</span>
        </Link>
      </div>

      {/* HEADER PROFIL KOLEKTOR */}
      <section className="p-8 rounded-3xl border border-[#D4AF37]/30 bg-[#121212] relative overflow-hidden shadow-2xl">
        {/* Hiasan Aksen Garis Emas */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#1A1A1A] border-2 border-[#D4AF37] flex items-center justify-center overflow-hidden shrink-0 shadow-2xl relative">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-14 h-14 text-[#D4AF37]" />
            )}
          </div>

          {/* Info Identitas */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap mb-1">
                <h1 className="text-2xl sm:text-4xl font-serif text-[#F5F2EB] font-bold">
                  {profile.full_name}
                </h1>
                {profile.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Collector</span>
                  </span>
                )}
              </div>
              <p className="text-sm font-mono text-[#D4AF37]">
                @{profile.username}
              </p>
            </div>

            {profile.bio && (
              <p className="text-xs sm:text-sm text-[#F5F2EB]/80 leading-relaxed max-w-2xl font-light">
                {profile.bio}
              </p>
            )}

            {/* Metadata Tambahan */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-[#F5F2EB]/60 pt-2 border-t border-white/10">
              {profile.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>{profile.location}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                <span><strong>{totalCollections}</strong> Koleksi Dipublikasikan</span>
              </div>
            </div>

            {/* Tombol Kontak */}
            <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Diskusi via WhatsApp</span>
                </a>
              )}

              {profile.instagram_handle && (
                <a
                  href={`https://instagram.com/${profile.instagram_handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 text-[#F5F2EB] rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Globe className="w-4 h-4 text-[#D4AF37]" />
                  <span>@{profile.instagram_handle.replace('@', '')}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* GALERI KOLEKSI KOLEKTOR */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-serif text-2xl font-bold">
              Galeri Barang Antik & Pusaka
            </h2>
          </div>
          <span className="text-xs text-[#F5F2EB]/60">
            {totalCollections} Artefak
          </span>
        </div>

        {collections && collections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((item: any) => (
              <CollectionCard key={item.id} item={item as PublicCollectionItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#121212] border border-white/10 rounded-2xl space-y-2">
            <p className="text-sm font-serif text-[#D4AF37]">
              Belum Ada Koleksi Publik
            </p>
            <p className="text-xs text-[#F5F2EB]/60">
              Kolektor ini belum mempublikasikan barang antik ke galeri publik.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}