'use client';

import { ReactNode } from 'react';

import { Footer, Header } from '@/components/layout';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { InAppNotificationProvider } from '@/components/providers/InAppNotificationProvider';
import { NotificationPermissionProvider } from '@/components/providers/NotificationPermissionProvider';
import PWAProvider from '@/components/providers/PWAProvider';
import ToastProvider from '@/components/providers/ToastProvider';

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
