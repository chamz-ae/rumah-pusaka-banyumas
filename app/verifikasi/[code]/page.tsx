import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import CertificateView from '@/components/public/CertificateView';
import { ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Verifikasi Sertifikat ${code} — Rumah Pusaka Banyumas`,
    description: `Halaman verifikasi resmi sertifikat keaslian digital warisan pusaka no. ${code}`,
  };
}

export default async function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();

  // Fetch Artefak berdasarkan Kode Verifikasi
  const { data: collection } = await supabase
    .from('collections')
    .select(`
      *,
      category:categories(name),
      dhapur:dhapurs(name),
      images:collection_images(image_url, is_primary),
      collector:profiles(full_name, username, is_verified)
    `)
    .eq('verification_code', code.toUpperCase())
    .eq('status', 'PUBLISHED')
    .is('deleted_at', null)
    .maybeSingle();

  if (!collection) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB] pt-28 pb-24 px-4 max-w-2xl mx-auto flex flex-col items-center justify-center text-center space-y-6">
        <div className="p-4 rounded-full bg-red-950/60 border border-red-500/40 text-red-400">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-serif text-red-400 font-bold">
          Sertifikat Tidak Valid atau Tidak Ditemukan
        </h1>
        <p className="text-xs text-[#F5F2EB]/70 leading-relaxed">
          Nomor sertifikat <strong className="text-[#D4AF37] font-mono">{code}</strong> tidak terdaftar pada basis data arsip resmi Rumah Pusaka Banyumas.
        </p>
        <Link
          href="/koleksi"
          className="px-5 py-2.5 bg-[#D4AF37] text-black font-bold text-xs uppercase rounded-xl"
        >
          Kembali ke Katalog
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB] pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Banner Status Validasi Official */}
      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              VERIFIKASI RESMI TERKONFIRMASI ✅
            </div>
            <div className="text-[11px] opacity-80">
              Sertifikat ini terdaftar sah pada basis data arsip museum.
            </div>
          </div>
        </div>

        <Link
          href={`/koleksi/${collection.slug}`}
          className="px-4 py-2 bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/30 text-xs font-semibold text-white rounded-lg transition-all hidden sm:inline-block"
        >
          Lihat Halaman Artefak
        </Link>
      </div>

      <CertificateView collection={collection} />
    </main>
  );
}