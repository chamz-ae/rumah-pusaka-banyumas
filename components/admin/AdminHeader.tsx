'use client';

import Link from 'next/link';
import { Menu, ExternalLink, Shield } from 'lucide-react';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  userEmail?: string;
}

export default function AdminHeader({ onMenuToggle, userEmail }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-[#121212]/90 backdrop-blur-md border-b border-[#D4AF37]/20 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-[#F5F2EB]/70 hover:text-[#D4AF37] rounded-lg border border-white/10"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#F5F2EB]/60">
          <Shield className="w-4 h-4 text-[#D4AF37]" />
          <span>Arsip Museum Terproteksi</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {userEmail && (
          <span className="hidden md:inline-block text-xs text-[#F5F2EB]/70 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            {userEmail}
          </span>
        )}

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-medium uppercase tracking-wider rounded-lg transition-all"
        >
          <span>Lihat Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
}