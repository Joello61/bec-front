'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/utils/constants';

interface NotificationBellProps {
  count: number;
  onClick?: () => void;
  asLink?: boolean;
}

export default function NotificationBell({ count, onClick, asLink = true }: NotificationBellProps) {
  const hasNotifications = count > 0;

  const BellButton = (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label={`${count} notifications non lues`}
    >
      <Bell className="w-6 h-6 text-gray-700" />
      <AnimatePresence>
        {hasNotifications && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {count > 9 ? '9+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );

  if (asLink) {
    return <Link href={ROUTES.NOTIFICATIONS}>{BellButton}</Link>;
  }

  return BellButton;
}