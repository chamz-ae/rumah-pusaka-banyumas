import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, BookOpen, Shield, Compass, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Primbon Pusaka & Filosofi Tosan Aji — Rumah Pusaka Banyumas',
  description: 'Kumpulan pengetahuan tradisional, filosofi, pamor, dan tata cara perawatan pusaka leluhur Jawa.',
};

export default function PrimbonPusakaPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB] pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      
      {/* Tombol Kembali & Header */}
      <div className="space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#D4AF37] hover:underline font-mono">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kearifan Tradisional Nusantara</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#D4AF37] font-bold">
            Primbon Pusaka & Filosofi
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F2EB]/70 leading-relaxed font-light">
            Menyelami nilai luhur, simbol estetika, serta tatanan spiritual di balik warisan tosan aji Keris, Tombak, dan Pedang Jawa.
          </p>
        </div>
      </div>

      {/* Konten Utama Primbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Kartu 1: Filosofi Dhapur */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-[#D4AF37]/20 space-y-4 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-[#D4AF37]">Filosofi Bentuk (Dhapur)</h2>
          <p className="text-xs text-[#F5F2EB]/70 leading-relaxed">
            Dhapur merupakan bentuk atau dapur fisik dari sebilah pusaka. Setiap lekukan, jumlah luk, dan struktur bilah memiliki simbolisasi doa serta harapan hidup dari sang empu pembuatnya bagi pemilik di masa lampau.
          </p>
          <ul className="space-y-2 text-xs text-[#F5F2EB]/80 pt-2 border-t border-white/5">
            <li className="flex items-center gap-2">🔹 Keris Luk 3, 5, atau 7 melambangkan tatanan spiritual tertentu.</li>
            <li className="flex items-center gap-2">🔹 Dapur Leres (lurus) menyimbolkan keteguhan hati dan kejujuran.</li>
          </ul>
        </div>

        {/* Kartu 2: Makna Pamor */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-[#D4AF37]/20 space-y-4 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-[#D4AF37]">Goresan & Motif (Pamor)</h2>
          <p className="text-xs text-[#F5F2EB]/70 leading-relaxed">
            Pamor adalah gambaran garis atau corak putih pada permukaan bilah pusaka yang terbentuk dari teknik pamor tempaan logam. Dalam primbon, motif pamor sering dikaitkan dengan tuah kerezekian, kewibawaan, dan keselamatan.
          </p>
          <ul className="space-y-2 text-xs text-[#F5F2EB]/80 pt-2 border-t border-white/5">
            <li className="flex items-center gap-2">🔹 Pamor Wos Wutah melambangkan kelimpahan rezeki.</li>
            <li className="flex items-center gap-2">🔹 Pamor Kulit Semangka menyimbolkan kemudahan pergaulan.</li>
          </ul>
        </div>

        {/* Kartu 3: Perawatan Tradisional (Jamasan) */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-[#D4AF37]/20 space-y-4 shadow-xl md:col-span-2">
          <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-lg font-bold text-[#D4AF37]">Tata Laksana Perawatan (Jamasan)</h2>
          <p className="text-xs text-[#F5F2EB]/70 leading-relaxed">
            Perawatan pusaka atau jamasan bukan sekadar membersihkan fisik besi dari korosi, melainkan bentuk penghormatan dan pelestarian warisan budaya leluhur. Proses ini menggunakan minyak khusus dan jeruk nipis untuk menjaga ketahanan bilah secara tradisional.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/5 text-xs text-[#F5F2EB]/80">
            <div className="p-3 bg-[#1A1A1A] rounded-xl border border-white/5">
              <span className="font-bold text-[#D4AF37] block mb-1">1. Pembersihan Fisik</span>
              <span>Menghilangkan karat dengan warangan atau jeruk nipis secara hati-hati.</span>
            </div>
            <div className="p-3 bg-[#1A1A1A] rounded-xl border border-white/5">
              <span className="font-bold text-[#D4AF37] block mb-1">2. Pengolesan Minyak</span>
              <span>Melumisi bilah dengan minyak non-alkohol agar terhindar dari kelembapan.</span>
            </div>
            <div className="p-3 bg-[#1A1A1A] rounded-xl border border-white/5">
              <span className="font-bold text-[#D4AF37] block mb-1">3. Penyimpanan</span>
              <span>Menyimpan bilah di tempat kering dengan suhu terjaga.</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}