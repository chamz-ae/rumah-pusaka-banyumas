import { createClient } from '@/lib/supabase/server';
import { Sparkles, Plus, Trash2 } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const revalidate = 0;

export default async function MasterRicikanPage() {
  const supabase = await createClient();

  // Server Action Tambah Ricikan Baru
  async function addRicikan(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const db = await createClient();
    await db.from('ricikan').insert({
      name,
      description,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    });

    revalidatePath('/admin/ricikan');
  }

  // Server Action Hapus Ricikan
  async function deleteRicikan(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const db = await createClient();
    await db.from('ricikan').delete().eq('id', id);

    revalidatePath('/admin/ricikan');
  }

  const { data: ricikanList } = await supabase.from('ricikan').select('*').order('name');

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-[#F5F2EB]">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-serif text-[#D4AF37] font-bold">
          Master Data Ricikan Bilah
        </h1>
        <p className="text-xs text-[#F5F2EB]/60 mt-1">
          Kelola entri komponen ricikan bilah (Sekar Kacang, Lambe Gajah, Pejetan, Gandik, dll).
        </p>
      </div>

      {/* Form Tambah Ricikan */}
      <form action={addRicikan} className="p-6 rounded-2xl border border-white/10 bg-[#121212] grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="space-y-1 sm:col-span-1">
          <label className="text-xs text-[#D4AF37] font-semibold">Nama Ricikan *</label>
          <input
            name="name"
            required
            placeholder="Contoh: Sekar Kacang"
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-[#D4AF37] outline-none"
          />
        </div>

        <div className="space-y-1 sm:col-span-1">
          <label className="text-xs text-[#D4AF37] font-semibold">Deskripsi Letak / Fungsi</label>
          <input
            name="description"
            placeholder="Contoh: Lengkungan di pangkal gandik"
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-[#D4AF37] outline-none"
          />
        </div>

        <button type="submit" className="py-2.5 bg-[#D4AF37] text-black font-bold text-xs uppercase rounded-lg hover:bg-[#C5A059] flex items-center justify-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Tambah Ricikan</span>
        </button>
      </form>

      {/* Tabel Ricikan */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A1A1A] text-[#D4AF37] uppercase font-mono">
            <tr>
              <th className="p-4">Nama Ricikan</th>
              <th className="p-4">Deskripsi</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {ricikanList?.map((r: any) => (
              <tr key={r.id} className="hover:bg-white/[0.02]">
                <td className="p-4 font-bold text-[#F5F2EB]">{r.name}</td>
                <td className="p-4 text-[#F5F2EB]/70">{r.description || '-'}</td>
                <td className="p-4 text-right">
                  <form action={deleteRicikan} className="inline">
                    <input type="hidden" name="id" value={r.id} />
                    <button type="submit" className="p-1.5 text-red-400 hover:bg-red-950/40 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}