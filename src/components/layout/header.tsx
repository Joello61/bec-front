'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import PublicHeader from './PublicHeader';
import AuthenticatedHeader from './AuthenticatedHeader';

export default function Header() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isAuthPage = pathname?.includes('/auth');

  if (isAuthPage) {
    return null;
  }

  return isAuthenticated ? <AuthenticatedHeader /> : <PublicHeader />;
}
