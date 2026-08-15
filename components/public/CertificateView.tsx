'use client';

import { useState, useEffect } from 'react';
import { Award, Landmark, CheckCircle2, Printer } from 'lucide-react';

interface CertificateProps {
  collection: {
    id: string;
    title: string;
    collection_code: string;
    verification_code: string;
    created_at: string;
    estimated_period?: string | null;
    origin?: string | null;
    material?: string | null;
    luk?: number | null;
    category?: { name: string } | null;
    dhapur?: { name: string } | null;
    collector?: {
      full_name: string;
      username: string;
      is_verified?: boolean;
    } | null;
    images?: { image_url: string; is_primary?: boolean }[] | null;
  };
}

export default function CertificateView({ collection }: CertificateProps) {
  const [originUrl, setOriginUrl] = useState('');

  useEffect(() => {
    // Deteksi Host URL secara Dinamis (localhost atau domain live)
    if (typeof window !== 'undefined') {
      setOriginUrl(window.location.origin);
    }
  }, []);

  const primaryImage =
    collection.images?.find((img) => img.is_primary)?.image_url ||
    collection.images?.[0]?.image_url ||
    '/images/og-default.jpg';

  const categoryName = Array.isArray(collection.category)
    ? (collection.category as any)[0]?.name
    : collection.category?.name;

  const dhapurName = Array.isArray(collection.dhapur)
    ? (collection.dhapur as any)[0]?.name
    : collection.dhapur?.name;

  // DYNAMIC TARGET URL QR CODE (Otomatis menyesuaikan domain/localhost)
  const targetVerificationUrl = `${originUrl || 'http://localhost:3000'}/verifikasi/${collection.verification_code}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    targetVerificationUrl
  )}`;

  return (
    <div className="space-y-6">
      {/* Tombol Cetak / Print */}
      <div className="flex justify-end print:hidden">
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Sertifikat / Simpan PDF</span>
        </button>
      </div>

      {/* BINGKAI EMAS SERTIFIKAT */}
      <div className="bg-[#121212] print:bg-white print:text-black text-[#F5F2EB] border-4 border-[#D4AF37] print:border-[#B8860B] p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-2xl max-w-4xl mx-auto space-y-8 font-serif">
        <div className="absolute inset-2 border border-[#D4AF37]/40 print:border-[#B8860B]/40 rounded-2xl pointer-events-none" />

        {/* HEADER */}
        <div className="text-center space-y-3 relative z-10 border-b border-[#D4AF37]/30 print:border-black/20 pb-6">
          <div className="flex items-center justify-center gap-2 text-[#D4AF37] print:text-[#8B6508]">
            <Landmark className="w-8 h-8" />
            <span className="text-xs uppercase font-mono tracking-[0.3em] font-bold">
              RUMAH PUSAKA BANYUMAS HERITAGE ARCHIVES
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold uppercase tracking-wider text-[#D4AF37] print:text-[#8B6508]">
            Sertifikat Keaslian Digital
          </h1>
          <p className="text-xs italic text-[#F5F2EB]/70 print:text-black/70 font-sans">
            Certificate of Cultural Heritage Authenticity & Archival Registration
          </p>

          <div className="inline-block bg-[#D4AF37]/10 print:bg-yellow-100 border border-[#D4AF37]/40 print:border-yellow-600 px-4 py-1 rounded-full text-xs font-mono font-bold text-[#D4AF37] print:text-black">
            NO. REG: {collection.verification_code}
          </div>
        </div>

        {/* SPESIFIKASI */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          <div className="md:col-span-5 flex flex-col items-center gap-3">
            <div className="w-full aspect-[3/4] bg-black rounded-2xl border-2 border-[#D4AF37]/50 print:border-black overflow-hidden shadow-xl">
              <img
                src={primaryImage}
                alt={collection.title}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[11px] font-mono text-[#D4AF37] print:text-black font-semibold">
              KODE ARSIP: {collection.collection_code}
            </span>
          </div>

          <div className="md:col-span-7 space-y-4 text-xs font-sans">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] print:text-[#8B6508] font-mono font-bold block">
                Nama Pusaka / Artefak
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F5F2EB] print:text-black">
                {collection.title}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white/5 print:bg-gray-100 border border-white/10 print:border-gray-300">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] print:text-gray-700 font-bold block">KATEGORI</span>
                <span className="font-semibold">{categoryName || 'Pusaka'}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] print:text-gray-700 font-bold block">DHAPUR</span>
                <span className="font-semibold">{dhapurName || 'Tidak Ditentukan'}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] print:text-gray-700 font-bold block">ESTIMASI ERA</span>
                <span className="font-semibold">{collection.estimated_period || 'Tangguh Unspecified'}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] print:text-gray-700 font-bold block">JUMLAH LUK</span>
                <span className="font-semibold">{collection.luk ? `Luk ${collection.luk}` : 'Lurus (0 Luk)'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#D4AF37]/10 print:bg-amber-50 border border-[#D4AF37]/30 print:border-amber-300 space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-[#D4AF37] print:text-amber-900 block">
                DIKOLEKSI OLEH (REGISTERED OWNER)
              </span>
              <div className="font-bold text-sm text-[#F5F2EB] print:text-black flex items-center gap-1.5">
                <span>{collection.collector?.full_name || 'Koleksi Museum'}</span>
                {collection.collector?.is_verified && (
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] print:text-amber-700 inline" />
                )}
              </div>
              <span className="text-[10px] text-[#F5F2EB]/60 print:text-gray-600 block">
                Terdaftar di Galeri Publik: @{collection.collector?.username || 'museum_official'}
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER & DYNAMIC QR CODE */}
        <div className="pt-6 border-t border-[#D4AF37]/30 print:border-black/20 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative z-10">
          <div className="sm:col-span-7 space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[#D4AF37] print:text-amber-800">
              <Award className="w-5 h-5" />
              <span className="text-xs font-serif font-bold uppercase">
                Dewan Kurator Museum Digital
              </span>
            </div>
            <p className="text-[11px] font-sans text-[#F5F2EB]/70 print:text-gray-700 leading-relaxed font-light">
              Menyatakan bahwa spesifikasi artefak di atas telah dicatat dalam register Inventarisasi Tosan Aji & Warisan Budaya Jawa Rumah Pusaka Banyumas.
            </p>
            <div className="text-[10px] font-mono text-[#D4AF37] print:text-black pt-1">
              Tanggal Terbit Sertifikat: {new Date(collection.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="sm:col-span-5 flex flex-col items-center justify-center space-y-2 border-t sm:border-t-0 sm:border-l border-white/10 print:border-gray-300 pt-4 sm:pt-0">
            <div className="w-24 h-24 p-1.5 bg-white rounded-xl border-2 border-[#D4AF37] shadow-md">
              <img
                src={qrApiUrl}
                alt="QR Code Verification"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[9px] font-mono uppercase text-[#D4AF37] print:text-black tracking-wider text-center">
              Pindai QR untuk Verifikasi Keaslian
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}