'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Star, Package, FileText, X, Lightbulb } from 'lucide-react';
import { formatDateRelative } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { AppNotification, AppNotificationType } from '@/types';

interface NotificationItemProps {
  notification: AppNotification;
  onClick?: () => void;
  onDismiss?: () => void;
}

const notificationIcons: Record<AppNotificationType, React.ReactNode> = {
  matching_voyage: <Package className="w-5 h-5" />,
  matching_demande: <FileText className="w-5 h-5" />,
  new_message: <MessageCircle className="w-5 h-5" />,
  avis_recu: <Star className="w-5 h-5" />,
  voyage_statut: <Package className="w-5 h-5" />,
  demande_statut: <FileText className="w-5 h-5" />,
  new_proposition: <Lightbulb className="w-5 h-5" />
};

export default function NotificationItem({ notification, onClick, onDismiss }: NotificationItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        'relative p-3 sm:p-4 flex items-start gap-3 border-2 rounded-lg transition-all cursor-pointer',
        'hover:shadow-md active:scale-[0.98]',
        !notification.lue 
          ? 'bg-primary/5 border-primary/20 hover:bg-primary/10' 
          : 'border-gray-200 hover:bg-gray-50'
      )}
      onClick={onClick}
    >
      {/* Indicateur non lu - Mobile (point sur l'icône) */}
      {!notification.lue && (
        <span className="absolute top-2 left-2 w-2 h-2 bg-primary rounded-full sm:hidden" />
      )}

      {/* Icon */}
      <div className={cn(
        'w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0',
        !notification.lue ? 'bg-primary/15 text-primary' : 'bg-gray-100 text-gray-600'
      )}>
        {notificationIcons[notification.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-8 sm:pr-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className={cn(
            'text-sm sm:text-base font-medium leading-tight',
            !notification.lue ? 'text-gray-900' : 'text-gray-700'
          )}>
            {notification.titre}
          </h4>
          {/* Indicateur non lu - Desktop */}
          {!notification.lue && (
            <span className="hidden sm:block w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
          )}
        </div>

        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-1.5">
          {notification.message}
        </p>

        <p className="text-xs text-gray-500">
          {formatDateRelative(notification.createdAt)}
        </p>
      </div>

      {/* Dismiss Button */}
      {onDismiss && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className={cn(
            'absolute top-2 right-2 sm:relative sm:top-0 sm:right-0',
            'p-1.5 sm:p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0',
            'z-10'
          )}
          aria-label="Supprimer la notification"
        >
          <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </motion.div>
  );
}
