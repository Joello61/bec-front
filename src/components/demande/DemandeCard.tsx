'use client';

import { motion } from 'framer-motion';
import { MapPin, Package, Clock } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, Avatar } from '@/components/ui';
import DemandeStatusBadge from './DemandeStatusBadge';
import { formatWeight, getDaysRemaining } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import type { Demande } from '@/types';

interface DemandeCardProps {
  demande: Demande;
}

export default function DemandeCard({ demande }: DemandeCardProps) {
  const daysRemaining = demande.dateLimite ? getDaysRemaining(demande.dateLimite) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={ROUTES.DEMANDE_DETAILS(demande.id)}>
        <Card hoverable className="h-full">
          <CardContent className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={demande.client.photo || undefined}
                  fallback={`${demande.client.nom} ${demande.client.prenom}`}
                  size="md"
                  verified={demande.client.emailVerifie}
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {demande.client.prenom} {demande.client.nom}
                  </p>
                  <p className="text-sm text-gray-500">Client</p>
                </div>
              </div>
              <DemandeStatusBadge statut={demande.statut} size="sm" />
            </div>

            {/* Route */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Départ</p>
                  <p className="font-semibold text-gray-900">{demande.villeDepart}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Arrivée</p>
                  <p className="font-semibold text-gray-900">{demande.villeArrivee}</p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{formatWeight(demande.poidsEstime)}</span>
              </div>
              {demande.dateLimite && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className={`${daysRemaining && daysRemaining < 3 ? 'text-error font-medium' : 'text-gray-600'}`}>
                    {daysRemaining !== null && daysRemaining >= 0 ? `${daysRemaining}j restants` : 'Expiré'}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
              {demande.description}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}