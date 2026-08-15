import { createClient } from '@/lib/supabase/server';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const revalidate = 0;

export default async function MasterDhapurPage() {
  const supabase = await createClient();

  // Server Action Tambah Dhapur Baru
  async function addDhapur(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const categoryId = formData.get('categoryId') as string;
    const luk = formData.get('luk') ? parseInt(formData.get('luk') as string) : null;

    const db = await createClient();
    await db.from('dhapurs').insert({
      name,
      category_id: categoryId,
      luk,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    });

    revalidatePath('/admin/dhapur');
  }

  // Server Action Hapus Dhapur
  async function deleteDhapur(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const db = await createClient();
    await db.from('dhapurs').delete().eq('id', id);

    revalidatePath('/admin/dhapur');
  }

  const { data: categories } = await supabase.from('categories').select('*').order('name');
  const { data: dhapurs } = await supabase
    .from('dhapurs')
    .select('*, category:categories(name)')
    .order('name');

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-[#F5F2EB]">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-serif text-[#D4AF37] font-bold">
          Master Data Dhapur Pusaka
        </h1>
        <p className="text-xs text-[#F5F2EB]/60 mt-1">
          Kelola entri pakem bentuk / dhapur keris, tombak, dan pedang Jawa.
        </p>
      </div>

      {/* Form Tambah Dhapur */}
      <form action={addDhapur} className="p-6 rounded-2xl border border-white/10 bg-[#121212] grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <div className="space-y-1 sm:col-span-1">
          <label className="text-xs text-[#D4AF37] font-semibold">Nama Dhapur *</label>
          <input
            name="name"
            required
            placeholder="Contoh: Nagasasra"
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-[#D4AF37] outline-none"
          />
        </div>

        <div className="space-y-1 sm:col-span-1">
          <label className="text-xs text-[#D4AF37] font-semibold">Kategori *</label>
          <select
            name="categoryId"
            required
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-[#D4AF37] outline-none"
          >
            <option value="">-- Pilih --</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1 sm:col-span-1">
          <label className="text-xs text-[#D4AF37] font-semibold">Jumlah Luk</label>
          <input
            name="luk"
            type="number"
            placeholder="0 jika Lurus"
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-[#D4AF37] outline-none"
          />
        </div>

        <button type="submit" className="py-2.5 bg-[#D4AF37] text-black font-bold text-xs uppercase rounded-lg hover:bg-[#C5A059] flex items-center justify-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Tambah Dhapur</span>
        </button>
      </form>

      {/* Tabel Dhapur */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A1A1A] text-[#D4AF37] uppercase font-mono">
            <tr>
              <th className="p-4">Nama Dhapur</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Luk</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {dhapurs?.map((d: any) => (
              <tr key={d.id} className="hover:bg-white/[0.02]">
                <td className="p-4 font-bold text-[#F5F2EB]">{d.name}</td>
                <td className="p-4 text-[#D4AF37]">{d.category?.name || '-'}</td>
                <td className="p-4">{d.luk !== null ? `${d.luk} Luk` : 'Lurus'}</td>
                <td className="p-4 text-right">
                  <form action={deleteDhapur} className="inline">
                    <input type="hidden" name="id" value={d.id} />
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