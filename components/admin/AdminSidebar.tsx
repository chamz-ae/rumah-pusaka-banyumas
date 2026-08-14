'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Library,
  PlusCircle,
  BookOpen,
  Sparkles,
  Image as ImageIcon,
  LogOut,
  Landmark,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Kelola Koleksi',
      href: '/admin/koleksi',
      icon: Library,
    },
    {
      name: 'Tambah Koleksi',
      href: '/admin/koleksi/tambah',
      icon: PlusCircle,
    },
    {
      name: 'Master Dhapur',
      href: '/admin/dhapur',
      icon: BookOpen,
    },
    {
      name: 'Master Ricikan',
      href: '/admin/ricikan',
      icon: Sparkles,
    },
    {
      name: 'Media Library',
      href: '/admin/media',
      icon: ImageIcon,
    },
  ];

  return (
    <>
      {/* Overlay Gelap untuk Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#121212] border-r border-[#D4AF37]/20 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Sidebar / Brand */}
        <div className="p-6 border-b border-[#D4AF37]/15 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/40">
              <Landmark className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="font-serif text-sm text-[#D4AF37] leading-tight font-bold">
                Rumah Pusaka
              </h2>
              <p className="text-[10px] text-[#F5F2EB]/50 uppercase tracking-widest">
                Admin Panel
              </p>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-[#F5F2EB]/60 hover:text-[#D4AF37]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Menu Navigasi Utama */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]/60">
            Menu Utam
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
                    : 'text-[#F5F2EB]/70 hover:text-[#F5F2EB] hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#F5F2EB]/50'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Tombol Logout Sesi */}
        <div className="p-4 border-t border-[#D4AF37]/15">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-medium uppercase tracking-wider rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>
    </>
  );
}