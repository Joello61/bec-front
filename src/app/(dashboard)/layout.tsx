'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, BottomNav } from '@/components/layout';
import { useAuth } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized) {
    return <LoadingSpinner fullScreen text="Vérification de l'authentification..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* Sidebar - Desktop uniquement */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 lg:ml-64 bg-gray-50">
          {/* Padding adapté : plus sur mobile pour le BottomNav */}
          <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile uniquement */}
      <BottomNav />
    </div>
  );
}