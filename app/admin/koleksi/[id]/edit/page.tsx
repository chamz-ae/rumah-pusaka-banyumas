'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ImageUploader, { CollectionImage } from '@/components/admin/ImageUploader';
import {
  Save,
  ArrowLeft,
  Loader2,
  Sparkles,
  Info,
  Scroll,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface Type {
  id: string;
  category_id: string;
  name: string;
  slug: string;
}

interface Dhapur {
  id: string;
  category_id: string;
  type_id: string | null;
  luk: number | null;
  name: string;
}

interface Ricikan {
  id: string;
  name: string;
}

export default function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: collectionId } = use(params);
  const router = useRouter();
  const supabase = createClient();

  // State Master Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [dhapurs, setDhapurs] = useState<Dhapur[]>([]);
  const [masterRicikan, setMasterRicikan] = useState<Ricikan[]>([]);
  const [images, setImages] = useState<CollectionImage[]>([]);

  // State Dropdown
  const [filteredTypes, setFilteredTypes] = useState<Type[]>([]);
  const [filteredDhapurs, setFilteredDhapurs] = useState<Dhapur[]>([]);

  // State Form Input
  const [collectionCode, setCollectionCode] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLuk, setSelectedLuk] = useState<string>('');
  const [selectedDhapur, setSelectedDhapur] = useState('');
  const [selectedRicikanIds, setSelectedRicikanIds] = useState<string[]>([]);

  const [description, setDescription] = useState('');
  const [historicalDescription, setHistoricalDescription] = useState('');
  const [culturalDescription, setCulturalDescription] = useState('');

  const [origin, setOrigin] = useState('');
  const [estimatedPeriod, setEstimatedPeriod] = useState('');
  const [material, setMaterial] = useState('');

  const [status, setStatus] = useState<'DRAFT' | 'PRIVATE' | 'PUBLISHED'>('DRAFT');

  // Loading States
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Fetch Existing Data & Master Data
  const loadCollectionAndMasterData = async () => {
    try {
      const [catRes, typeRes, dhapurRes, ricikanRes, colRes, ricikanRelRes, imgRes] =
        await Promise.all([
          supabase.from('categories').select('id, name').order('name'),
          supabase.from('types').select('id, category_id, name, slug').order('name'),
          supabase.from('dhapurs').select('id, category_id, type_id, luk, name').order('name'),
          supabase.from('ricikan').select('id, name').order('name'),
          supabase.from('collections').select('*').eq('id', collectionId).single(),
          supabase.from('collection_ricikan').select('ricikan_id').eq('collection_id', collectionId),
          supabase.from('collection_images').select('*').eq('collection_id', collectionId).order('is_primary', { ascending: false }),
        ]);

      if (catRes.data) setCategories(catRes.data);
      if (typeRes.data) setTypes(typeRes.data);
      if (dhapurRes.data) setDhapurs(dhapurRes.data);
      if (ricikanRes.data) setMasterRicikan(ricikanRes.data);

      if (colRes.data) {
        const col = colRes.data;
        setCollectionCode(col.collection_code || '');
        setTitle(col.title || '');
        setSelectedCategory(col.category_id || '');
        setSelectedType(col.type_id || '');
        setSelectedLuk(col.luk ? col.luk.toString() : '');
        setSelectedDhapur(col.dhapur_id || '');
        setDescription(col.description || '');
        setHistoricalDescription(col.historical_description || '');
        setCulturalDescription(col.cultural_description || '');
        setOrigin(col.origin || '');
        setEstimatedPeriod(col.estimated_period || '');
        setMaterial(col.material || '');
        setStatus(col.status || 'DRAFT');
      }

      if (ricikanRelRes.data) {
        setSelectedRicikanIds(ricikanRelRes.data.map((r) => r.ricikan_id));
      }

      if (imgRes.data) {
        setImages(imgRes.data as CollectionImage[]);
      }
    } catch (err) {
      setErrorMsg('Gagal memuat detail koleksi.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadCollectionAndMasterData();
  }, [collectionId]);

  // 2. Cascading Logic
  useEffect(() => {
    if (!selectedCategory) {
      setFilteredTypes([]);
      return;
    }
    setFilteredTypes(types.filter((t) => t.category_id === selectedCategory));
  }, [selectedCategory, types]);

  useEffect(() => {
    if (!selectedCategory) {
      setFilteredDhapurs([]);
      return;
    }

    let matched = dhapurs.filter((d) => d.category_id === selectedCategory);
    if (selectedType) matched = matched.filter((d) => d.type_id === selectedType);
    if (selectedLuk) {
      const lukNum = parseInt(selectedLuk, 10);
      matched = matched.filter((d) => d.luk === lukNum);
    }

    setFilteredDhapurs(matched);
  }, [selectedCategory, selectedType, selectedLuk, dhapurs]);

  const toggleRicikan = (id: string) => {
    setSelectedRicikanIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 3. Save Handler
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // Update collections table
      const { error: colError } = await supabase
        .from('collections')
        .update({
          collection_code: collectionCode,
          title,
          category_id: selectedCategory,
          type_id: selectedType || null,
          dhapur_id: selectedDhapur || null,
          luk: selectedLuk ? parseInt(selectedLuk, 10) : null,
          description: description || null,
          historical_description: historicalDescription || null,
          cultural_description: culturalDescription || null,
          origin: origin || null,
          estimated_period: estimatedPeriod || null,
          material: material || null,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', collectionId);

      if (colError) throw colError;

      // Update ricikan relations
      await supabase.from('collection_ricikan').delete().eq('collection_id', collectionId);

      if (selectedRicikanIds.length > 0) {
        const ricikanRows = selectedRicikanIds.map((ricikanId) => ({
          collection_id: collectionId,
          ricikan_id: ricikanId,
        }));
        await supabase.from('collection_ricikan').insert(ricikanRows);
      }

      router.push('/admin/koleksi');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memperbarui koleksi.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20 text-[#D4AF37]">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        <span className="text-xs uppercase tracking-widest">Memuat Informasi Artefak...</span>
      </div>
    );
  }

  const currentSelectedTypeObj = types.find((t) => t.id === selectedType);
  const isKerisLuk = currentSelectedTypeObj?.slug === 'luk';

  return (
    <form onSubmit={handleUpdate} className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Koleksi</span>
          </button>
          <h1 className="text-2xl font-serif text-[#D4AF37]">
            Sunting Dokumentasi Artefak
          </h1>
          <p className="text-xs text-[#F5F2EB]/60 mt-1">
            Kode: <span className="font-mono text-[#D4AF37]">{collectionCode}</span>
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-medium text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Simpan Perubahan</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* GALERI FOTO COMPONENT */}
      <ImageUploader
        collectionId={collectionId}
        images={images}
        onImagesUpdated={loadCollectionAndMasterData}
      />

      {/* SECTION KLASIFIKASI */}
      <div className="p-6 rounded-xl border border-[#D4AF37]/20 bg-[#121212] space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-[#D4AF37]">
          <Info className="w-5 h-5" />
          <h2 className="font-serif text-base font-medium">Klasifikasi Artefak</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">Nama Pusaka</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">Kategori</label>
            <select
              required
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">Tipe</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">-- Pilih Tipe --</option>
              {filteredTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {isKerisLuk && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">Jumlah Luk</label>
              <select
                value={selectedLuk}
                onChange={(e) => setSelectedLuk(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">-- Pilih Luk --</option>
                {[3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 25, 27, 29].map((luk) => (
                  <option key={luk} value={luk}>Luk {luk}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">Dhapur</label>
            <select
              value={selectedDhapur}
              onChange={(e) => setSelectedDhapur(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">-- Pilih Dhapur --</option>
              {filteredDhapurs.map((dh) => (
                <option key={dh.id} value={dh.id}>{dh.name} {dh.luk ? `(Luk ${dh.luk})` : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION RICIKAN */}
      <div className="p-6 rounded-xl border border-[#D4AF37]/20 bg-[#121212] space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-[#D4AF37]">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-serif text-base font-medium">Kelengkapan Ricikan</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {masterRicikan.map((r) => {
            const isChecked = selectedRicikanIds.includes(r.id);
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggleRicikan(r.id)}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                  isChecked
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                    : 'bg-[#1A1A1A] border-white/10 text-[#F5F2EB]/70'
                }`}
              >
                <span>{r.name}</span>
                {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* STATUS PUBLIKASI */}
      <div className="p-6 rounded-xl border border-[#D4AF37]/20 bg-[#121212] space-y-4">
        <h2 className="font-serif text-base font-medium text-[#D4AF37] border-b border-white/10 pb-3">
          Status Publikasi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {['DRAFT', 'PRIVATE', 'PUBLISHED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatus(st as any)}
              className={`p-4 rounded-lg border text-left font-semibold text-xs transition-all ${
                status === st
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                  : 'bg-[#1A1A1A] border-white/10 text-[#F5F2EB]/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}