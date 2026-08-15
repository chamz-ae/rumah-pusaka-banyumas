'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CollectionForm from '@/components/admin/CollectionForm';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MemberEditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchCollection = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from('collections')
        .select(`
          *,
          images:collection_images(*),
          ricikan_rel:collection_ricikan(ricikan_id)
        `)
        .eq('id', id)
        .eq('created_by', user.id)
        .single();

      if (data) {
        const ricikanIds = data.ricikan_rel?.map((r: any) => r.ricikan_id) || [];
        setInitialData({
          ...data,
          ricikan_ids: ricikanIds,
        });
      }
      setLoading(false);
    };

    fetchCollection();
  }, [id, supabase]);

  const handleSubmit = async (formData: any) => {
    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('Sesi Anda berakhir, silakan login kembali.');
      setSubmitting(false);
      return;
    }

    try {
      // 1. Update Data Utama Koleksi
      const { error: updateErr } = await supabase
        .from('collections')
        .update({
          title: formData.title,
          category_id: formData.category_id,
          type_id: formData.type_id || null,
          dhapur_id: formData.dhapur_id || null,
          luk: formData.luk ? parseInt(formData.luk) : null,
          material: formData.material || null,
          estimated_period: formData.estimated_period || null,
          origin: formData.origin || null,
          description: formData.description || null,
          historical_description: formData.historical_description || null,
          cultural_description: formData.cultural_description || null,
          status: formData.status || 'PUBLISHED',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('created_by', user.id);

      if (updateErr) throw new Error(`Gagal update data: ${updateErr.message}`);

      // 2. Sync Ricikan
      await supabase.from('collection_ricikan').delete().eq('collection_id', id);
      if (formData.ricikan_ids && formData.ricikan_ids.length > 0) {
        const ricikanInserts = formData.ricikan_ids.map((rId: string) => ({
          collection_id: id,
          ricikan_id: rId,
        }));
        await supabase.from('collection_ricikan').insert(ricikanInserts);
      }

      // 3. Upload Foto Baru jika ada
      if (formData.images && formData.images.length > 0) {
        const { data: existingImgs } = await supabase
          .from('collection_images')
          .select('id, is_primary')
          .eq('collection_id', id);

        const hasPrimary = existingImgs?.some((img) => img.is_primary) || false;

        for (let i = 0; i < formData.images.length; i++) {
          const file = formData.images[i];
          if (typeof file === 'string') continue;

          const fileExt = file.name.split('.').pop();
          const fileName = `${id}/${Date.now()}_${i}.${fileExt}`;

          const { error: uploadErr } = await supabase.storage
            .from('collection-images')
            .upload(fileName, file, { upsert: true });

          if (uploadErr) {
            throw new Error(`Gagal unggah foto ke Storage: ${uploadErr.message}`);
          }

          const {
            data: { publicUrl },
          } = supabase.storage
            .from('collection-images')
            .getPublicUrl(fileName);

          // PERBAIKAN: Menambahkan kolom storage_path
          const { error: imgDbErr } = await supabase
            .from('collection_images')
            .insert({
              collection_id: id,
              image_url: publicUrl,
              storage_path: fileName, 
              is_primary: !hasPrimary && i === 0,
            });

          if (imgDbErr) {
            throw new Error(`Gagal menyimpan tautan foto ke database: ${imgDbErr.message}`);
          }
        }
      }

      alert('Data dan foto pusaka berhasil diperbarui!');
      router.push('/member/koleksi');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui koleksi');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#D4AF37]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="text-center py-16 text-xs text-red-400">
        Data pusaka tidak ditemukan atau Anda tidak memiliki hak akses.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <Link
          href="/member/koleksi"
          className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Koleksi Saya</span>
        </Link>
        <h1 className="text-2xl font-serif text-[#D4AF37] font-bold">
          Edit Data Pusaka / Barang Antik
        </h1>
        <p className="text-xs text-[#F5F2EB]/60 mt-1">
          Perbarui spesifikasi fisik, catatan sejarah, atau foto koleksi Anda.
        </p>
      </div>

      <CollectionForm
        initialData={initialData}
        {...({
          onSubmit: handleSubmit,
          isLoading: submitting,
          isSubmitting: submitting,
        } as any)}
      />
    </div>
  );
}