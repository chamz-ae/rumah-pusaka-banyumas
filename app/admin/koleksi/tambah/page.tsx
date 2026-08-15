'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CollectionForm from '@/components/admin/CollectionForm';

export default function AdminAddCollectionPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (formData: any) => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('Sesi Anda telah berakhir, silakan login kembali.');
      setLoading(false);
      return;
    }

    try {
      // 1. Generate Kode Koleksi & Slug
      const code = `RPB-PUSAKA-${Date.now().toString().slice(-4)}`;
      const slug = `${formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')}-${Date.now().toString().slice(-4)}`;

      // 2. Insert Koleksi
      const { data: collection, error: colError } = await supabase
        .from('collections')
        .insert({
          collection_code: code,
          title: formData.title,
          slug: slug,
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
          created_by: user.id,
        })
        .select()
        .single();

      if (colError) throw colError;

      // 3. Insert Relasi Ricikan
      if (formData.ricikan_ids && formData.ricikan_ids.length > 0) {
        const ricikanInserts = formData.ricikan_ids.map((rId: string) => ({
          collection_id: collection.id,
          ricikan_id: rId,
        }));
        await supabase.from('collection_ricikan').insert(ricikanInserts);
      }

      // 4. Upload Foto ke Supabase Storage & Database
      if (formData.images && formData.images.length > 0) {
        for (let i = 0; i < formData.images.length; i++) {
          const file = formData.images[i];
          if (typeof file === 'string') continue;

          const fileExt = file.name.split('.').pop();
          const fileName = `${collection.id}/${Date.now()}_${i}.${fileExt}`;

          const { error: uploadErr } = await supabase.storage
            .from('collection-images')
            .upload(fileName, file);

          if (!uploadErr) {
            const {
              data: { publicUrl },
            } = supabase.storage
              .from('collection-images')
              .getPublicUrl(fileName);

            await supabase.from('collection_images').insert({
              collection_id: collection.id,
              image_url: publicUrl,
              storage_path: fileName,
              is_primary: i === 0,
            });
          }
        }
      }

      alert('Koleksi berhasil ditambahkan oleh Admin!');
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan koleksi');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-serif text-[#D4AF37] font-bold">
          Pendokumentasian Artefak Pusaka Baru (Admin)
        </h1>
        <p className="text-xs text-[#F5F2EB]/60 mt-1">
          Isikan spesifikasi dan identitas pusaka sesuai catatan arsip resmi museum.
        </p>
      </div>

      <CollectionForm
        onSubmit={handleSubmit}
        isLoading={loading}
        isSubmitting={loading}
      />
    </div>
  );
}