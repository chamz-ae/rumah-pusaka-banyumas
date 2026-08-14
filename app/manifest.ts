import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rumah Pusaka Banyumas — Digital Museum',
    short_name: 'Rumah Pusaka',
    description: 'Digital Museum & Heritage Database Keris, Tombak, dan Pedang Jawa.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0D0D0D',
    theme_color: '#D4AF37',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}