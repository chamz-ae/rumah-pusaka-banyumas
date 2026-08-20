'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import GlobalSearchModal from './GlobalSearchModal';
import {
  LogIn,
  User,
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X,
  Search,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        const { data: prof } = await supabase
          .from('profiles')
          .select('full_name, username, avatar_url, role')
          .eq('id', user.id)
          .maybeSingle();

        setProfile(prof);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setProfile(null);
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        fetchUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/member')) {
    return null;
  }

  // Menu navigasi setelah "Katalog Pusaka" dihapus
  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Cari Kolektor', href: '/kolektor' },
    { name: 'Anatomi Ricikan', href: '/ricikan' },
    { name: 'Khazanah Sejarah', href: '/khazanah' },
    { name: 'Primbon', href: '/primbon' },
    { name: 'Tentang Kami', href: '/tentang' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          
          {/* BRAND & LOGO SQUARE */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-[#D4AF37]/40 bg-[#121212] group-hover:scale-105 transition-transform flex items-center justify-center">
              <img 
                src="https://res.cloudinary.com/dmmpuvtwx/image/upload/v1786837618/logo_a1zfbh.png" 
                alt="Logo Square" 
                className="w-full h-full object-contain p-1" 
              />
            </div>
            <div className="hidden xs:block">
              <span className="font-serif text-sm sm:text-base font-bold text-[#F5F2EB] tracking-wide block leading-tight">
                Rumah Pusaka
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase font-mono tracking-[0.15em] text-[#D4AF37] block">
                BANYUMAS HERITAGE
              </span>
            </div>
          </Link>

          {/* NAVIGASI DESKTOP (LENGKAP TIDAK ADA YANG DIHILANGKAN) */}
          <nav className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] font-semibold tracking-wider transition-colors ${
                    isActive
                      ? 'text-[#D4AF37] font-bold'
                      : 'text-[#F5F2EB]/70 hover:text-[#D4AF37]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* GLOBAL SEARCH & TOMBOL AKUN (DESKTOP) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-[#121212] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-xl text-xs text-[#F5F2EB]/70 transition-all shadow-sm"
              title="Pencarian Global"
            >
              <Search className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="hidden sm:inline text-[11px] truncate max-w-[120px] lg:max-w-xs">Cari kolektor, pusaka...</span>
            </button>

            {!loading && (
              <div className="hidden sm:block">
                {user ? (
                  <Link
                    href={profile?.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                    className="px-3.5 py-2 bg-[#121212] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#F5F2EB] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md group"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#1A1A1A] border border-[#D4AF37] flex items-center justify-center overflow-hidden shrink-0">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-3 h-3 text-[#D4AF37]" />
                      )}
                    </div>
                    <span className="truncate max-w-[90px]">
                      {profile?.full_name || 'Akun'}
                    </span>
                    {profile?.role === 'admin' && (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    )}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-lg hover:scale-105"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Masuk</span>
                  </Link>
                )}
              </div>
            )}

            {/* HAMBURGER MENU (MOBILE & TABLET) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-[#F5F2EB] hover:text-[#D4AF37] rounded-xl bg-[#121212] border border-white/10"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DRAWER (SEMUA MENU LENGKAP TAMPIL DI SINI) */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-[#121212] border-b border-[#D4AF37]/20 px-4 py-5 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-semibold text-[#F5F2EB]/90 hover:text-[#D4AF37] py-2.5 px-3 rounded-lg bg-black/40 border border-white/5"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10">
              {user ? (
                <Link
                  href={profile?.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-[#1A1A1A] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{profile?.role === 'admin' ? 'Buka Panel Admin' : 'Dashboard Saya'}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk Akun Kolektor</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* GLOBAL SEARCH MODAL */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}