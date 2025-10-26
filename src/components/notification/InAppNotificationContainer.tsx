'use client';

import { AnimatePresence } from 'framer-motion';
import { InAppNotification } from './InAppNotification.tsx';

interface NotificationData {
  id: string;
  title: string;
  message: string;
  icon?: React.ReactNode;
  duration?: number;
}

interface InAppNotificationContainerProps {
  notifications: NotificationData[];
  onClose: (id: string) => void;
}

export function InAppNotificationContainer({
  notifications,
  onClose,
}: InAppNotificationContainerProps) {
  return (
    <div
      aria-live="assertive"
      className="fixed top-4 right-4 z-[100] flex flex-col items-end w-full max-w-sm pointer-events-none p-4 sm:p-0"
    >
      <AnimatePresence initial={false}>
        {notifications.map((notification) => (
          <InAppNotification
            key={notification.id}
            {...notification}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
