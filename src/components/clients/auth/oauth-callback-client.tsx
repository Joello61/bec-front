'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import OAuthCallbackContent from '@/components/auth/OAuthCallBackContent';

export default function OAuthCallbackPageClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  );
}