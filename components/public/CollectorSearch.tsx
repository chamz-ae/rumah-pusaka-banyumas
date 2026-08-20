'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Search, SlidersHorizontal, User, ShieldCheck, MapPin, ArrowRight, X } from 'lucide-react';

export default function CollectorSearch() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [collectors, setCollectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCollectors = async () => {
      setLoading(true);
      try {
        let dbQuery = supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url, role, is_verified, bio');

        if (query.trim()) dbQuery = dbQuery.ilike('full_name', `%${query}%`);
        if (filter === 'verified') dbQuery = dbQuery.eq('is_verified', true);
        
        dbQuery = dbQuery.order('created_at', { ascending: false });

        const { data } = await dbQuery;
        setCollectors(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => fetchCollectors(), 400);
    return () => clearTimeout(timer);
  }, [query, filter, supabase]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 relative z-20">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama kolektor..."
            className="w-full bg-[#121212] border border-[#D4AF37]/30 rounded-xl pl-11 pr-4 py-3 text-sm text-[#F5F2EB] placeholder:text-[#F5F2EB]/40 outline-none focus:border-[#D4AF37] transition-colors shadow-lg"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F5F2EB]/40 hover:text-[#D4AF37]">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="w-full sm:w-auto relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border transition-all shadow-lg ${
              isFilterOpen || filter !== 'all' ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]' : 'bg-[#121212] border-[#D4AF37]/30 text-[#F5F2EB]/80 hover:border-[#D4AF37]/60'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Filter</span>
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-full sm:w-56 bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider border-b border-white/10 mb-2">Status Verifikasi</div>
              <button onClick={() => { setFilter('all'); setIsFilterOpen(false); }} className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${filter === 'all' ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-bold' : 'text-[#F5F2EB] hover:bg-white/5'}`}>Semua Kolektor</button>
              <button onClick={() => { setFilter('verified'); setIsFilterOpen(false); }} className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${filter === 'verified' ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-bold' : 'text-[#F5F2EB] hover:bg-white/5'}`}>
                <span>Terverifikasi</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="min-h-[400px]">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && collectors.length === 0 && (
          <div className="text-center py-24 bg-[#121212] border border-white/5 rounded-3xl space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-black border border-[#D4AF37]/20 flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-[#F5F2EB]/30" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-serif text-[#D4AF37]">Kolektor Tidak Ditemukan</p>
              <p className="text-xs text-[#F5F2EB]/60 max-w-sm mx-auto">Tidak ada profil kolektor yang sesuai dengan pencarian Anda.</p>
            </div>
          </div>
        )}

        {!loading && collectors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collectors.map((collector) => (
              <div key={collector.id} className="flex items-center gap-4 p-5 rounded-2xl bg-[#121212] border border-white/5 hover:border-[#D4AF37]/40 transition-all shadow-lg group">
                <div className="w-16 h-16 rounded-full bg-black border border-[#D4AF37]/50 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {collector.avatar_url ? <img src={collector.avatar_url} alt={collector.full_name} className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-[#D4AF37]/50" />}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-bold text-[#F5F2EB] truncate group-hover:text-[#D4AF37] transition-colors">{collector.full_name}</h3>
                    {collector.is_verified && <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0"/>}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#F5F2EB]/60">
                    <span className="font-mono text-[#D4AF37]">@{collector.username || 'kolektor'}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Nusantara</span>
                  </div>
                </div>
                <Link href={`/member/${collector.username || collector.id}`} className="shrink-0 p-3 bg-black border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] rounded-xl transition-colors" title="Lihat Profil">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}