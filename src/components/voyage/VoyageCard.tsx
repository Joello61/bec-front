'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Package } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, Avatar } from '@/components/ui';
import VoyageStatusBadge from './VoyageStatusBadge';
import { formatDateShort, formatWeight } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import type { Voyage } from '@/types';
import { usePathname } from 'next/navigation';
import { Route } from 'next';

interface VoyageCardProps {
  voyage: Voyage;
}

export default function VoyageCard({ voyage }: VoyageCardProps) {

  const pathname = usePathname();

  let link = '' as Route;

  if(pathname?.includes('dashboard')) {
    link = ROUTES.MES_VOYAGE_DETAILS(voyage.id)
  } else {
    link = ROUTES.SEARCH_VOYAGE_DETAILS(voyage.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={link}>
        <Card hoverable className="h-full">
          <CardContent className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={voyage.voyageur.photo || undefined}
                  fallback={`${voyage.voyageur.nom} ${voyage.voyageur.prenom}`}
                  size="md"
                  verified={voyage.voyageur.emailVerifie}
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {voyage.voyageur.prenom} {voyage.voyageur.nom}
                  </p>
                  <p className="text-sm text-gray-500">Voyageur</p>
                </div>
              </div>
              <VoyageStatusBadge statut={voyage.statut} size="sm" />
            </div>

            {/* Route */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Départ</p>
                  <p className="font-semibold text-gray-900">{voyage.villeDepart}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Arrivée</p>
                  <p className="font-semibold text-gray-900">{voyage.villeArrivee}</p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{formatDateShort(voyage.dateDepart)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{formatWeight(voyage.poidsDisponible)}</span>
              </div>
            </div>

            {/* Description */}
            {voyage.description && (
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                {voyage.description}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}