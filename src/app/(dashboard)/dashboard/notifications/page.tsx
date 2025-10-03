'use client';

import { NotificationList } from '@/components/notification';
import { useNotifications } from '@/lib/hooks';
import { Button } from '@/components/ui';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/common';
import { CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, isLoading, error, markAsRead, markAllAsRead, deleteNotification, refetch } =
    useNotifications();

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <LoadingSpinner text="Chargement des notifications..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <ErrorState
          title="Erreur de chargement"
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  const hasUnread = notifications.some((n) => !n.lue);

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">Restez informé de l&apos;activité de votre compte</p>
        </div>
        {hasUnread && (
          <Button
            variant="outline"
            leftIcon={<CheckCheck className="w-5 h-5" />}
            onClick={markAllAsRead}
          >
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* Content */}
      {notifications.length === 0 ? (
        <EmptyState
          title="Aucune notification"
          description="Vous êtes à jour ! Revenez plus tard pour voir vos nouvelles notifications."
        />
      ) : (
        <NotificationList
          notifications={notifications}
          onNotificationClick={(notif) => !notif.lue && markAsRead(notif.id)}
          onDismiss={deleteNotification}
          onMarkAllAsRead={markAllAsRead}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}