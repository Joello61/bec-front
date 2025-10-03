'use client';

import { motion } from 'framer-motion';
import { Star, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, Avatar, Button } from '@/components/ui';
import { ROUTES } from '@/lib/utils/constants';
import type { User } from '@/types';

interface UserCardProps {
  user: User;
  averageRating?: number;
  totalAvis?: number;
  onMessage?: () => void;
}

export default function UserCard({ user, averageRating, totalAvis, onMessage }: UserCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hoverable>
        <CardContent className="p-5">
          <Link href={ROUTES.USER_PROFILE(user.id)} className="block mb-4">
            <div className="flex flex-col items-center text-center">
              <Avatar
                src={user.photo || undefined}
                fallback={`${user.nom} ${user.prenom}`}
                size="lg"
                verified={user.emailVerifie}
              />
              <h3 className="mt-3 font-semibold text-gray-900">
                {user.prenom} {user.nom}
              </h3>
              
              {user.bio && (
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {user.bio}
                </p>
              )}
            </div>
          </Link>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 py-3 border-y border-gray-200">
            {averageRating !== undefined && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
                {totalAvis !== undefined && (
                  <span className="text-gray-500">({totalAvis})</span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          {onMessage && (
            <div className="mt-4">
              <Button
                variant="primary"
                onClick={onMessage}
                leftIcon={<MessageCircle className="w-4 h-4" />}
                className="w-full"
              >
                Contacter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}