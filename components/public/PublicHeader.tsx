'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Landmark, Search, Menu, X, Sparkles } from 'lucide-react';

export default function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Efek Perubahan Warna Navbar Saat Doscroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Semua Koleksi', href: '/koleksi' },
    { name: 'Keris', href: '/koleksi/keris' },
    { name: 'Tombak', href: '/koleksi/tombak' },
    { name: 'Pedang Jawa', href: '/koleksi/pedang' },
    { name: 'Tentang', href: '/tentang' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#D4AF37]/20 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 group-hover:border-[#D4AF37] transition-all">
            <Landmark className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <span className="font-serif text-base sm:text-lg text-[#D4AF37] font-bold tracking-wide block leading-tight">
              Rumah Pusaka
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#F5F2EB]/60 uppercase tracking-[0.2em] block">
              Banyumas Heritage
            </span>
          </div>
        </Link>

        {/* Navigasi Desktop */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30'
                    : 'text-[#F5F2EB]/80 hover:text-[#D4AF37] hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/koleksi"
            className="p-2 rounded-full text-[#F5F2EB]/80 hover:text-[#D4AF37] hover:bg-white/5 transition-all border border-transparent hover:border-[#D4AF37]/30"
            title="Cari Koleksi"
          >
            <Search className="w-4 h-4" />
          </Link>
          <Link
            href="/koleksi"
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C5A059] text-black text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Jelajahi Museum</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/koleksi"
            className="p-2 text-[#F5F2EB]/80 hover:text-[#D4AF37]"
            title="Cari Koleksi"
          >
            <Search className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#F5F2EB] hover:text-[#D4AF37] rounded-lg border border-white/10 bg-black/40"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-[#0D0D0D]/98 backdrop-blur-xl border-b border-[#D4AF37]/30 py-6 px-6 shadow-2xl transition-all">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all ${
                    isActive
                      ? 'text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/40'
                      : 'text-[#F5F2EB]/80 hover:text-[#D4AF37] hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 mt-2 border-t border-white/10">
              <Link
                href="/koleksi"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest rounded-lg text-center block"
              >
                Jelajahi Seluruh Koleksi
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}