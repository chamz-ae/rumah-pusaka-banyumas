import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Edit3, Eye, Trash2, ImageOff, Award } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const revalidate = 0;

export default async function MemberCollectionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  async function deleteCollection(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const db = await createClient();
    await db
      .from('collections')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    revalidatePath('/member/koleksi');
  }

  const { data: collections } = await supabase
    .from('collections')
    .select(`
      id,
      collection_code,
      verification_code,
      title,
      slug,
      status,
      created_at,
      category:categories(name),
      images:collection_images(image_url, is_primary)
    `)
    .eq('created_by', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-serif text-[#D4AF37] font-bold">
            Koleksi Saya
          </h1>
          <p className="text-xs text-[#F5F2EB]/60 mt-1">
            Daftar seluruh barang antik & pusaka yang telah Anda unggah.
          </p>
        </div>

        <Link
          href="/member/koleksi/tambah"
          className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Baru</span>
        </Link>
      </div>

      {collections && collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((item: any) => {
            const cover =
              item.images?.find((img: any) => img.is_primary)?.image_url ||
              item.images?.[0]?.image_url;

            const categoryObj = item.category as any;
            const categoryName = Array.isArray(categoryObj)
              ? categoryObj[0]?.name
              : categoryObj?.name;

            return (
              <div
                key={item.id}
                className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-black/60 flex items-center justify-center overflow-hidden">
                    {cover ? (
                      <img
                        src={cover}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-[#F5F2EB]/30">
                        <ImageOff className="w-8 h-8" />
                        <span className="text-[10px] uppercase tracking-wider">
                          Belum Ada Foto
                        </span>
                      </div>
                    )}

                    <span
                      className={`absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-full uppercase font-bold tracking-wider backdrop-blur-md ${
                        item.status === 'PUBLISHED'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] text-[#D4AF37] uppercase font-mono tracking-wider">
                      {item.collection_code} • {categoryName || 'Pusaka'}
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#F5F2EB] line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 pt-3 border-t border-white/10 mt-2 flex items-center justify-between gap-2 bg-white/[0.01]">
                  <div className="flex items-center gap-1">
                    {item.status === 'PUBLISHED' && (
                      <Link
                        href={`/koleksi/${item.slug}`}
                        target="_blank"
                        className="p-2 text-[#F5F2EB]/60 hover:text-[#D4AF37] transition-colors rounded-lg hover:bg-white/5"
                        title="Lihat Publik"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}

                    <Link
                      href={`/member/koleksi/${item.id}/edit`}
                      className="p-2 text-[#F5F2EB]/60 hover:text-[#D4AF37] transition-colors rounded-lg hover:bg-white/5"
                      title="Edit Data Pusaka"
                    >
                      <Edit3 className="w-4 h-4 text-[#D4AF37]" />
                    </Link>

                    <Link
                      href={`/member/koleksi/${item.id}/sertifikat`}
                      className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors rounded-lg border border-[#D4AF37]/30 flex items-center gap-1 text-[11px] font-bold"
                      title="Cetak Sertifikat Digital"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Sertifikat</span>
                    </Link>
                  </div>

                  <form action={deleteCollection}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      className="p-2 text-red-400/60 hover:text-red-400 transition-colors rounded-lg hover:bg-red-950/30"
                      title="Hapus Koleksi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#121212] border border-white/10 rounded-2xl space-y-3">
          <p className="text-xs text-[#F5F2EB]/60">
            Belum ada barang antik yang tersimpan di galeri Anda.
          </p>
          <Link
            href="/member/koleksi/tambah"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider rounded-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Koleksi Pertama</span>
          </Link>
        </div>
      )}
    </div>
  );
}