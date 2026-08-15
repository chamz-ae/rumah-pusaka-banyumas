import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import Navbar from '@/components/public/Navbar';
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
      <body className="bg-[#0D0D0D] text-[#F5F2EB] font-sans antialiased selection:bg-[#D4AF37] selection:text-black">
        <Navbar />
        {children}
        <InstallPwaBanner />
      </body>
    </html>
  );
}