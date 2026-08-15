'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  User,
  Heart,
  ExternalLink,
  LogOut,
  X,
  ShieldCheck,
} from 'lucide-react';

interface MemberSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
}

export default function MemberSidebar({ isOpen, onClose, username }: MemberSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/member/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Koleksi Saya',
      href: '/member/koleksi',
      icon: Layers,
    },
    {
      name: 'Koleksi Favorit',
      href: '/member/favorit',
      icon: Heart,
    },
    {
      name: 'Tambah Koleksi',
      href: '/member/koleksi/tambah',
      icon: PlusCircle,
    },
    {
      name: 'Edit Profil',
      href: '/member/profil',
      icon: User,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#121212] border-r border-[#D4AF37]/20 z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[#D4AF37] text-[10px] uppercase font-semibold tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Portal Kolektor</span>
            </div>
            <h2 className="font-serif text-lg font-bold text-[#F5F2EB]">
              Rumah Pusaka
            </h2>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-[#F5F2EB]/60 hover:text-[#D4AF37]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                    : 'text-[#F5F2EB]/70 hover:bg-white/5 hover:text-[#D4AF37]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {username && (
            <Link
              href={`/kolektor/${username}`}
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition-all mt-4"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Lihat Profil Publik</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/30 border border-red-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}