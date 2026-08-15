import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Sparkles, BookOpen, Layers, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Anatomi & Ricikan Pusaka — Rumah Pusaka Banyumas',
  description: 'Mengenal 23+ istilah bagian anatomi detail yang membentuk karakter dan identitas dhapur pusaka Jawa.',
};

export default async function RicikanPage() {
  const supabase = await createClient();
  const { data: dbRicikan } = await supabase.from('ricikan').select('*').order('name');

  // Fallback data lengkap sesuai standar dokumen pakem pusaka jika DB belum terisi penuh
  const defaultRicikan = [
    { name: 'Ada-ada', description: 'Peninggian berbentuk penampang penuangan/tulang di tengah-tengah bilah keris dari pangkal hingga pucuk.' },
    { name: 'Kruwingan', description: 'Alur lekukan memanjang di kanan dan kiri ada-ada yang membuat bilah menjadi lebih tipis dan ringan.' },
    { name: 'Lis-lisan', description: 'Garis pembatas tipis yang menyusuri sepanjang tepi bilah keris.' },
    { name: 'Gusen', description: 'Dataran sempit di tepi bilah di antara lis-lisan dan bagian tajam (landep).' },
    { name: 'Landep', description: 'Bagian tajam dari mata bilah pusaka.' },
    { name: 'Pudhak Sategal', description: 'Bentuk ornamen menyerupai tunas daun pudak pada bagian samping bilah.' },
    { name: 'Sogokan Depan', description: 'Alur lekukan vertikal di pangkal bilah bagian depan yang menambah keindahan dan keseimbangan.' },
    { name: 'Sogokan Belakang', description: 'Alur lekukan vertikal di pangkal bilah bagian belakang.' },
    { name: 'Janur', description: 'Bagian bilah di antara dua alur sogokan yang meruncing ke atas.' },
    { name: 'Tikel Alis', description: 'Lekukan melengkung di atas pejetan yang menyerupai bentuk alis mata.' },
    { name: 'Jenggot', description: 'Gerigi halus seperti janggut yang terletak di bawah kembang kacang.' },
    { name: 'Kembang Kacang', description: 'Ornamen ukiran melengkung menyerupai tunas kembang kacang pada bagian gandhik.' },
    { name: 'Jalen', description: 'Tonjolan kecil runcing di bawah kembang kacang.' },
    { name: 'Lambe Gajah', description: 'Lekukan menyerupai bibir gajah di bawah kembang kacang (bisa berjumlah satu atau dua).' },
    { name: 'Pejetan', description: 'Lekukan cekung sebesar ibu jari pada pangkal bilah di belakang gandhik.' },
    { name: 'Bungkul', description: 'Bentuk cembung seperti setengah bola pada pangkal bilah.' },
    { name: 'Ganja', description: 'Bagian alas bilah keris yang menempel pada pesi, menjadi penopang struktur utama.' },
    { name: 'Pesi', description: 'Tangkai besi silindris di bagian paling bawah bilah keris yang masuk ke dalam hulu/gagang.' },
    { name: 'Greneng', description: 'Gerigi berornamen berbentuk huruf Jawa (Dha / Ron Dha) pada bagian wadidang atau ganja.' },
    { name: 'Ron Dha Nunut', description: 'Variasi ornamen greneng menyerupai bentuk ukiran daun ron dha menumpang.' },
    { name: 'Sraweyan', description: 'Dataran landai melengkung di belakang sogokan menuju wadidang.' },
    { name: 'Wadidang', description: 'Bagian batas belakang pangkal bilah di atas ganja.' },
  ];

  const listData = dbRicikan && dbRicikan.length > 0 ? dbRicikan : defaultRicikan;

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB] pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ANATOMI & STRUKTUR BILAH</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#D4AF37] font-bold">
          Mengenal Konsep Ricikan Pusaka
        </h1>
        <p className="text-xs sm:text-sm text-[#F5F2EB]/70 leading-relaxed font-light">
          Ricikan adalah bagian-bagian detail anatomi yang membentuk karakter unik sebuah pusaka. Keberadaan kombinasi ricikan inilah yang menentukan identitas nama Dhapur.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listData.map((item: any, idx: number) => (
          <div
            key={item.id || idx}
            className="p-6 rounded-2xl border border-white/10 bg-[#121212] hover:border-[#D4AF37]/50 transition-all space-y-3 group shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <BookOpen className="w-4 h-4 text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors">
              {item.name}
            </h3>
            <p className="text-xs text-[#F5F2EB]/70 leading-relaxed font-light">
              {item.description || 'Komponen ricikan yang menjadi penentu pakem kelengkapan bilah tosan aji.'}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}