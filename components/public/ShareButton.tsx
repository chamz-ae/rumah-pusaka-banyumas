'use client';

import { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  MessageCircle,
  Globe,
  Send,
} from 'lucide-react';

interface ShareButtonProps {
  title: string;
  slug: string;
  categoryName?: string;
}

export default function ShareButton({
  title,
  slug,
  categoryName,
}: ShareButtonProps) {
  const [modalOpen, setMobileModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dapatkan URL Lengkap
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/koleksi/${slug}`
    : `/koleksi/${slug}`;

  const shareText = `Lihat dokumentasi arsip pusaka "${title}" (${categoryName || 'Pusaka'}) di Rumah Pusaka Banyumas Digital Museum:`;

  // Handler Tombol Utama Bagikan
  const handleShare = async () => {
    // 1. Uji Dukungan Native Web Share API (Smartphone/Modern Browser)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${title} — Rumah Pusaka Banyumas`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Jika pengguna membatalkan dialog native, abaikan tanpa error
      }
    }

    // 2. Fallback: Buka Modal Dialog Pilihan Sosial Media
    setMobileModalOpen(true);
  };

  // Handler Salin Tautan (Copy Link)
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      alert('Gagal menyalin tautan.');
    }
  };

  // Link Media Sosial
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <>
      {/* Tombol Pemicu Utama */}
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shadow-md"
      >
        <Share2 className="w-4 h-4" />
        <span>Bagikan Koleksi</span>
      </button>

      {/* MODAL DIALOG FALLBACK (DESKTOP / NON-NATIVE) */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#D4AF37]/40 rounded-2xl p-6 max-w-sm w-full space-y-6 shadow-2xl relative overflow-hidden">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-[#D4AF37] font-serif text-base font-bold">
                <Share2 className="w-5 h-5" />
                <span>Bagikan Artefak Pusaka</span>
              </div>
              <button
                onClick={() => setMobileModalOpen(false)}
                className="text-[#F5F2EB]/60 hover:text-[#D4AF37] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Opsi Media Sosial */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all"
              >
                <MessageCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>WhatsApp</span>
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all"
              >
                <Globe className="w-4 h-4 shrink-0 text-blue-400" />
                <span>Facebook</span>
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/30 text-sky-300 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all"
              >
                <Send className="w-4 h-4 shrink-0 text-sky-400" />
                <span>Telegram</span>
              </a>

              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-white/20 text-[#F5F2EB] rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all"
              >
                <Share2 className="w-4 h-4 shrink-0 text-[#F5F2EB]" />
                <span>X (Twitter)</span>
              </a>
            </div>

            {/* Input Salin Tautan (Copy Link) */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="block text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                Tautan Resmi Artefak
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F5F2EB]/80 font-mono focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#C5A059] text-black rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}