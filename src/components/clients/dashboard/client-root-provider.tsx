'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { NotificationPermissionProvider } from '@/components/providers/NotificationPermissionProvider';
import { InAppNotificationProvider } from '@/components/providers/InAppNotificationProvider';
import ToastProvider from '@/components/providers/ToastProvider';
import { Footer, Header } from '@/components/layout';
import PWAProvider from '@/components/providers/PWAProvider';

export default function ClientRootProvider({ children }: { children: ReactNode }) {
  
  return (
    <div>
        <PWAProvider>
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
        </PWAProvider>
    </div>
  );
}
