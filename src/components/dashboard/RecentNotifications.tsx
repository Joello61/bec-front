'use client';

import { motion } from 'framer-motion';
import { Bell, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { NotificationItem } from '@/components/notification';
import { ROUTES } from '@/lib/utils/constants';
import type { DashboardNotification, AppNotificationType } from '@/types';
import { EmptyState } from '@/components/common';

interface RecentNotificationsProps {
  notifications: DashboardNotification[];
  nonLues: number;
}

export default function RecentNotifications({ notifications, nonLues }: RecentNotificationsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-primary" />
              {nonLues > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {nonLues > 9 ? '9+' : nonLues}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">
                {nonLues > 0 ? `${nonLues} non lue${nonLues > 1 ? 's' : ''}` : 'Toutes vos notifications'}
              </p>
            </div>
          </div>
          <Link href={ROUTES.NOTIFICATIONS}>
            <Button size="sm" variant="outline">
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* List */}
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-16 h-16 text-gray-400" />}
            title="Aucune notification"
            description="Vous êtes à jour !"
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NotificationItem
                  notification={{
                    ...notification,
                    type: notification.type as AppNotificationType,
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}