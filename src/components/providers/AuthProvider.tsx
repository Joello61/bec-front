'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  // On lance la récupération de l’utilisateur au montage
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return <>{children}</>;
}
