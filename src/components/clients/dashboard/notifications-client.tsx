'use client';

import { NotificationList } from '@/components/notification';
import { useNotifications } from '@/lib/hooks';
import { Button } from '@/components/ui';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/common';
import { CheckCheck, Bell } from 'lucide-react';

export default function NotificationsPageClient() {
  const { notifications, isLoading, error, markAsRead, markAllAsRead, deleteNotification, refetch } =
    useNotifications();

  if (isLoading) {
    return (
      <div className="container-custom py-6 sm:py-8">
        <LoadingSpinner text="Chargement des notifications..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-6 sm:py-8">
        <ErrorState
          title="Erreur de chargement"
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  const hasUnread = notifications.some((n) => !n.lue);
  const unreadCount = notifications.filter((n) => !n.lue).length;

  return (
    <div className="container-custom py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        {/* Mobile Header */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                {hasUnread && (
                  <p className="text-xs text-gray-600">
                    {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
            {hasUnread && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<CheckCheck className="w-4 h-4" />}
                onClick={markAllAsRead}
              >
                Tout lire
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex sm:flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Notifications
              {hasUnread && (
                <span className="ml-3 px-2.5 py-0.5 text-sm font-semibold bg-primary text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Restez informé de l&apos;activité de votre compte
            </p>
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
      </div>

      {/* Content */}
      {notifications.length === 0 ? (
        <div className="card p-6 sm:p-8">
          <EmptyState
            title="Aucune notification"
            description="Vous êtes à jour ! Revenez plus tard pour voir vos nouvelles notifications."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats Mobile */}
          <div className="sm:hidden bg-gray-50 rounded-lg p-3 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {notifications.length} notification{notifications.length > 1 ? 's' : ''}
            </span>
            {hasUnread && (
              <span className="text-primary font-medium">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Liste des notifications */}
          <NotificationList
            notifications={notifications}
            onNotificationClick={(notif) => !notif.lue && markAsRead(notif.id)}
            onDismiss={deleteNotification}
            onMarkAllAsRead={markAllAsRead}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}