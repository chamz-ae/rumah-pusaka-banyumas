'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Upload,
  Trash2,
  Star,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export interface CollectionImage {
  id: string;
  collection_id: string;
  storage_path: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

interface ImageUploaderProps {
  collectionId: string;
  images: CollectionImage[];
  onImagesUpdated: () => void;
}

export default function ImageUploader({
  collectionId,
  images,
  onImagesUpdated,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingPrimaryId, setSettingPrimaryId] = useState<string | null>(null);

  const supabase = createClient();

  // Handler Upload Berkas Gambar ke Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMsg(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1. Validasi Tipe Berkas (MIME Type)
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          throw new Error(`Format file "${file.name}" tidak didukung. Gunakan JPG, PNG, atau WebP.`);
        }

        // 2. Validasi Ukuran Berkas (Maksimal 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`Ukuran file "${file.name}" melebihi batas maksimal 5MB.`);
        }

        // 3. Buat Nama File Unik di Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `collections/${collectionId}/${fileName}`;

        // 4. Upload ke Bucket "collection-images"
        const { error: uploadError } = await supabase.storage
          .from('collection-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // 5. Dapatkan URL Publik Gambar
        const { data: urlData } = supabase.storage
          .from('collection-images')
          .getPublicUrl(filePath);

        const isFirstImage = images.length === 0 && i === 0;

        // 6. Simpan Metadata Gambar ke Tabel collection_images
        const { error: dbError } = await supabase
          .from('collection_images')
          .insert({
            collection_id: collectionId,
            storage_path: filePath,
            image_url: urlData.publicUrl,
            alt_text: file.name,
            is_primary: isFirstImage,
            sort_order: images.length + i,
          });

        if (dbError) throw dbError;
      }

      onImagesUpdated();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengunggah gambar.');
    } finally {
      setUploading(false);
      // Reset input value
      e.target.value = '';
    }
  };

  // Handler Hapus Gambar
  const handleDeleteImage = async (imageId: string, storagePath: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto ini?')) return;

    setDeletingId(imageId);
    setErrorMsg(null);

    try {
      // 1. Hapus dari Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('collection-images')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // 2. Hapus dari Tabel collection_images
      const { error: dbError } = await supabase
        .from('collection_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      onImagesUpdated();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menghapus gambar.');
    } finally {
      setDeletingId(null);
    }
  };

  // Handler Set Foto Utama (Primary Image)
  const handleSetPrimary = async (imageId: string) => {
    setSettingPrimaryId(imageId);
    setErrorMsg(null);

    try {
      // 1. Reset semua gambar koleksi ini menjadi is_primary = false
      await supabase
        .from('collection_images')
        .update({ is_primary: false })
        .eq('collection_id', collectionId);

      // 2. Set gambar terpilih menjadi is_primary = true
      const { error } = await supabase
        .from('collection_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (error) throw error;

      onImagesUpdated();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengubah foto utama.');
    } finally {
      setSettingPrimaryId(null);
    }
  };

  return (
    <div className="p-6 rounded-xl border border-[#D4AF37]/20 bg-[#121212] space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-[#D4AF37]">
          <ImageIcon className="w-5 h-5" />
          <h2 className="font-serif text-base font-medium">Galeri Foto & Media Artefak</h2>
        </div>
        <span className="text-xs text-[#F5F2EB]/50">
          {images.length} Foto Terunggah
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Area Dropzone / Button Upload */}
      <div className="border-2 border-dashed border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-xl p-6 text-center bg-black/40 transition-all relative">
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileUpload}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center justify-center gap-2">
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
              <p className="text-xs text-[#D4AF37] font-medium">Mengunggah foto ke Cloud Storage...</p>
            </>
          ) : (
            <>
              <div className="p-3 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#F5F2EB]">
                  Klik atau seret file gambar ke sini untuk mengunggah
                </p>
                <p className="text-[10px] text-[#F5F2EB]/50 mt-1">
                  Mendukung JPG, PNG, atau WebP (Maksimal 5MB per berkas)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Grid Tampilan Galeri Foto */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          {images.map((img) => (
            <div
              key={img.id}
              className={`group relative rounded-lg overflow-hidden border bg-black/60 aspect-square flex flex-col justify-between transition-all ${
                img.is_primary
                  ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              {/* Gambar Display */}
              <img
                src={img.image_url}
                alt={img.alt_text || 'Foto Artefak'}
                className="w-full h-full object-cover"
              />

              {/* Badge Utama (Primary) */}
              {img.is_primary && (
                <div className="absolute top-2 left-2 bg-[#D4AF37] text-black text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-black" />
                  <span>Foto Utama</span>
                </div>
              )}

              {/* Action Overlay */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id, img.storage_path)}
                    disabled={deletingId === img.id}
                    className="p-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 rounded border border-red-500/40 transition-all"
                    title="Hapus Gambar"
                  >
                    {deletingId === img.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {!img.is_primary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(img.id)}
                    disabled={settingPrimaryId === img.id}
                    className="w-full py-1.5 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-semibold text-[10px] uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1"
                  >
                    {settingPrimaryId === img.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Star className="w-3 h-3" />
                    )}
                    <span>Jadikan Utama</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}