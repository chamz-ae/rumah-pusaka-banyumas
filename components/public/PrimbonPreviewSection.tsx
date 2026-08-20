import Link from 'next/link';
import { ArrowRight, Sparkles, Compass, BookOpen, Shield } from 'lucide-react';

export default function PrimbonPreviewSection() {
  const highlights = [
    {
      title: 'Filosofi Dhapur',
      desc: 'Makna lekukan, jumlah luk, dan bentuk bilah pusaka warisan.',
      icon: Compass,
    },
    {
      title: 'Makna Pamor',
      desc: 'Corak garis dan simbol tuah pada permukaan bilah besi.',
      icon: BookOpen,
    },
    {
      title: 'Perawatan Jamasan',
      desc: 'Tata cara tradisional merawat ketahanan dan kebersihan pusaka.',
      icon: Shield,
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#D4AF37]/20 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] sm:text-xs uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kearifan Tradisional</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#D4AF37] font-bold">Primbon & Filosofi Pusaka</h2>
        </div>
        <Link
          href="/primbon"
          className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline font-bold uppercase tracking-wider"
        >
          <span>Baca Selengkapnya</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid Kartu Ringkasan Primbon untuk Mobile & Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {highlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-[#121212] border border-white/5 hover:border-[#D4AF37]/40 transition-all shadow-lg space-y-3">
              <div className="w-9 h-9 rounded-xl bg-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-sm font-bold text-[#F5F2EB]">{item.title}</h3>
              <p className="text-xs text-[#F5F2EB]/60 leading-relaxed font-light">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}