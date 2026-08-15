import Link from 'next/link';
import { User, ShieldCheck } from 'lucide-react';

export interface PublicCollectionItem {
  id: string;
  collection_code: string;
  title: string;
  slug: string;
  luk?: number | null;
  estimated_period?: string | null;
  origin?: string | null;
  category?: { name: string; slug?: string } | null;
  dhapur?: { name: string } | null;
  images?: { image_url: string; is_primary?: boolean }[] | null;
  collector?: {
    username: string;
    full_name: string;
    avatar_url?: string;
    is_verified?: boolean;
  } | null;
}

export default function CollectionCard({ item }: { item: PublicCollectionItem }) {
  const primaryImage =
    item.images?.find((img) => img.is_primary)?.image_url ||
    item.images?.[0]?.image_url ||
    '/images/og-default.jpg';

  const categoryName = Array.isArray(item.category)
    ? (item.category as any)[0]?.name
    : item.category?.name;

  const dhapurName = Array.isArray(item.dhapur)
    ? (item.dhapur as any)[0]?.name
    : item.dhapur?.name;

  return (
    <div className="group bg-[#121212] border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between">
      <div>
        {/* Cover Image */}
        <div className="relative aspect-[4/3] bg-black overflow-hidden">
          <img
            src={primaryImage}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-[10px] px-2.5 py-1 rounded-md shadow-md">
              {item.collection_code}
            </span>
            <span className="bg-[#D4AF37]/20 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md">
              {categoryName || 'Pusaka'}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#F5F2EB]/90">
            {item.luk && (
              <span className="bg-white/10 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                Luk {item.luk}
              </span>
            )}
            {item.estimated_period && (
              <span className="text-[11px] font-serif italic text-[#D4AF37] drop-shadow">
                {item.estimated_period}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <h3 className="font-serif text-lg font-bold text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
            {item.title}
          </h3>

          <div className="text-xs text-[#F5F2EB]/60 space-y-1 font-light">
            {dhapurName && (
              <div>
                <span className="text-[#D4AF37]/80 font-semibold">Dhapur:</span>{' '}
                {dhapurName}
              </div>
            )}
            {item.origin && (
              <div>
                <span className="text-[#D4AF37]/80 font-semibold">Asal:</span>{' '}
                {item.origin}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Card: Atribusi Kolektor */}
      <div className="p-5 pt-0 border-t border-white/10 mt-2">
        <div className="pt-3 flex items-center justify-between gap-2">
          {item.collector ? (
            <Link
              href={`/kolektor/${item.collector.username}`}
              className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/50 overflow-hidden shrink-0 flex items-center justify-center">
                {item.collector.avatar_url ? (
                  <img
                    src={item.collector.avatar_url}
                    alt={item.collector.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-3 h-3 text-[#D4AF37]" />
                )}
              </div>
              <span className="text-[11px] text-[#D4AF37] font-medium truncate">
                @{item.collector.username} {item.collector.is_verified && '🛡️'}
              </span>
            </Link>
          ) : (
            <span className="text-[10px] text-[#F5F2EB]/40 font-mono">
              Koleksi Museum
            </span>
          )}

          <Link
            href={`/koleksi/${item.slug}`}
            className="text-xs font-semibold text-[#D4AF37] hover:underline"
          >
            Detail ➔
          </Link>
        </div>
      </div>
    </div>
  );
}