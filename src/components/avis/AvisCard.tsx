'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Avatar, Card, CardContent } from '@/components/ui';
import StarRating from './StarRating';
import { formatDateRelative } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import type { Avis } from '@/types';
import { ArrowRight } from 'lucide-react';

interface AvisCardProps {
  avis: Avis;
}

export default function AvisCard({ avis }: AvisCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <Link
              href={ROUTES.USER_PROFILE(avis.auteur.id)}
              className="flex items-center gap-3 group"
            >
              <Avatar
                src={avis.auteur.photo || undefined}
                fallback={`${avis.auteur.nom} ${avis.auteur.prenom}`}
                size="md"
                verified={avis.auteur.emailVerifie}
              />
              <div>
                <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                  {avis.auteur.prenom} {avis.auteur.nom}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDateRelative(avis.createdAt)}
                </p>
              </div>
            </Link>

            <StarRating rating={avis.note} size="sm" />
          </div>

          {/* Comment */}
          {avis.commentaire && (
            <p className="text-gray-700 mt-3">{avis.commentaire}</p>
          )}

          {/* Voyage Link */}
          {avis.voyage && (
            <Link
              href={ROUTES.VOYAGE_DETAILS(avis.voyage.id)}
              className="mt-3 inline-flex items-center text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Voir le voyage <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}