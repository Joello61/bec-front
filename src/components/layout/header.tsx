'use client';

import { usePathname } from 'next/navigation';

import { useAuth } from '@/lib/hooks';

import AuthenticatedHeader from './AuthenticatedHeader';
import PublicHeader from './PublicHeader';

export default function Header() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isAuthPage = pathname?.includes('/auth');

  if (isAuthPage) {
    return null;
  }

  return isAuthenticated ? <AuthenticatedHeader /> : <PublicHeader />;
}
