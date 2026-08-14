'use client';

import { useState } from 'react';
import { ImageIcon, Sparkles } from 'lucide-react';

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
}

interface DetailGalleryProps {
  images: GalleryImage[];
  title: string;
}

export default function DetailGallery({ images, title }: DetailGalleryProps) {
  // Set gambar utama default berdasarkan flag is_primary atau gambar pertama
  const primaryImg =
    images.find((img) => img.is_primary) || images[0] || null;

  const [activeImage, setActiveImage] = useState<GalleryImage | null>(primaryImg);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-black/80 rounded-2xl border border-[#D4AF37]/30 flex flex-col items-center justify-center p-8 text-center text-[#D4AF37]/50">
        <ImageIcon className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-xs uppercase tracking-widest font-mono">
          Dokumentasi Visual Belum Tersedia
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Viewer Gambar Utama HD */}
      <div className="aspect-[4/3] bg-black rounded-2xl border border-[#D4AF37]/40 overflow-hidden relative shadow-2xl group">
        <img
          src={activeImage?.image_url || primaryImg?.image_url}
          alt={activeImage?.alt_text || title}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Badge status foto utama */}
        {activeImage?.is_primary && (
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3 h-3" />
            <span>Foto Utama Artefak</span>
          </div>
        )}
      </div>

      {/* Navigation Thumbnails (Jika foto lebih dari 1) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {images.map((img) => {
            const isActive = activeImage?.id === img.id;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`aspect-square rounded-xl border overflow-hidden bg-black transition-all ${
                  isActive
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 scale-105'
                    : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                }`}
              >
                <img
                  src={img.image_url}
                  alt={img.alt_text || 'Thumbnail Pusaka'}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}