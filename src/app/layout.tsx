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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname()

  const isAuthPage = pathname?.includes('/auth')

  return (
    <html lang="fr" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-gray-50">

        {isAuthPage ? null : <Header />}

        {children}

        {isAuthPage ? null : <Footer />}
        <ToastProvider />
      </body>
    </html>
  );
}