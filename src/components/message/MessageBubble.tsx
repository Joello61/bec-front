'use client';

import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { formatDateRelative } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
}

export default function MessageBubble({ message, isOwn, showAvatar = true }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex gap-3',
        isOwn ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <Avatar
          src={message.expediteur.photo || undefined}
          fallback={`${message.expediteur.nom} ${message.expediteur.prenom}`}
          size="sm"
        />
      )}

      {/* Message Content */}
      <div className={cn('flex flex-col max-w-[70%]', isOwn && 'items-end')}>
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl',
            isOwn
              ? 'bg-primary text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.contenu}</p>
        </div>

        {/* Meta Info */}
        <div className={cn('flex items-center gap-1 mt-1 px-2', isOwn && 'flex-row-reverse')}>
          <span className="text-xs text-gray-500">
            {formatDateRelative(message.createdAt)}
          </span>
          {isOwn && (
            <span className="text-primary">
              {message.lu ? (
                <CheckCheck className="w-3.5 h-3.5" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}