'use client';

import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

import ToastProvider from '@/components/providers/ToastProvider';
import { usePathname } from 'next/navigation';
import { Footer, Header } from '@/components/layout';
import { AuthProvider } from '@/components/providers/AuthProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname()

  const isAuthPage = pathname?.includes('/auth')
  const isAdminPage = pathname?.includes('/admin')
  const isDashboardPage = pathname?.includes('/dashboard')

  return (
    <html lang="fr" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          {isAuthPage ? null : <Header />}

          {children}

          {(isAuthPage || isDashboardPage || isAdminPage) ? null : <Footer />}
        </AuthProvider>
        <ToastProvider />
      </body>
    </html>
  );
}