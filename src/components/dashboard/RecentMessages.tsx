'use client';

import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, Avatar } from '@/components/ui';
import { Button } from '@/components/ui';
import { formatDateRelative } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import type { DashboardMessage } from '@/types';
import { EmptyState } from '@/components/common';
import { cn } from '@/lib/utils/cn';

interface RecentMessagesProps {
  messages: DashboardMessage[];
  nonLus: number;
}

export default function RecentMessages({ messages, nonLus }: RecentMessagesProps) {
  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center relative">
              <MessageCircle className="w-5 h-5 text-primary" />
              {nonLus > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {nonLus > 9 ? '9+' : nonLus}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <p className="text-sm text-gray-500">
                {nonLus > 0 ? `${nonLus} non lu${nonLus > 1 ? 's' : ''}` : 'Tous vos messages'}
              </p>
            </div>
          </div>
          <Link href={ROUTES.MESSAGES}>
            <Button size="sm" variant="outline">
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* List */}
        {messages.length === 0 ? (
        <EmptyState
            icon={<MessageCircle className="w-16 h-16 text-gray-400" />}
            title="Aucun message"
            description="Votre messagerie est vide"
        />
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={ROUTES.CONVERSATION(message.expediteur.id)}>
                  <div
                    className={cn(
                      'p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all',
                      !message.lu && 'bg-accent/5 border-accent/30'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        fallback={`${message.expediteur.nom} ${message.expediteur.prenom}`}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1 text-primary">
                          <p className={cn('text-sm font-medium', !message.lu && 'text-gray-900')}>
                            {message.expediteur.prenom} {message.expediteur.nom}
                          </p>
                          {!message.lu && (
                            <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {message.contenu}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDateRelative(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}