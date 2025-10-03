'use client';

import { useAuthStore } from '@/lib/store';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    // Vérifier si l'utilisateur a un cookie JWT valide
    fetchMe();
  }, [fetchMe]);

  return <>{children}</>;
}