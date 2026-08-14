'use client';

import { useState, useEffect } from 'react';
import { Download, X, Landmark, Sparkles } from 'lucide-react';

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Tangkap event sebelum install dari browser
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Tampilkan banner notifikasi kita
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Munculkan dialog prompt install bawaan browser
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User menerima install PWA');
    }

    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#121212] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4 relative overflow-hidden">
        {/* Aksen Hiasan Emas */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Aplikasi Museum Digital</span>
            </div>
            <h4 className="font-serif text-sm font-bold text-[#F5F2EB]">
              Pasang Rumah Pusaka
            </h4>
            <p className="text-[11px] text-[#F5F2EB]/60">
              Akses cepat tanpa perlu membuka browser.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-2 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-[#F5F2EB]/40 hover:text-[#D4AF37] transition-colors"
            title="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}