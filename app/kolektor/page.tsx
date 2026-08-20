"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Search, User, ShieldCheck, MapPin, ArrowRight, X } from "lucide-react";

export default function CariKolektorPage() {
  const [query, setQuery] = useState("");
  const [collectors, setCollectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchCollectors = async () => {
      setLoading(true);
      try {
        let dbQuery = supabase
          .from("profiles")
          .select(
            "id, full_name, username, avatar_url, role, is_verified, bio",
          );

        if (query.trim()) {
          dbQuery = dbQuery.ilike("full_name", `%${query}%`);
        }

        dbQuery = dbQuery.order("created_at", { ascending: false });

        const { data } = await dbQuery;
        setCollectors(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => fetchCollectors(), 300);
    return () => clearTimeout(timer);
  }, [query, supabase]);

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB] pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      {/* Header Halaman */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-serif text-[#D4AF37] font-bold">
          Cari Kolektor
        </h1>
        <p className="text-xs sm:text-sm text-[#F5F2EB]/70 font-light">
          Temukan kolektor dan informasi terkait koleksinya
        </p>
      </div>

      {/* Bar Pencarian (Tanpa Filter) */}
      <div className="relative z-20 max-w-xl mx-auto w-full">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama kolektor..."
            className="w-full bg-[#121212] border border-[#D4AF37]/30 rounded-xl pl-11 pr-10 py-3 text-sm text-[#F5F2EB] placeholder:text-[#F5F2EB]/40 outline-none focus:border-[#D4AF37] transition-colors shadow-lg"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F5F2EB]/40 hover:text-[#D4AF37]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Bagian Hasil Kolektor */}
      <div className="space-y-4">
        <div className="text-xs font-mono uppercase text-[#D4AF37] tracking-wider border-b border-white/10 pb-2">
          Hasil Kolektor
        </div>

        {loading && (
          <div className="text-center py-16 text-xs font-mono text-[#D4AF37] uppercase tracking-widest">
            Mencari kolektor...
          </div>
        )}

        {!loading && collectors.length === 0 && (
          <div className="text-center py-20 bg-[#121212] border border-white/5 rounded-2xl space-y-3">
            <p className="text-sm font-serif text-[#D4AF37]">
              Tidak menemukan kolektor dengan nama tersebut.
            </p>
            <p className="text-xs text-[#F5F2EB]/60">
              Coba gunakan nama lain atau periksa kembali ejaan nama kolektor.
            </p>
          </div>
        )}

        {!loading && collectors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collectors.map((collector) => (
              <div
                key={collector.id}
                className="flex items-center gap-4 p-5 rounded-2xl bg-[#121212] border border-white/5 hover:border-[#D4AF37]/40 transition-all shadow-lg group"
              >
                <div className="w-16 h-16 rounded-full bg-black border border-[#D4AF37]/50 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {collector.avatar_url ? (
                    <img
                      src={collector.avatar_url}
                      alt={collector.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-[#D4AF37]/50" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-bold text-[#F5F2EB] truncate group-hover:text-[#D4AF37] transition-colors">
                      {collector.full_name}
                    </h3>
                    {collector.is_verified && (
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#F5F2EB]/60">
                    <span className="font-mono text-[#D4AF37]">
                      @{collector.username || "kolektor"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Nusantara
                    </span>
                  </div>
                </div>

                <Link
                  href={`/member/${collector.username || collector.id}`}
                  className="shrink-0 inline-flex items-center gap-1 px-4 py-2.5 bg-black border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] text-xs font-bold rounded-xl transition-colors"
                >
                  <span>Lihat Profil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
