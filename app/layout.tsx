import type { Metadata } from 'next';
import './globals.css';
import PublicLayoutWrapper from '@/components/public/PublicLayoutWrapper';

export const metadata: Metadata = {
  title: 'Rumah Pusaka Banyumas — Digital Museum & Heritage Archive',
  description:
    'Mendokumentasikan, mengarsipkan, dan mempublikasikan warisan pusaka budaya Keris, Tombak, dan Pedang Jawa.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-[#0D0D0D] text-[#F5F2EB] antialiased selection:bg-[#D4AF37] selection:text-black">
        <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
      </body>
    </html>
  );
}