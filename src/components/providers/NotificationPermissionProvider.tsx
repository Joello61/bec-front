'use client';

import React from 'react';

import { useRequestNotificationPermission } from '@/lib/hooks/useRequestNotificationPermission';

export function NotificationPermissionProvider({ children }: { children: React.ReactNode }) {
  useRequestNotificationPermission();

  return <>{children}</>;
}