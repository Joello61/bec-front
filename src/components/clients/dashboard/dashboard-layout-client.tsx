'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import SplashScreen from '@/components/common/SplashScreen';
import VerificationBanner from '@/components/dashboard/VerificationBanner';
import { BottomNav, Sidebar } from '@/components/layout';
import { useAuth } from '@/lib/hooks';
import { useMercureEvents } from '@/lib/hooks/useMercureEvents';
import { ROUTES } from '@/lib/utils/constants';

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const MIN_DURATION = 2500;
  const [showSplash, setShowSplash] = useState(true);

  useMercureEvents();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isInitialized, router]);

  useEffect(() => {
    const start = Date.now();
    if (isInitialized) {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_DURATION - elapsed);
      const timer = setTimeout(() => setShowSplash(false), remaining);
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  if (showSplash) return <SplashScreen visible={showSplash} />;

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
            <VerificationBanner />
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile uniquement */}
      <BottomNav />
    </div>
  );
}