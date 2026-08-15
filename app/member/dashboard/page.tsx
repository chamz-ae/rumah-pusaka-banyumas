import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  Layers,
  CheckCircle,
  Clock,
  Plus,
  User,
  ExternalLink,
} from 'lucide-react';

export const revalidate = 0;

export default async function MemberDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch statistik milik user ini
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username, is_verified')
    .eq('id', user.id)
    .single();

  const { data: userCollections } = await supabase
    .from('collections')
    .select('id, title, status, created_at, images:collection_images(image_url, is_primary)')
    .eq('created_by', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  const total = userCollections?.length || 0;
  const published = userCollections?.filter((c) => c.status === 'PUBLISHED').length || 0;
  const draft = userCollections?.filter((c) => c.status === 'DRAFT').length || 0;

  return (
    <div className="space-y-8">
      {/* Header Member */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-[#D4AF37]/30 bg-[#121212]">
        <div>
          <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
            Selamat Datang,
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#F5F2EB] font-bold">
            {profile?.full_name || 'Kolektor'} {profile?.is_verified && '🛡️'}
          </h1>
          <p className="text-xs text-[#F5F2EB]/60 mt-1">
            @{profile?.username} • Kelola koleksi barang antik dan pusaka milik Anda di sini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/member/koleksi/tambah"
            className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Koleksi</span>
          </Link>
          {profile?.username && (
            <Link
              href={`/kolektor/${profile.username}`}
              target="_blank"
              className="px-4 py-2.5 bg-white/5 border border-white/10 hover:border-[#D4AF37] text-[#D4AF37] font-semibold text-xs rounded-lg transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Lihat Profil Publik</span>
            </Link>
          )}
        </div>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl border border-white/10 bg-[#121212] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#F5F2EB]">{total}</div>
            <div className="text-xs text-[#F5F2EB]/60">Total Koleksi Saya</div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-[#121212] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-950/40 text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#F5F2EB]">{published}</div>
            <div className="text-xs text-[#F5F2EB]/60">Status Published</div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/10 bg-[#121212] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-950/40 text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#F5F2EB]">{draft}</div>
            <div className="text-xs text-[#F5F2EB]/60">Status Draft</div>
          </div>
        </div>
      </div>

      {/* Koleksi Terbaru */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#121212] space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="font-serif text-lg text-[#D4AF37]">Koleksi Terbaru</h2>
          <Link
            href="/member/koleksi"
            className="text-xs text-[#D4AF37] hover:underline uppercase tracking-wider font-semibold"
          >
            Kelola Semua
          </Link>
        </div>

        {userCollections && userCollections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {userCollections.slice(0, 3).map((item) => {
              const cover =
                item.images?.find((img: any) => img.is_primary)?.image_url ||
                item.images?.[0]?.image_url ||
                '/images/placeholder.jpg';

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-white/10 bg-[#1A1A1A] flex items-center gap-3"
                >
                  <img
                    src={cover}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h3 className="font-serif text-sm text-[#F5F2EB] truncate">
                      {item.title}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold inline-block mt-1 ${
                        item.status === 'PUBLISHED'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-[#F5F2EB]/40">
            Anda belum mengunggah koleksi barang antik. Klik tombol "Tambah Koleksi" untuk memulai.
          </div>
        )}
      </div>
    </div>
  );
}