import type { Metadata, Viewport } from 'next';
import './globals.css';
import PublicLayoutWrapper from '@/components/public/PublicLayoutWrapper';
import PwaRegister from '@/components/public/PwaRegister';

export const viewport: Viewport = {
  themeColor: '#D4AF37',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Rumah Pusaka Banyumas — Digital Museum & Heritage Archive',
  description:
    'Mendokumentasikan, mengarsipkan, dan mempublikasikan warisan pusaka budaya Keris, Tombak, dan Pedang Jawa.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Rumah Pusaka',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-[#0D0D0D] text-[#F5F2EB] antialiased selection:bg-[#D4AF37] selection:text-black">
        <PwaRegister />
        <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
      </body>
    </html>
  );
}