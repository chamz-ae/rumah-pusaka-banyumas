'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('✓ PWA Service Worker terdaftar:', reg.scope);
          })
          .catch((err) => {
            console.error('✗ Gagal mendaftarkan Service Worker:', err);
          });
      });
    }
  }, []);

  return null;
}