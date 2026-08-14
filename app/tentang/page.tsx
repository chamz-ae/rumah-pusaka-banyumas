import { Metadata } from 'next';
import Link from 'next/link';
import {
  Landmark,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Scroll,
  Compass,
  ArrowRight,
  Target,
  Award,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tentang Rumah Pusaka Banyumas — Visi & Misi Pelestarian',
  description:
    'Profil, visi, misi, dan latar belakang pendokumentasian warisan budaya Tosan Aji Keris, Tombak, dan Pedang Jawa di Rumah Pusaka Banyumas.',
};

export default function AboutPage() {
  const pillars = [
    {
      icon: BookOpen,
      title: 'Pendokumentasian Ilmiah',
      desc: 'Mencatat spesifikasi fisik, dhapur, luk, pamor, dan ricikan dengan ketelitian kuratorial berbasis rujukan pustaka resmi.',
    },
    {
      icon: ShieldCheck,
      title: 'Preservasi & Edukasi',
      desc: 'Merawat fisik artefak sekaligus menyebarluaskan pengetahuan luhur tosan aji kepada masyarakat luas dan generasi muda.',
    },
    {
      icon: Target,
      title: 'Aksesibilitas Digital',
      desc: 'Membuka akses perpustakaan arsip museum secara terbuka, cepat, dan modern tanpa batasan jarak geografis.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB] pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* HERO / HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-[0.2em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Profil & Visi Museum</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif text-[#D4AF37] font-bold leading-tight">
          Rumah Pusaka Banyumas
        </h1>

        <p className="text-base sm:text-xl font-serif text-[#F5F2EB]/90 italic font-light">
          "Warisan yang Dirawat, Sejarah yang Diingat."
        </p>

        <p className="text-xs sm:text-sm text-[#F5F2EB]/70 leading-relaxed max-w-2xl mx-auto pt-2">
          Rumah Pusaka Banyumas berdiri sebagai wadah pengarsipan dan pendokumentasian digital untuk seni warisan tosan aji Jawa khususnya di wilayah Banyumas.
        </p>
      </div>

      {/* SEKSI NARASI / LATAR BELAKANG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
        <div className="lg:col-span-6 space-y-5">
          <div className="p-3 w-fit rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
            <Landmark className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#D4AF37]">
            Latar Belakang Pendirian
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-[#F5F2EB]/80 leading-relaxed font-light">
            <p>
              Tosan aji Keris, Tombak, dan Pedang Jawa bukan sekadar senjata tajam tradisional, melainkan mahakarya seni tempa besi, pengetahuan metalurgi purba, serta pengejawantahan filosofi hidup luhur masyarakat Nusantara.
            </p>
            <p>
              Seiring berkembangnya zaman, banyak catatan penting mengenai keragaman dhapur dan ricikan pusaka yang tersebar atau belum terinventarisasi secara ilmiah. Rumah Pusaka Banyumas hadir untuk memajukan pengarsipan digital berstandar museum.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 p-8 rounded-2xl border border-[#D4AF37]/20 bg-[#121212] space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          <div className="flex items-center gap-3 text-[#D4AF37] border-b border-white/10 pb-4">
            <Scroll className="w-5 h-5" />
            <h3 className="font-serif text-lg font-bold">Komitmen Kuratorial</h3>
          </div>
          <ul className="space-y-3 text-xs text-[#F5F2EB]/80 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="text-[#D4AF37] font-bold">✓</span>
              <span>Setiap artefak didokumentasikan lengkap dengan fotografi resolusi tinggi.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#D4AF37] font-bold">✓</span>
              <span>Klasifikasi dhapur dan ricikan diverifikasi berdasarkan rujukan pakar dan literatur klasik.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#D4AF37] font-bold">✓</span>
              <span>Menjaga keterbukaan informasi bagi akademisi, peneliti, maupun kolektor budaya.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* SEKSI PILAR UTAMA */}
      <div className="mb-20 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.2em]">
            Prinsip Kerja
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#D4AF37]">
            Tiga Pilar Pelestarian
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl border border-white/10 bg-[#121212] hover:border-[#D4AF37]/50 transition-all space-y-4 group"
              >
                <div className="p-3 w-fit rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#F5F2EB]/60 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="p-8 sm:p-12 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-b from-[#121212] to-black text-center max-w-3xl mx-auto space-y-6 shadow-2xl">
        <Compass className="w-10 h-10 text-[#D4AF37] mx-auto" />
        <h2 className="text-2xl sm:text-3xl font-serif text-[#D4AF37]">
          Jelajahi Arsip Museum Digital
        </h2>
        <p className="text-xs sm:text-sm text-[#F5F2EB]/70 max-w-xl mx-auto leading-relaxed">
          Saksikan dokumentasi koleksi Keris, Tombak, dan Pedang Jawa yang telah dipublikasikan secara kuratorial.
        </p>
        <div>
          <Link
            href="/koleksi"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-[0.15em] rounded-lg transition-all shadow-xl"
          >
            <span>Masuki Katalog Koleksi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}