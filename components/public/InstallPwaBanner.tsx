'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    });
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#1A1A1A] border border-[#D4AF37]/30 p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10">
      <div className="p-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg">
        <Download className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-[#F5F2EB]">Pasang Rumah Pusaka</h4>
        <p className="text-[10px] text-[#F5F2EB]/60">Akses cepat tanpa browser.</p>
      </div>
      <button
        onClick={() => deferredPrompt.prompt()}
        className="px-3 py-1.5 bg-[#D4AF37] text-black text-[10px] font-bold uppercase rounded-lg"
      >
        Install
      </button>
      <button onClick={() => setShow(false)} className="text-[#F5F2EB]/40">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}