'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Search, X, User, BookOpen, Compass, ShieldCheck } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    collectors: any[];
    collections: any[];
  }>({ collectors: [], collections: [] });
  
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults({ collectors: [], collections: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ collectors: [], collections: [] });
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // 1. Cari Kolektor
        const { data: collectors } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url, role, is_verified')
          .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
          .limit(4);

        // 2. Cari ID Kategori yang cocok
        const { data: matchedCategories } = await supabase
          .from('categories')
          .select('id')
          .ilike('name', `%${query}%`);
        const catIds = matchedCategories?.map((c: any) => c.id) || [];

        // 3. Cari ID Dhapur yang cocok
        const { data: matchedDhapurs } = await supabase
          .from('dhapurs')
          .select('id')
          .ilike('name', `%${query}%`);
        const dhapurIds = matchedDhapurs?.map((d: any) => d.id) || [];

        // 4. Susun kondisi pencarian koleksi secara menyeluruh
        let collectionQuery = supabase
          .from('collections')
          .select(`
            id, title, slug, collection_code, estimated_period, origin,
            category:categories(name),
            dhapur:dhapurs(name)
          `)
          .eq('status', 'PUBLISHED')
          .is('deleted_at', null);

        let orConditions = [
          `title.ilike.%${query}%`,
          `collection_code.ilike.%${query}%`,
          `origin.ilike.%${query}%`,
          `estimated_period.ilike.%${query}%`,
          `description.ilike.%${query}%`
        ];

        if (catIds.length > 0) {
          orConditions.push(`category_id.in.(${catIds.join(',')})`);
        }
        if (dhapurIds.length > 0) {
          orConditions.push(`dhapur_id.in.(${dhapurIds.join(',')})`);
        }

        collectionQuery = collectionQuery.or(orConditions.join(','));

        const { data: collections } = await collectionQuery
          .order('created_at', { ascending: false })
          .limit(6);

        setResults({
          collectors: collectors || [],
          collections: collections || [],
        });
      } catch (err) {
        console.error('Global search error:', err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, supabase]);

  if (!isOpen) return null;

  const hasResults = results.collectors.length > 0 || results.collections.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="bg-[#121212] border border-[#D4AF37]/30 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#F5F2EB] animate-in fade-in zoom-in-95">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kategori, dhapur, tahun, asal daerah, judul..."
            className="w-full bg-transparent text-sm sm:text-base text-[#F5F2EB] placeholder:text-[#F5F2EB]/40 outline-none font-sans"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-[#F5F2EB]/40 hover:text-[#D4AF37]">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-1.5 text-[#F5F2EB]/60 hover:text-[#F5F2EB] bg-white/5 rounded-lg border border-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results Container */}
        <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-5 space-y-6">
          {loading && (
            <div className="text-center py-12 text-xs text-[#D4AF37] font-mono uppercase tracking-widest">
              Menelusuri seluruh arsip & data...
            </div>
          )}

          {!loading && query && !hasResults && (
            <div className="text-center py-12 text-xs text-[#F5F2EB]/50">
              Tidak menemukan data yang cocok dengan kueri "{query}".
            </div>
          )}

          {/* KELOMPOK 1: KOLEKTOR */}
          {!loading && results.collectors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="text-xs font-mono uppercase text-[#D4AF37] tracking-wider font-bold">Kolektor Orang</h3>
                </div>
                <Link href="/kolektor" onClick={onClose} className="text-[10px] text-[#F5F2EB]/60 hover:text-[#D4AF37] transition-colors">
                  Lihat direktori kolektor →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {results.collectors.map((c: any) => (
                  <Link
                    key={c.id}
                    href={`/member/${c.username || c.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#1A1A1A] border border-white/5 hover:border-[#D4AF37]/50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-black border border-[#D4AF37]/40 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                      {c.avatar_url ? (
                        <img src={c.avatar_url} alt={c.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-[#D4AF37]/60" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors truncate">
                          {c.full_name}
                        </span>
                        {c.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />}
                      </div>
                      <div className="text-[10px] font-mono text-[#D4AF37]/80 truncate">
                        @{c.username || 'kolektor'}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* KELOMPOK 2: KELOMPOK PUSAKA, ARSIP & SEJARAH */}
          {!loading && results.collections.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="text-xs font-mono uppercase text-[#D4AF37] tracking-wider font-bold">Katalog Pusaka & Arsip Sejarah</h3>
                </div>
                <Link href="/khazanah" onClick={onClose} className="text-[10px] text-[#F5F2EB]/60 hover:text-[#D4AF37] transition-colors">
                  Lihat khazanah sejarah →
                </Link>
              </div>

              <div className="space-y-2">
                {results.collections.map((col: any) => (
                  <Link
                    key={col.id}
                    href={`/koleksi/${col.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A1A] border border-white/5 hover:border-[#D4AF37]/50 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <BookOpen className="w-4 h-4 text-[#D4AF37]/70 shrink-0 group-hover:scale-110 transition-transform" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors truncate">
                          {col.title}
                        </div>
                        <div className="text-[10px] text-[#F5F2EB]/50 truncate">
                          {col.category?.name || 'Pusaka'} {col.dhapur?.name ? `• ${col.dhapur.name}` : ''} {col.origin ? `• ${col.origin}` : ''} {col.estimated_period ? `• ${col.estimated_period}` : ''}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-1 bg-black/60 border border-[#D4AF37]/30 text-[#D4AF37] rounded shrink-0">
                      {col.collection_code}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}