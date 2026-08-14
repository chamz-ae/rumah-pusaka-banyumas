'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
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
  slug: string;
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

export default function CollectionForm() {
  const router = useRouter();
  const supabase = createClient();

  // State Master Data dari Supabase
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [dhapurs, setDhapurs] = useState<Dhapur[]>([]);
  const [masterRicikan, setMasterRicikan] = useState<Ricikan[]>([]);

  // State Opsi Cascading Dropdown
  const [filteredTypes, setFilteredTypes] = useState<Type[]>([]);
  const [filteredDhapurs, setFilteredDhapurs] = useState<Dhapur[]>([]);

  // State Form Field Input
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
  const [physicalDescription, setPhysicalDescription] = useState('');

  const [origin, setOrigin] = useState('');
  const [provenance, setProvenance] = useState('');
  const [estimatedPeriod, setEstimatedPeriod] = useState('');
  const [material, setMaterial] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [condition, setCondition] = useState('');
  const [authenticityNotes, setAuthenticityNotes] = useState('');

  const [status, setStatus] = useState<'DRAFT' | 'PRIVATE' | 'PUBLISHED'>('DRAFT');
  const [featured, setFeatured] = useState(false);

  // Status Form & Loading
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Fetch Initial Master Data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [catRes, typeRes, dhapurRes, ricikanRes] = await Promise.all([
          supabase.from('categories').select('id, name, slug').order('name'),
          supabase.from('types').select('id, category_id, name, slug').order('name'),
          supabase.from('dhapurs').select('id, category_id, type_id, luk, name').order('name'),
          supabase.from('ricikan').select('id, name').order('name'),
        ]);

        if (catRes.data) setCategories(catRes.data);
        if (typeRes.data) setTypes(typeRes.data);
        if (dhapurRes.data) setDhapurs(dhapurRes.data);
        if (ricikanRes.data) setMasterRicikan(ricikanRes.data);

        // Generate default Collection Code otomatis (Contoh: RPB-PUSAKA-1234)
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        setCollectionCode(`RPB-PUSAKA-${randomNum}`);
      } catch (err) {
        setErrorMsg('Gagal memuat master data klasifikasi.');
      } finally {
        setFetching(false);
      }
    };

    fetchMasterData();
  }, [supabase]);

  // 2. Cascading Logic: Ketika Kategori Berubah
  useEffect(() => {
    if (!selectedCategory) {
      setFilteredTypes([]);
      setSelectedType('');
      return;
    }

    const matchedTypes = types.filter((t) => t.category_id === selectedCategory);
    setFilteredTypes(matchedTypes);
    setSelectedType('');
    setSelectedLuk('');
    setSelectedDhapur('');
  }, [selectedCategory, types]);

  // 3. Cascading Logic: Ketika Tipe atau Luk Berubah -> Filter Dhapur Presisi
  useEffect(() => {
    if (!selectedCategory) {
      setFilteredDhapurs([]);
      return;
    }

    let matched = dhapurs.filter((d) => d.category_id === selectedCategory);

    if (selectedType) {
      matched = matched.filter((d) => d.type_id === selectedType);
    }

    if (selectedLuk) {
      const lukNum = parseInt(selectedLuk, 10);
      matched = matched.filter((d) => d.luk === lukNum);
    }

    setFilteredDhapurs(matched);
    setSelectedDhapur('');
  }, [selectedCategory, selectedType, selectedLuk, dhapurs]);

  // Toggle Pilihan Ricikan (Multi-Select)
  const toggleRicikan = (id: string) => {
    setSelectedRicikanIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Helper untuk slug otomatis
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!title || !selectedCategory) {
      setErrorMsg('Nama Pusaka dan Kategori wajib diisi.');
      setLoading(false);
      return;
    }

    try {
      const slug = `${generateSlug(title)}-${Math.floor(Math.random() * 1000)}`;
      const { data: userData } = await supabase.auth.getUser();

      // Cek Keamanan Profile ID
      let createdById: string | null = null;
      if (userData.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userData.user.id)
          .maybeSingle();

        if (profile) {
          createdById = profile.id;
        }
      }

      // 1. Insert ke tabel collections
      const { data: newCollection, error: colError } = await supabase
        .from('collections')
        .insert({
          collection_code: collectionCode,
          title,
          slug,
          category_id: selectedCategory,
          type_id: selectedType || null,
          dhapur_id: selectedDhapur || null,
          luk: selectedLuk ? parseInt(selectedLuk, 10) : null,
          description: description || null,
          historical_description: historicalDescription || null,
          cultural_description: culturalDescription || null,
          physical_description: physicalDescription || null,
          origin: origin || null,
          provenance: provenance || null,
          estimated_period: estimatedPeriod || null,
          material: material || null,
          dimensions: dimensions || null,
          condition: condition || null,
          authenticity_notes: authenticityNotes || null,
          status,
          featured,
          created_by: createdById,
        })
        .select('id')
        .single();

      if (colError) throw colError;

      // 2. Insert relasi many-to-many ke collection_ricikan
      if (selectedRicikanIds.length > 0 && newCollection) {
        const ricikanRows = selectedRicikanIds.map((ricikanId) => ({
          collection_id: newCollection.id,
          ricikan_id: ricikanId,
        }));

        const { error: ricikanError } = await supabase
          .from('collection_ricikan')
          .insert(ricikanRows);

        if (ricikanError) throw ricikanError;
      }

      router.push('/admin/koleksi');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan data koleksi.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20 text-[#D4AF37]">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        <span className="text-xs uppercase tracking-widest">Memuat Master Data Museum...</span>
      </div>
    );
  }

  // Cari Tipe Keris Luk untuk menampilkan Opsi Angka Luk dari PDF
  const currentSelectedTypeObj = types.find((t) => t.id === selectedType);
  const isKerisLuk = currentSelectedTypeObj?.slug === 'luk';

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header Form */}
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
            Pendokumentasian Artefak Pusaka Baru
          </h1>
          <p className="text-xs text-[#F5F2EB]/60 mt-1">
            Isikan spesifikasi dan identitas pusaka sesuai catatan arsip resmi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-medium text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Simpan Artefak</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SECTION 1: INFORMASI DASAR & KLASIFIKASI */}
      <div className="p-6 rounded-xl border border-[#D4AF37]/20 bg-[#121212] space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-[#D4AF37]">
          <Info className="w-5 h-5" />
          <h2 className="font-serif text-base font-medium">1. Informasi Dasar & Klasifikasi</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
              Kode Koleksi (Unik) *
            </label>
            <input
              type="text"
              required
              value={collectionCode}
              onChange={(e) => setCollectionCode(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm font-mono text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
              Nama Pusaka / Artefak *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Keris Kyai Condong Campur"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F5F2EB] placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Cascading Dropdown 1: Kategori */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
              Kategori Pusaka *
            </label>
            <select
              required
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cascading Dropdown 2: Tipe */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
              Tipe / Sub-Klasifikasi
            </label>
            <select
              disabled={!selectedCategory}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37] disabled:opacity-40"
            >
              <option value="">-- Pilih Tipe --</option>
              {filteredTypes.map((typ) => (
                <option key={typ.id} value={typ.id}>
                  {typ.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cascading Dropdown 3: Jumlah Luk (Jika Keris Luk) */}
          {isKerisLuk && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
                Jumlah Luk (Sesuai PDF Source of Truth)
              </label>
              <select
                value={selectedLuk}
                onChange={(e) => setSelectedLuk(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">-- Pilih Luk --</option>
                {[3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 25, 27, 29].map((luk) => (
                  <option key={luk} value={luk}>
                    Luk {luk}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Cascading Dropdown 4: Dhapur (Otomatis Tersaring) */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
              Dhapur Pusaka
            </label>
            <select
              disabled={!selectedCategory}
              value={selectedDhapur}
              onChange={(e) => setSelectedDhapur(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37] disabled:opacity-40"
            >
              <option value="">-- Pilih Dhapur --</option>
              {filteredDhapurs.map((dh) => (
                <option key={dh.id} value={dh.id}>
                  {dh.name} {dh.luk ? `(Luk ${dh.luk})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: RICIKAN PUSAKA (MULTI-SELECT) */}
      <div className="p-6 rounded-xl border border-[#D4AF37]/20 bg-[#121212] space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-[#D4AF37]">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-serif text-base font-medium">2. Kelengkapan Ricikan (22 Bagian Utama)</h2>
        </div>
        <p className="text-xs text-[#F5F2EB]/60">
          Pilih ricikan yang terdapat pada fisik bilah pusaka ini.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
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
                    : 'bg-[#1A1A1A] border-white/10 text-[#F5F2EB]/70 hover:border-white/30'
                }`}
              >
                <span>{r.name}</span>
                {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: DESKRIPSI & SEJARAH */}
      <div className="p-6 rounded-xl border border-[#D4AF37]/20 bg-[#121212] space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-[#D4AF37]">
          <Scroll className="w-5 h-5" />
          <h2 className="font-serif text-base font-medium">3. Deskripsi Narasi & Sejarah</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
              Deskripsi Umum
            </label>
            <textarea
              rows={3}
              placeholder="Penjelasan ringkas artefak..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
                Uraian Sejarah (Historical)
              </label>
              <textarea
                rows={4}
                placeholder="Catatan historis penemuan atau peristiwa terkait..."
                value={historicalDescription}
                onChange={(e) => setHistoricalDescription(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
                Filosfi & Budaya (Cultural)
              </label>
              <textarea
                rows={4}
                placeholder="Makna filosofis, pasren, atau tuah tradisi Jawa..."
                value={culturalDescription}
                onChange={(e) => setCulturalDescription(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: SPESIFIKASI FISIK & ORIGIN */}
      <div className="p-6 rounded-xl border border-[#D4AF37]/20 bg-[#121212] space-y-6">
        <h2 className="font-serif text-base font-medium text-[#D4AF37] border-b border-white/10 pb-3">
          4. Spesifikasi Fisik & Metadata Origin
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
              Asal Daerah (Origin)
            </label>
            <input
              type="text"
              placeholder="Contoh: Banyumas / Mataram"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
              Estimasi Era / Tangguh
            </label>
            <input
              type="text"
              placeholder="Contoh: Abad 16 / Tangguh Pajajaran"
              value={estimatedPeriod}
              onChange={(e) => setEstimatedPeriod(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
              Bahan Material / Pamor
            </label>
            <input
              type="text"
              placeholder="Contoh: Besi Keleng, Pamor Wos Wutah"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: STATUS PUBLIKASI */}
      <div className="p-6 rounded-xl border border-[#D4AF37]/20 bg-[#121212] space-y-4">
        <h2 className="font-serif text-base font-medium text-[#D4AF37] border-b border-white/10 pb-3">
          5. Pengaturan Status Publikasi
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'DRAFT', title: 'DRAFT', desc: 'Belum selesai, hanya tersimpan di admin.' },
            { id: 'PRIVATE', title: 'PRIVATE', desc: 'Internal museum, tidak muncul di publik.' },
            { id: 'PUBLISHED', title: 'PUBLISHED', desc: 'Rilis & tampil di museum publik.' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatus(st.id as any)}
              className={`p-4 rounded-lg border text-left transition-all ${
                status === st.id
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                  : 'bg-[#1A1A1A] border-white/10 text-[#F5F2EB]/60 hover:border-white/20'
              }`}
            >
              <div className="font-semibold text-xs uppercase tracking-wider mb-1">{st.title}</div>
              <div className="text-[11px] opacity-70">{st.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}