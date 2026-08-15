'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Landmark,
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

  // RESTRUKTURISASI MENU NAVBAR RINGKAS & PROFESIONAL
  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Katalog Pusaka', href: '/koleksi' },
    { name: 'Anatomi Ricikan', href: '/ricikan' },
    { name: 'Khazanah Sejarah', href: '/khazanah' },
    { name: 'Tentang Kami', href: '/tentang' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] group-hover:scale-105 transition-all">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-[#F5F2EB] tracking-wide block leading-none">
              Rumah Pusaka
            </span>
            <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-[#D4AF37] block mt-1">
              BANYUMAS HERITAGE
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-semibold tracking-wider transition-colors ${
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

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/koleksi"
            className="p-2.5 text-[#F5F2EB]/60 hover:text-[#D4AF37] transition-colors"
            title="Pencarian Pusaka"
          >
            <Search className="w-4 h-4" />
          </Link>

          {!loading && (
            <>
              {user ? (
                <Link
                  href={profile?.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                  className="px-4 py-2 bg-[#121212] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#F5F2EB] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md group"
                >
                  <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#D4AF37] flex items-center justify-center overflow-hidden shrink-0">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    )}
                  </div>
                  <span className="group-hover:text-[#D4AF37] transition-colors">
                    {profile?.role === 'admin' ? 'Panel Admin' : profile?.full_name || 'Dashboard'}
                  </span>
                  {profile?.role === 'admin' && (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  )}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg hover:scale-105"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk Akun</span>
                </Link>
              )}
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#F5F2EB] hover:text-[#D4AF37]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#121212] border-b border-[#D4AF37]/20 p-5 space-y-4">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-semibold text-[#F5F2EB]/80 hover:text-[#D4AF37] py-1"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10">
            {user ? (
              <Link
                href={profile?.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 bg-[#1A1A1A] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{profile?.role === 'admin' ? 'Buka Panel Admin' : 'Buka Dashboard Saya'}</span>
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
  );
}