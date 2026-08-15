'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/koleksi?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/koleksi');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#D4AF37]" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari pusaka, dhapur, pamor, tangguh, atau nama kolektor..."
        className="w-full bg-[#121212] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-2xl py-3 pl-12 pr-10 text-xs sm:text-sm text-[#F5F2EB] outline-none shadow-xl transition-all"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery('');
            router.push('/koleksi');
          }}
          className="absolute right-4 top-3.5 text-[#F5F2EB]/40 hover:text-[#D4AF37]"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}