'use client';

import { usePathname } from 'next/navigation';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';
import InstallPwaBanner from '@/components/public/InstallPwaBanner';

export default function PublicLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D] text-[#F5F2EB]">
      <PublicHeader />
      <div className="flex-1">{children}</div>
      <PublicFooter />

      {/* NOTIFIKASI INSTALL PWA CUSTOM */}
      <InstallPwaBanner />
    </div>
  );
}