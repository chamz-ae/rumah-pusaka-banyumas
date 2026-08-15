import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RicikanHighlight() {
  // Contoh 6 Ricikan Utama dari PDF Source of Truth
  const sampleRicikan = [
    {
      name: 'Kembang Kacang',
      desc: 'Ricikan melengkung menyerupai tunas kembang kacang yang terletak pada gandhik.',
    },
    {
      name: 'Sogokan (Depan & Belakang)',
      desc: 'Alur lekukan memanjang di pangkal bilah yang menambah keindahan dan keseimbangan.',
    },
    {
      name: 'Ganja',
      desc: 'Bagian alas bilah keris yang menempel pada pesi, menjadi penopang struktur utama.',
    },
    {
      name: 'Ada-ada',
      desc: 'Peninggian berbentuk tulang di tengah-tengah bilah keris dari pangkal hingga pucuk.',
    },
    {
      name: 'Greneng',
      desc: 'Gerigi berbentuk huruf Jawa Dha atau Ron Dha pada bagian wadidang atau ganja.',
    },
    {
      name: 'Pesi',
      desc: 'Tangkai besi di bagian bawah bilah keris yang masuk ke dalam hulu atau gagang.',
    },
  ];

  return (
    <section className="py-20 bg-[#0A0A0A] border-y border-[#D4AF37]/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Anatomi & Struktur Bilah</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#D4AF37]">
            Mengenal Konsep Ricikan Pusaka
          </h2>
          <p className="text-xs sm:text-sm text-[#F5F2EB]/70 leading-relaxed">
            Ricikan adalah bagian-bagian detail anatomi yang membentuk karakter unik sebuah pusaka. Keberadaan kombinasi ricikan inilah yang menentukan identitas nama Dhapur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleRicikan.map((ric, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-white/10 bg-[#121212]/80 hover:border-[#D4AF37]/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors">
                  {ric.name}
                </h3>
              </div>
              <p className="text-xs text-[#F5F2EB]/60 leading-relaxed">
                {ric.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/ricikan"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] hover:underline uppercase tracking-wider"
          >
            <span>Pelajari Klasifikasi Ricikan Selengkapnya</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}