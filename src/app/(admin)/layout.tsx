'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      // Rediriger si pas authentifié
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
        return;
      }

      // Rediriger si pas admin
      if (!user?.roles?.includes('ROLE_ADMIN')) {
        router.push(ROUTES.DASHBOARD);
      }
    }
  }, [isAuthenticated, isInitialized, user, router]);

  if (!isInitialized) {
    return <LoadingSpinner fullScreen text="Vérification des permissions..." />;
  }

  if (!isAuthenticated || !user?.roles?.includes('ROLE_ADMIN')) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Admin */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}