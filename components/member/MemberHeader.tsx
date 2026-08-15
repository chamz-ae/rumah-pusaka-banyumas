'use client';

import { Menu, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

interface MemberHeaderProps {
  onMenuToggle: () => void;
  userEmail?: string;
  fullName?: string;
  username?: string;
  avatarUrl?: string;
}

export default function MemberHeader({
  onMenuToggle,
  userEmail,
  fullName,
  username,
  avatarUrl,
}: MemberHeaderProps) {
  return (
    <header className="h-16 border-b border-[#D4AF37]/20 bg-[#121212]/80 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#D4AF37] lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs text-[#F5F2EB]/60 hidden sm:inline">
          Area Anggota / Dashboard Kolektor
        </span>
      </div>

      <div className="flex items-center gap-3">
        {username && (
          <Link
            href={`/kolektor/${username}`}
            target="_blank"
            className="text-[11px] font-semibold text-[#D4AF37] hover:underline"
          >
            @{username}
          </Link>
        )}

        <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 p-1.5 pl-3 rounded-full">
          <span className="text-xs font-medium text-[#F5F2EB] max-w-[120px] truncate">
            {fullName || userEmail || 'Kolektor'}
          </span>
          <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-4 h-4 text-[#D4AF37]" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}