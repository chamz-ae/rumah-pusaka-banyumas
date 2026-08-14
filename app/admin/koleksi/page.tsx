'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  PlusCircle,
  Search,
  Trash2,
  Pencil,
  Library,
  Loader2,
} from 'lucide-react';

interface CollectionItem {
  id: string;
  collection_code: string;
  title: string;
  status: string;
  created_at: string;
  category: { name: string } | null;
  dhapur: { name: string } | null;
}

export default function AdminCollectionsListPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const supabase = createClient();

  const fetchCollections = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('collections')
        .select(`
          id,
          collection_code,
          title,
          status,
          created_at,
          category:categories(name),
          dhapur:dhapurs(name)
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'ALL') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCollections((data as any) || []);
    } catch (err) {
      console.error('Gagal mengambil data koleksi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [statusFilter]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus arsip "${title}"?`)) return;

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('collections')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      fetchCollections();
    } catch (err) {
      alert('Gagal menghapus data koleksi.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCollections = collections.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.collection_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-serif text-[#D4AF37]">
            Manajemen Koleksi Museum
          </h1>
          <p className="text-xs text-[#F5F2EB]/60 mt-1">
            Kelola inventarisasi, klasifikasi, galeri foto, dan status publikasi.
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

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#121212] p-4 rounded-xl border border-[#D4AF37]/20">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['ALL', 'PUBLISHED', 'DRAFT', 'PRIVATE'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-white/5 text-[#F5F2EB]/60 hover:bg-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#D4AF37]/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode atau nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-[#F5F2EB] placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Tabel Data */}
      <div className="border border-[#D4AF37]/20 bg-[#121212] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#D4AF37]">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-xs uppercase tracking-widest">Memuat Inventaris Museum...</span>
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="text-center py-16">
            <Library className="w-10 h-10 text-[#D4AF37]/40 mx-auto mb-3" />
            <p className="text-sm text-[#F5F2EB]/70">Tidak ada koleksi ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-[#D4AF37] uppercase tracking-wider font-medium border-b border-white/10">
                <tr>
                  <th className="p-3.5">Kode</th>
                  <th className="p-3.5">Nama Pusaka</th>
                  <th className="p-3.5">Kategori</th>
                  <th className="p-3.5">Dhapur</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#F5F2EB]/80">
                {filteredCollections.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-mono text-[#D4AF37]/80">{item.collection_code}</td>
                    <td className="p-3.5 font-medium text-[#F5F2EB]">{item.title}</td>
                    <td className="p-3.5">{item.category?.name || '-'}</td>
                    <td className="p-3.5">{item.dhapur?.name || '-'}</td>
                    <td className="p-3.5">
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
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Tombol Sunting & Galeri */}
                        <Link
                          href={`/admin/koleksi/${item.id}/edit`}
                          className="p-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] rounded transition-all"
                          title="Sunting & Kelola Galeri"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={deletingId === item.id}
                          className="p-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 rounded transition-all"
                          title="Hapus Arsip"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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