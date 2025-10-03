'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Header, Sidebar } from '@/components/layout';
import { useAuth } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/lib/utils/constants';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  // Fermer la sidebar au changement de route (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Chargement..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 bg-gray-50">
          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden sticky top-16 z-20 bg-white border-b border-gray-200 px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <Menu className="w-5 h-5" />
              <span className="text-sm font-medium">Menu</span>
            </button>
          </div>

          {/* Content */}
          <div className="container-custom py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}