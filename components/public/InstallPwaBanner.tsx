'use client';

import { useState, useEffect } from 'react';
import { Download, X, Landmark, Sparkles, Share } from 'lucide-react';

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // 1. Cek apakah website sudah dibuka dalam mode App Standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      // Jika sudah diinstall & dibuka dari icon aplikasi, jangan tampilkan banner
      return;
    }

    // 2. Cek apakah Perangkat adalah iOS (iPhone / iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    if (isIosDevice) {
      // Di iOS, langsung tampilkan banner petunjuk manual iOS
      setShowBanner(true);
      return;
    }

    // 3. Tangkap event beforeinstallprompt untuk Android / Desktop Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#121212] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col gap-3 relative overflow-hidden">
        {/* Hiasan Aksen Garis Emas */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        <div className="flex items-start justify-between gap-3">
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

          <button
            onClick={handleDismiss}
            className="p-1 text-[#F5F2EB]/40 hover:text-[#D4AF37] transition-colors shrink-0"
            title="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tampilan Tombol/Petunjuk Berdasarkan Perangkat */}
        {isIos ? (
          /* Tampilan Petunjuk Khusus iPhone / iOS Safari */
          <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#D4AF37]">
            <Share className="w-4 h-4 shrink-0 text-[#D4AF37]" />
            <span>
              Tekan tombol <strong>Share (Bagikan)</strong> di bawah browser, lalu pilih <strong>'Tambahkan ke Layar Utama'</strong>.
            </span>
          </div>
        ) : (
          /* Tampilan Tombol 1-Klik Install Android / Chrome */
          <div className="pt-2 border-t border-white/10 flex justify-end">
            <button
              onClick={handleInstallClick}
              className="w-full sm:w-auto px-4 py-2 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install Aplikasi</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}