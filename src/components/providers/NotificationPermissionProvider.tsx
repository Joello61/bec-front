'use client';

import { useRequestNotificationPermission } from '@/lib/hooks/useRequestNotificationPermission';
import React from 'react';

export function NotificationPermissionProvider({ children }: { children: React.ReactNode }) {
  useRequestNotificationPermission();

  return <>{children}</>;
}