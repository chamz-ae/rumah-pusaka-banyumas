import Link from 'next/link';
import { Compass, Landmark, Sparkles, Scroll } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0D0D0D]">
      {/* Visual Background Pattern & Overlay Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-[#0D0D0D]/80 to-[#0D0D0D] pointer-events-none" />
      
      {/* Subtle Ornament Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full border-x border-[#D4AF37]/10 pointer-events-none hidden sm:block" />

      <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10">
        {/* Top Heritage Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium uppercase tracking-[0.2em] shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Digital Museum & Heritage Archive</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        {/* Brand Icon & Main Title */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-gradient-to-b from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/40 shadow-2xl">
              <Landmark className="w-10 h-10 text-[#D4AF37]" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#D4AF37] tracking-wide leading-tight font-bold">
            Rumah Pusaka Banyumas
          </h1>

          <p className="text-lg sm:text-2xl font-serif text-[#F5F2EB]/90 italic tracking-wide max-w-2xl mx-auto font-light">
            "Warisan yang Dirawat, Sejarah yang Diingat."
          </p>
        </div>

        {/* Narrative Introductory Paragraph */}
        <p className="text-xs sm:text-sm text-[#F5F2EB]/70 leading-relaxed max-w-2xl mx-auto">
          Mendedikasikan ruang digital untuk mendokumentasikan, mengklasifikasikan, serta merawat pengetahuan luhur seputar seni tosan aji Keris, Tombak, dan Pedang Jawa. Selamat datang di perpustakaan digital warisan budaya Banyumas.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/koleksi"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-semibold text-xs uppercase tracking-[0.15em] rounded-lg transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Jelajahi Koleksi</span>
          </Link>

          <Link
            href="/tentang"
            className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-[#D4AF37]/40 text-[#F5F2EB] font-semibold text-xs uppercase tracking-[0.15em] rounded-lg transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <Scroll className="w-4 h-4 text-[#D4AF37]" />
            <span>Tentang Rumah Pusaka</span>
          </Link>
        </div>
      </div>
    </section>
  );
}