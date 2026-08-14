import Link from 'next/link';
import { Landmark, Sparkles, Compass } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-[#080808] text-[#F5F2EB] border-t border-[#D4AF37]/20 relative overflow-hidden">
      {/* Ornamen Garis Aksen Emas */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Kolom 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/40">
                <Landmark className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <span className="font-serif text-lg text-[#D4AF37] font-bold tracking-wide block">
                  Rumah Pusaka Banyumas
                </span>
                <span className="text-[10px] text-[#F5F2EB]/50 uppercase tracking-[0.2em] block">
                  Digital Collection Archive
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#F5F2EB]/70 leading-relaxed max-w-md">
              "Warisan yang Dirawat, Sejarah yang Diingat." Mendedikasikan pendokumentasian, pelestarian, dan penyebarluasan wawasan pustaka pusaka budaya Jawa khususnya di wilayah Banyumas dengan standar ilmiah arsip museum.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-[11px] text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Digital Museum & Heritage Database</span>
            </div>
          </div>

          {/* Kolom 2: Navigasi Utama */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-semibold text-[#D4AF37] uppercase tracking-wider border-b border-white/10 pb-2">
              Navigasi Museum
            </h3>
            <ul className="space-y-2 text-xs text-[#F5F2EB]/70">
              <li>
                <Link href="/" className="hover:text-[#D4AF37] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/koleksi" className="hover:text-[#D4AF37] transition-colors">
                  Jelajahi Koleksi
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-[#D4AF37] transition-colors">
                  Tentang Rumah Pusaka
                </Link>
              </li>
              <li>
                <Link href="/arsip" className="hover:text-[#D4AF37] transition-colors">
                  Arsip Digital
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kategori Pusaka */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-semibold text-[#D4AF37] uppercase tracking-wider border-b border-white/10 pb-2">
              Klasifikasi Utama
            </h3>
            <ul className="space-y-2 text-xs text-[#F5F2EB]/70">
              <li>
                <Link href="/koleksi/keris" className="hover:text-[#D4AF37] transition-colors">
                  Koleksi Keris Jawa
                </Link>
              </li>
              <li>
                <Link href="/koleksi/tombak" className="hover:text-[#D4AF37] transition-colors">
                  Koleksi Tombak Pusaka
                </Link>
              </li>
              <li>
                <Link href="/koleksi/pedang" className="hover:text-[#D4AF37] transition-colors">
                  Koleksi Pedang Jawa
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#F5F2EB]/50">
          <p>© {new Date().getFullYear()} Rumah Pusaka Banyumas. Seluruh Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-1 text-[#D4AF37]/60">
            <Compass className="w-3.5 h-3.5" />
            <span>Museum Heritage Preserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}