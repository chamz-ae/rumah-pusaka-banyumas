import Link from 'next/link';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';

export interface PublicCollectionItem {
  id: string;
  collection_code: string;
  title: string;
  slug: string;
  luk: number | null;
  estimated_period: string | null;
  origin: string | null;
  category: { name: string; slug: string } | null;
  dhapur: { name: string } | null;
  images: { image_url: string; is_primary: boolean }[];
}

interface CollectionCardProps {
  item: PublicCollectionItem;
}

export default function CollectionCard({ item }: CollectionCardProps) {
  // Ambil gambar utama atau gambar pertama, gunakan placeholder jika belum ada foto
  const primaryImage =
    item.images?.find((img) => img.is_primary)?.image_url ||
    item.images?.[0]?.image_url ||
    '/images/placeholder-pusaka.jpg';

  return (
    <Link
      href={`/koleksi/${item.slug}`}
      className="group bg-[#121212] rounded-xl border border-[#D4AF37]/20 hover:border-[#D4AF37] overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between"
    >
      <div>
        {/* Frame Foto Artefak Museum */}
        <div className="aspect-[4/3] bg-black relative overflow-hidden border-b border-white/5">
          <img
            src={primaryImage}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />

          {/* Badge Kode Inventaris Museum */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono px-2.5 py-1 rounded shadow-md">
            {item.collection_code}
          </div>

          {/* Badge Luk Jika Ada */}
          {item.luk && (
            <div className="absolute top-3 right-3 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-md">
              Luk {item.luk}
            </div>
          )}
        </div>

        {/* Spesifikasi & Metadata Artefak */}
        <div className="p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {item.category?.name || 'Pusaka'} • {item.dhapur?.name || 'Dhapur Belum Ditentukan'}
            </span>
          </div>

          <h3 className="font-serif text-base font-bold text-[#F5F2EB] group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2">
            {item.title}
          </h3>

          <p className="text-xs text-[#F5F2EB]/60 line-clamp-1">
            {item.estimated_period || item.origin ? (
              <>
                {item.estimated_period && <span>{item.estimated_period}</span>}
                {item.estimated_period && item.origin && <span> • </span>}
                {item.origin && <span>{item.origin}</span>}
              </>
            ) : (
              'Informasi asal & era belum dicatat'
            )}
          </p>
        </div>
      </div>

      {/* Action Footer Button */}
      <div className="px-5 py-3 border-t border-white/5 bg-black/40 flex items-center justify-between text-xs text-[#D4AF37] font-medium">
        <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Lihat Detail Arsip</span>
        </span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}