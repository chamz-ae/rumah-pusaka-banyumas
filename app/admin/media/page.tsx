import { createClient } from '@/lib/supabase/server';
import { Image as ImageIcon, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export const revalidate = 0;

export default async function MediaLibraryPage() {
  const supabase = await createClient();

  // Server Action Hapus Foto dari DB
  async function deleteImage(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const db = await createClient();
    await db.from('collection_images').delete().eq('id', id);
    revalidatePath('/admin/media');
  }

  const { data: images } = await supabase
    .from('collection_images')
    .select(`
      id,
      image_url,
      created_at,
      collection:collections(title, slug)
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-[#F5F2EB]">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-serif text-[#D4AF37] font-bold">
          Media Library (Galeri Berkas)
        </h1>
        <p className="text-xs text-[#F5F2EB]/60 mt-1">
          Pantau seluruh file dokumentasi gambar pusaka yang telah tersimpan di Supabase Storage.
        </p>
      </div>

      {images && images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img: any) => {
            const col = Array.isArray(img.collection) ? img.collection[0] : img.collection;
            return (
              <div
                key={img.id}
                className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div className="relative aspect-square bg-black overflow-hidden">
                  <img
                    src={img.image_url}
                    alt="Foto Artefak"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-3 space-y-2">
                  <div className="text-[10px] text-[#D4AF37] font-serif truncate">
                    {col?.title || 'Artefak'}
                  </div>
                  <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
                    <a
                      href={img.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#F5F2EB]/60 hover:text-[#D4AF37] flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buka URL</span>
                    </a>
                    <form action={deleteImage}>
                      <input type="hidden" name="id" value={img.id} />
                      <button type="submit" className="text-red-400 hover:text-red-300 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#121212] border border-white/10 rounded-2xl text-xs text-[#F5F2EB]/40">
          Belum ada media foto yang diunggah ke perpustakaan digital.
        </div>
      )}
    </div>
  );
}