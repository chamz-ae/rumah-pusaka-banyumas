import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  Library,
  GlobeCheck,
  FileClock,
  EyeOff,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Mengambil statistik hitungan dari database
  const [
    { count: totalCount },
    { count: publishedCount },
    { count: draftCount },
    { count: privateCount },
    { data: recentCollections },
  ] = await Promise.all([
    supabase.from('collections').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('collections').select('*', { count: 'exact', head: true }).eq('status', 'PUBLISHED').is('deleted_at', null),
    supabase.from('collections').select('*', { count: 'exact', head: true }).eq('status', 'DRAFT').is('deleted_at', null),
    supabase.from('collections').select('*', { count: 'exact', head: true }).eq('status', 'PRIVATE').is('deleted_at', null),
    supabase.from('collections').select('id, collection_code, title, status, created_at').is('deleted_at', null).order('created_at', { ascending: false }).limit(5),
  ]);

  const stats = [
    {
      title: 'Total Koleksi',
      value: totalCount || 0,
      icon: Library,
      color: 'border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/5',
    },
    {
      title: 'Published (Publik)',
      value: publishedCount || 0,
      icon: GlobeCheck,
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5',
    },
    {
      title: 'Draft (Konsep)',
      value: draftCount || 0,
      icon: FileClock,
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/5',
    },
    {
      title: 'Private (Internal)',
      value: privateCount || 0,
      icon: EyeOff,
      color: 'border-blue-500/40 text-blue-400 bg-blue-500/5',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-serif text-[#D4AF37]">
            Ringkasan Museum & Database
          </h1>
          <p className="text-xs text-[#F5F2EB]/60 mt-1">
            Pantau statistik koleksi pusaka dan aktivitas dokumentasi terbaru.
          </p>
        </div>
        <Link
          href="/admin/koleksi/tambah"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-medium text-xs uppercase tracking-wider rounded-lg transition-all shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Koleksi Baru</span>
        </Link>
      </div>

      {/* Grid Statistik Metrik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-xl border backdrop-blur-md ${stat.color} transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-[#F5F2EB]/70">
                  {stat.title}
                </span>
                <Icon className="w-5 h-5 opacity-80" />
              </div>
              <div className="text-3xl font-serif font-bold tracking-tight">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabel Koleksi Terbaru */}
      <div className="border border-[#D4AF37]/20 bg-[#121212] rounded-xl p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-serif text-[#D4AF37]">
              Dokumentasi Terbaru
            </h2>
            <p className="text-xs text-[#F5F2EB]/50">
              5 artefak pusaka yang baru ditambahkan ke sistem.
            </p>
          </div>
          <Link
            href="/admin/koleksi"
            className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!recentCollections || recentCollections.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
            <ShieldCheck className="w-10 h-10 text-[#D4AF37]/40 mx-auto mb-3" />
            <p className="text-sm text-[#F5F2EB]/70">
              Belum ada data koleksi yang tercatat.
            </p>
            <p className="text-xs text-[#F5F2EB]/40 mt-1">
              Mulai pendokumentasian pusaka dengan menekan tombol "Tambah Koleksi Baru".
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-[#D4AF37] uppercase tracking-wider font-medium border-b border-white/10">
                <tr>
                  <th className="p-3">Kode</th>
                  <th className="p-3">Nama Pusaka</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Tanggal Dibuat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#F5F2EB]/80">
                {recentCollections.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono text-[#D4AF37]/80">
                      {item.collection_code}
                    </td>
                    <td className="p-3 font-medium text-[#F5F2EB]">
                      {item.title}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          item.status === 'PUBLISHED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'DRAFT'
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-950 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#F5F2EB]/50">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}