import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import Navbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/PublicFooter'; // <-- 1. Import Footer
import InstallPwaBanner from '@/components/public/InstallPwaBanner';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Rumah Pusaka Banyumas — Museum Digital & Tosan Aji Jawa',
  description: 'Arsip digital resmi inventarisasi tatanan pusaka, dhapur, pamor, dan budaya kolektor.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable}`}>
      {/* 2. Tambahkan flex flex-col min-h-screen agar footer selalu di bawah */}
      <body className="bg-[#0D0D0D] text-[#F5F2EB] font-sans antialiased selection:bg-[#D4AF37] selection:text-black flex flex-col min-h-screen">
        <Navbar />
        
        {/* 3. Bungkus children dengan div flex-1 untuk mendorong footer ke bawah */}
        <div className="flex-1">
          {children}
        </div>
        
        {/* 4. Pasang komponen Footer di sini */}
        <PublicFooter />
        
        <InstallPwaBanner />
      </body>
    </html>
  );
}