'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

interface FilterCategory {
  id: string;
  name: string;
  slug: string;
}

interface FilterDhapur {
  id: string;
  name: string;
  category_id: string;
  luk: number | null;
}

interface FilterRicikan {
  id: string;
  name: string;
}

interface FilterPanelProps {
  categories: FilterCategory[];
  dhapurs: FilterDhapur[];
  ricikanList: FilterRicikan[];
}

export default function FilterPanel({
  categories,
  dhapurs,
  ricikanList,
}: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State nilai filter dari URL Params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedLuk, setSelectedLuk] = useState(searchParams.get('luk') || '');
  const [selectedDhapur, setSelectedDhapur] = useState(searchParams.get('dhapur') || '');
  const [selectedRicikan, setSelectedRicikan] = useState(searchParams.get('ricikan') || '');

  // State Modal/Drawer Mobile
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Filter Dhapur berdasarkan Kategori dan Luk
  const filteredDhapurs = dhapurs.filter((d) => {
    if (selectedCategory) {
      const matchedCat = categories.find((c) => c.slug === selectedCategory);
      if (matchedCat && d.category_id !== matchedCat.id) return false;
    }
    if (selectedLuk) {
      if (d.luk !== parseInt(selectedLuk, 10)) return false;
    }
    return true;
  });

  // Terapkan Filter ke URL Query
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedLuk) params.set('luk', selectedLuk);
    if (selectedDhapur) params.set('dhapur', selectedDhapur);
    if (selectedRicikan) params.set('ricikan', selectedRicikan);

    router.push(`${pathname}?${params.toString()}`);
    setMobileDrawerOpen(false);
  };

  // Reset Semua Filter
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedLuk('');
    setSelectedDhapur('');
    setSelectedRicikan('');
    router.push(pathname);
    setMobileDrawerOpen(false);
  };

  // Jumlah Filter Aktif
  const activeCount =
    (searchQuery ? 1 : 0) +
    (selectedCategory ? 1 : 0) +
    (selectedLuk ? 1 : 0) +
    (selectedDhapur ? 1 : 0) +
    (selectedRicikan ? 1 : 0);

  return (
    <div className="space-y-4 mb-10">
      {/* Top Search Bar & Mobile Trigger */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#D4AF37] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kata kunci, nama pusaka, kode, atau asal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="w-full bg-[#121212] border border-[#D4AF37]/30 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-[#F5F2EB] placeholder:text-[#F5F2EB]/30 focus:outline-none focus:border-[#D4AF37] transition-all shadow-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5F2EB]/40 hover:text-[#D4AF37]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={applyFilters}
            className="px-5 py-3 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 flex-1 sm:flex-none"
          >
            <Search className="w-4 h-4" />
            <span>Cari Arsip</span>
          </button>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="px-4 py-3 bg-[#121212] border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#D4AF37]/10 transition-all flex items-center gap-2 relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filter Lanjutan</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Quick Pills (Desktop & Panel) */}
      <div className="p-5 rounded-2xl border border-[#D4AF37]/20 bg-[#121212]/90 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            <Filter className="w-4 h-4" />
            <span>Penyaring Klasifikasi Museum</span>
          </div>

          {activeCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-[11px] text-red-400 hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filter ({activeCount})</span>
            </button>
          )}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Kategori */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#D4AF37] mb-1.5 font-medium">
              Kategori Pusaka
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedDhapur('');
              }}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Jumlah Luk */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#D4AF37] mb-1.5 font-medium">
              Jumlah Luk (PDF Standard)
            </label>
            <select
              value={selectedLuk}
              onChange={(e) => {
                setSelectedLuk(e.target.value);
                setSelectedDhapur('');
              }}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">Semua Lekukan Luk</option>
              {[3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 25, 27, 29].map((luk) => (
                <option key={luk} value={luk}>
                  Luk {luk}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Dhapur */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#D4AF37] mb-1.5 font-medium">
              Dhapur Pusaka
            </label>
            <select
              value={selectedDhapur}
              onChange={(e) => setSelectedDhapur(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">Semua Dhapur</option>
              {filteredDhapurs.map((dh) => (
                <option key={dh.id} value={dh.id}>
                  {dh.name} {dh.luk ? `(Luk ${dh.luk})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Ricikan */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#D4AF37] mb-1.5 font-medium">
              Kelengkapan Ricikan
            </label>
            <select
              value={selectedRicikan}
              onChange={(e) => setSelectedRicikan(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">Semua Ricikan</option>
              {ricikanList.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay Filter */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-end">
          <div className="w-full max-w-xs bg-[#121212] border-l border-[#D4AF37]/30 h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-sm font-serif text-[#D4AF37]">
                  <Filter className="w-4 h-4" />
                  <span>Filter Lanjutan</span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 text-[#F5F2EB]/60 hover:text-[#D4AF37]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Input Drawer */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
                    Kategori
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-2.5 text-xs text-[#F5F2EB]"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
                    Jumlah Luk
                  </label>
                  <select
                    value={selectedLuk}
                    onChange={(e) => setSelectedLuk(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-2.5 text-xs text-[#F5F2EB]"
                  >
                    <option value="">Semua Luk</option>
                    {[3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 25, 27, 29].map((luk) => (
                      <option key={luk} value={luk}>Luk {luk}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-6 border-t border-white/10 space-y-2">
              <button
                onClick={applyFilters}
                className="w-full py-3 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider rounded-lg"
              >
                Terapkan Filter
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-2.5 bg-white/5 text-[#F5F2EB]/60 text-xs font-medium uppercase tracking-wider rounded-lg"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}