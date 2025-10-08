'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck, MoreVertical, Flag } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { formatDateRelative } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  onSignaler?: (messageId: number) => void;
}

export default function MessageBubble({ 
  message, 
  isOwn, 
  showAvatar = true,
  onSignaler 
}: MessageBubbleProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleSignaler = () => {
    setShowMenu(false);
    onSignaler?.(message.id);
  };

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
      <div className={cn('flex flex-col max-w-[70%] relative group', isOwn && 'items-end')}>
        {/* Menu Button - Only for messages from others */}
        {!isOwn && onSignaler && (
          <div className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Options du message"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  {/* Overlay to close menu */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
                  >
                    <button
                      onClick={handleSignaler}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Flag className="w-4 h-4 text-error" />
                      <span>Signaler</span>
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        )}

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