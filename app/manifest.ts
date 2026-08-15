import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rumah Pusaka Banyumas',
    short_name: 'Rumah Pusaka',
    description: 'Arsip Digital Warisan Budaya & Tosan Aji Banyumas',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D0D0D',
    theme_color: '#D4AF37',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}