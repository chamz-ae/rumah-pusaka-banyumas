import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rumah Pusaka Banyumas',
    short_name: 'Rumah Pusaka',
    description: 'Arsip digital resmi inventarisasi tatanan pusaka, dhapur, pamor, dan budaya kolektor.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D0D0D',
    theme_color: '#D4AF37',
    icons: [
      {
        src: 'https://res.cloudinary.com/dmmpuvtwx/image/upload/v1786837618/logo_a1zfbh.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://res.cloudinary.com/dmmpuvtwx/image/upload/v1786837618/logo_a1zfbh.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}