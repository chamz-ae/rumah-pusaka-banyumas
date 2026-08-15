'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  categories?: any[];
  types?: any[];
  dhapurs?: any[];
  ricikanList?: any[];
  selectedCategory?: string;
  selectedType?: string;
  selectedDhapur?: string;
  selectedLuk?: string;
}

export default function FilterPanel({
  categories = [],
  types = [],
  dhapurs = [],
  ricikanList = [],
  selectedCategory = '',
  selectedType = '',
  selectedDhapur = '',
  selectedLuk = '',
}: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  const filteredTypes = (types || []).filter((t) => {
    if (!selectedCategory) return true;
    const selectedCat = (categories || []).find((c) => c.slug === selectedCategory);
    return selectedCat ? t.category_id === selectedCat.id : true;
  });

  const filteredDhapurs = (dhapurs || []).filter((d) => {
    if (!selectedCategory) return true;
    const selectedCat = (categories || []).find((c) => c.slug === selectedCategory);
    return selectedCat ? d.category_id === selectedCat.id : true;
  });

  const hasActiveFilter =
    selectedCategory || selectedType || selectedDhapur || selectedLuk || searchParams.get('q');

  return (
    <div className="bg-[#121212] border border-[#D4AF37]/20 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
          <Filter className="w-4 h-4" />
          <span>Filter Spesifikasi Pusaka</span>
        </div>

        {hasActiveFilter && (
          <button
            onClick={handleReset}
            className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Kategori */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-mono text-[#D4AF37]">Kategori</label>
          <select
            value={selectedCategory}
            onChange={(e) => handleFilterChange('kategori', e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-2.5 py-2 text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
          >
            <option value="">Semua Kategori</option>
            {(categories || []).map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tipe */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-mono text-[#D4AF37]">Sub-Klasifikasi</label>
          <select
            value={selectedType}
            onChange={(e) => handleFilterChange('tipe', e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-2.5 py-2 text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
          >
            <option value="">Semua Tipe</option>
            {filteredTypes.map((t) => (
              <option key={t.id} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dhapur */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-mono text-[#D4AF37]">Dhapur</label>
          <select
            value={selectedDhapur}
            onChange={(e) => handleFilterChange('dhapur', e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-2.5 py-2 text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
          >
            <option value="">Semua Dhapur</option>
            {filteredDhapurs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} {d.luk !== null ? `(${d.luk} Luk)` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Luk */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-mono text-[#D4AF37]">Bentuk Luk</label>
          <select
            value={selectedLuk}
            onChange={(e) => handleFilterChange('luk', e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-2.5 py-2 text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
          >
            <option value="">Semua Luk</option>
            <option value="0">Lurus (0 Luk)</option>
            <option value="3">Luk 3</option>
            <option value="5">Luk 5</option>
            <option value="7">Luk 7</option>
            <option value="9">Luk 9</option>
            <option value="11">Luk 11</option>
            <option value="13">Luk 13</option>
          </select>
        </div>
      </div>
    </div>
  );
}