'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Upload,
  X,
  Image as ImageIcon,
  Check,
  Loader2,
  Info,
  Sparkles,
  Save,
  Trash2,
} from 'lucide-react';

interface CollectionFormProps {
  initialData?: any;
  onSubmit: (formData: any) => Promise<void>;
  isLoading?: boolean;
  isSubmitting?: boolean;
}

export default function CollectionForm({
  initialData,
  onSubmit,
  isLoading = false,
  isSubmitting = false,
}: CollectionFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [dhapurs, setDhapurs] = useState<any[]>([]);
  const [ricikans, setRicikans] = useState<any[]>([]);

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [typeId, setTypeId] = useState(initialData?.type_id || '');
  const [dhapurId, setDhapurId] = useState(initialData?.dhapur_id || '');
  const [luk, setLuk] = useState(initialData?.luk || '');
  const [origin, setOrigin] = useState(initialData?.origin || '');
  const [estimatedPeriod, setEstimatedPeriod] = useState(initialData?.estimated_period || '');
  const [material, setMaterial] = useState(initialData?.material || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [historicalDescription, setHistoricalDescription] = useState(initialData?.historical_description || '');
  const [culturalDescription, setCulturalDescription] = useState(initialData?.cultural_description || '');
  const [status, setStatus] = useState(initialData?.status || 'PUBLISHED');
  const [selectedRicikans, setSelectedRicikans] = useState<string[]>(initialData?.ricikan_ids || []);

  // Upload Foto State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>(initialData?.images || []);

  const supabase = createClient();
  const loading = isLoading || isSubmitting;

  useEffect(() => {
    const fetchMasterData = async () => {
      const { data: catData } = await supabase.from('categories').select('*').order('name');
      const { data: typeData } = await supabase.from('types').select('*').order('name');
      const { data: dhapurData } = await supabase.from('dhapurs').select('*').order('name');
      const { data: ricikanData } = await supabase.from('ricikan').select('*').order('name');

      setCategories(catData || []);
      setTypes(typeData || []);
      setDhapurs(dhapurData || []);
      setRicikans(ricikanData || []);
    };

    fetchMasterData();
  }, [supabase]);

  // Handle Pilih File Gambar Baru
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  // Hapus File Preview Baru
  const removeNewFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Hapus Foto Lama (Jika Edit)
  const removeExistingImage = async (imageId: string) => {
    if (!confirm('Hapus foto ini dari galeri?')) return;
    await supabase.from('collection_images').delete().eq('id', imageId);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleToggleRicikan = (rId: string) => {
    setSelectedRicikans((prev) =>
      prev.includes(rId) ? prev.filter((id) => id !== rId) : [...prev, rId]
    );
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !categoryId) {
      alert('Mohon isi Judul Artefak dan Kategori!');
      return;
    }

    const payload = {
      title,
      category_id: categoryId,
      type_id: typeId,
      dhapur_id: dhapurId,
      luk,
      origin,
      estimated_period: estimatedPeriod,
      material,
      description,
      historical_description: historicalDescription,
      cultural_description: culturalDescription,
      status,
      ricikan_ids: selectedRicikans,
      images: selectedFiles,
    };

    await onSubmit(payload);
  };

  const filteredTypes = types.filter((t) => t.category_id === categoryId);
  const filteredDhapurs = dhapurs.filter(
    (d) => (!categoryId || d.category_id === categoryId) && (!typeId || d.type_id === typeId)
  );

  return (
    <form onSubmit={handleSubmitForm} className="space-y-8 text-[#F5F2EB]">
      {/* 1. INFORMASI DASAR */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#121212] space-y-5">
        <div className="flex items-center gap-2 text-[#D4AF37] border-b border-white/10 pb-3 font-serif text-lg font-bold">
          <Info className="w-5 h-5" />
          <h2>1. Informasi Dasar & Klasifikasi</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-[#D4AF37]">
              Nama Pusaka / Artefak <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Keris Kyai Sengkelat / Tombak Baru Kuping"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4AF37]">
              Kategori Pusaka <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setTypeId('');
                setDhapurId('');
              }}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4AF37]">
              Tipe / Sub-Klasifikasi
            </label>
            <select
              value={typeId}
              onChange={(e) => {
                setTypeId(e.target.value);
                setDhapurId('');
              }}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
            >
              <option value="">-- Pilih Tipe --</option>
              {filteredTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4AF37]">Dhapur Pusaka</label>
            <select
              value={dhapurId}
              onChange={(e) => setDhapurId(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
            >
              <option value="">-- Pilih Dhapur --</option>
              {filteredDhapurs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} {d.luk !== null ? `(Luk ${d.luk})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4AF37]">Jumlah Luk</label>
            <input
              type="number"
              value={luk}
              onChange={(e) => setLuk(e.target.value)}
              placeholder="0 (Lurus) atau 3, 5, 7..."
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. RICIKAN BILAH */}
      {ricikans.length > 0 && (
        <div className="p-6 rounded-2xl border border-white/10 bg-[#121212] space-y-4">
          <div className="flex items-center gap-2 text-[#D4AF37] border-b border-white/10 pb-3 font-serif text-lg font-bold">
            <Sparkles className="w-5 h-5" />
            <h2>2. Kelengkapan Ricikan Bilah</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {ricikans.map((r) => {
              const isSelected = selectedRicikans.includes(r.id);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleToggleRicikan(r.id)}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                      : 'bg-[#1A1A1A] border-white/10 text-[#F5F2EB]/60 hover:border-white/30'
                  }`}
                >
                  <span className="truncate">{r.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-[#D4AF37]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. CATATAN DESKRIPSI & HISTORIS */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#121212] space-y-5">
        <div className="font-serif text-lg font-bold text-[#D4AF37] border-b border-white/10 pb-3">
          3. Deskripsi & Filosofi
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4AF37]">Deskripsi Umum</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Uraian kondisi fisik, kelengkapan warangka, handle/deder..."
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D4AF37]">Catatan Sejarah / Tangguh</label>
              <textarea
                rows={3}
                value={historicalDescription}
                onChange={(e) => setHistoricalDescription(e.target.value)}
                placeholder="Riwayat era, tangguh, asal-usul penemuan..."
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D4AF37]">Filosofi & Makna Kebudayaan</label>
              <textarea
                rows={3}
                value={culturalDescription}
                onChange={(e) => setCulturalDescription(e.target.value)}
                placeholder="Ajaran moral, ajimat, tuah/pasren khas..."
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. SPESIFIKASI FISIK & METADATA */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#121212] space-y-5">
        <div className="font-serif text-lg font-bold text-[#D4AF37] border-b border-white/10 pb-3">
          4. Spesifikasi Fisik & Metadata Origin
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4AF37]">Asal Daerah (Origin)</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Contoh: Banyumas / Surakarta"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4AF37]">Estimasi Era / Tangguh</label>
            <input
              type="text"
              value={estimatedPeriod}
              onChange={(e) => setEstimatedPeriod(e.target.value)}
              placeholder="Contoh: Mataram Senopaten / Abad 17"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4AF37]">Bahan Material / Pamor</label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="Contoh: Pamor Wos Wutah, Besi Keleng"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. STATUS PUBLIKASI */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#121212] space-y-4">
        <div className="font-serif text-lg font-bold text-[#D4AF37] border-b border-white/10 pb-3">
          5. Pengaturan Status Publikasi
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {['PUBLISHED', 'DRAFT', 'PRIVATE'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatus(st)}
              className={`p-4 rounded-xl border text-left transition-all ${
                status === st
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                  : 'bg-[#1A1A1A] border-white/10 text-[#F5F2EB]/50 hover:border-white/20'
              }`}
            >
              <div className="font-bold text-xs uppercase font-mono">{st}</div>
              <div className="text-[10px] mt-1 opacity-70">
                {st === 'PUBLISHED'
                  ? 'Tampil publik di katalog galeri'
                  : st === 'DRAFT'
                  ? 'Hanya draf tersimpan'
                  : 'Arsip internal'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 6. DOKUMENTASI FOTO ARTEFAK (SEKSI BARU) */}
      <div className="p-6 rounded-2xl border border-[#D4AF37]/30 bg-[#121212] space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-[#D4AF37] font-serif text-lg font-bold">
            <ImageIcon className="w-5 h-5" />
            <h2>6. Dokumentasi Foto Artefak</h2>
          </div>
          <span className="text-xs text-[#F5F2EB]/50">
            Format PNG, JPG, WEBP (Max 5MB)
          </span>
        </div>

        {/* Upload Dropzone */}
        <label className="border-2 border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-[#1A1A1A]/50 hover:bg-[#1A1A1A] transition-all gap-3">
          <div className="p-3 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#F5F2EB]">
              Klik untuk memilih foto dari komputer / HP Anda
            </p>
            <p className="text-[10px] text-[#F5F2EB]/50 mt-0.5">
              Anda dapat memilih lebih dari satu foto sekaligus.
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Preview Foto Lama (Jika Edit) */}
        {existingImages.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-[#D4AF37]">Foto Tersimpan:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {existingImages.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-xl border border-white/20 overflow-hidden group bg-black"
                >
                  <img
                    src={img.image_url}
                    alt="Foto Artefak"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-950/80 text-red-400 hover:bg-red-900 border border-red-500/40"
                    title="Hapus foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview Foto Baru yang Baru Dipilih */}
        {previewUrls.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-emerald-400">
              Foto Baru Siap Diunggah ({previewUrls.length}):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {previewUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl border border-emerald-500/40 overflow-hidden group bg-black"
                >
                  <img
                    src={url}
                    alt="Preview Baru"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewFile(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/80 text-white hover:text-red-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TOMBOL SIMPAN UTAMA */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-2xl"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{loading ? 'Menyimpan Artefak...' : 'Simpan Artefak'}</span>
        </button>
      </div>
    </form>
  );
}