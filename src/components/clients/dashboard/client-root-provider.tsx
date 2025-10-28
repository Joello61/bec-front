'use client';

import { ReactNode, useEffect } from 'react';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { NotificationPermissionProvider } from '@/components/providers/NotificationPermissionProvider';
import { InAppNotificationProvider } from '@/components/providers/InAppNotificationProvider';
import ToastProvider from '@/components/providers/ToastProvider';
import { Footer, Header } from '@/components/layout';
import { registerServiceWorker } from '@/lib/utils/pwa/client';

export default function ClientRootProvider({ children }: { children: ReactNode }) {

    useEffect(() => {
    registerServiceWorker();
  }, []);
  
  return (
    <body className="min-h-screen bg-gray-50 antialiased">
        <AuthProvider>
            <NotificationPermissionProvider>
                <InAppNotificationProvider>
                    <Header />
                        <main id="main-content" role="main">
                            {children}
                        </main>
                    <Footer />
                </InAppNotificationProvider>
            </NotificationPermissionProvider>
            <ToastProvider />
        </AuthProvider>
    </body>
  );
}
