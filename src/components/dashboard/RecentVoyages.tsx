'use client';

import { motion } from 'framer-motion';
import { Plane, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import { formatDateShort, formatWeight } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import type { DashboardVoyage } from '@/types';
import { EmptyState } from '@/components/common';

interface RecentVoyagesProps {
  voyages: DashboardVoyage[];
  total: number;
  actifs: number;
}

export default function RecentVoyages({ voyages, total, actifs }: RecentVoyagesProps) {
  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Mes Voyages</h2>
              <p className="text-sm text-gray-500">
                {actifs} actif{actifs > 1 ? 's' : ''} sur {total} total
              </p>
            </div>
          </div>
          <Link href={ROUTES.MES_VOYAGES}>
            <Button size="sm" variant="outline">
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* List */}
        {voyages.length === 0 ? (
          <EmptyState
            icon={<Plane className="w-16 h-16 text-gray-400" />}
            title="Aucun voyage"
            description="Vous n'avez pas encore créé de voyage"
            action={{
              label: "Créer un voyage",
              onClick: () => window.location.href = ROUTES.MES_VOYAGES
            }}
          />
        ) : (
          <div className="space-y-3">
            {voyages.map((voyage, index) => (
              <motion.div
                key={voyage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={ROUTES.MES_VOYAGE_DETAILS(voyage.id)}>
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{voyage.villeDepart}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{voyage.villeArrivee}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{formatDateShort(voyage.dateDepart)}</span>
                          <span>•</span>
                          <span>{formatWeight(voyage.poidsDisponible)} disponible</span>
                        </div>
                      </div>
                      <Badge variant={voyage.statut === 'actif' ? 'success' : 'neutral'}>
                        {voyage.statut}
                      </Badge>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        {voyages.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link href={ROUTES.MES_VOYAGES}>
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4" />
                Créer un nouveau voyage
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}