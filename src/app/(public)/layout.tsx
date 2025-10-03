'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/utils/pwa';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Enregistrer le Service Worker pour PWA
    registerServiceWorker();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
}