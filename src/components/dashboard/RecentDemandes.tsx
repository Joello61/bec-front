'use client';

import { motion } from 'framer-motion';
import { Package, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import { formatWeight, getDaysRemaining } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import type { DashboardDemande } from '@/types';
import { EmptyState } from '@/components/common';

interface RecentDemandesProps {
  demandes: DashboardDemande[];
  total: number;
  enCours: number;
}

export default function RecentDemandes({ demandes, total, enCours }: RecentDemandesProps) {
  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Mes Demandes</h2>
              <p className="text-sm text-gray-500">
                {enCours} en cours sur {total} total
              </p>
            </div>
          </div>
          <Link href={ROUTES.MES_DEMANDES}>
            <Button size="sm" variant="outline">
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* List */}
        {demandes.length === 0 ? (
          <EmptyState
            icon={<Package className="w-16 h-16 text-gray-400" />}
            title="Aucune demande"
            description="Vous n'avez pas encore créé de demande"
            action={{
              label: "Créer une demande",
              onClick: () => window.location.href = ROUTES.MES_DEMANDES
            }}
          />
        ) : (
          <div className="space-y-3">
            {demandes.map((demande, index) => {
              const daysRemaining = demande.dateLimite ? getDaysRemaining(demande.dateLimite) : null;
              
              return (
                <motion.div
                  key={demande.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={ROUTES.MES_DEMANDE_DETAILS(demande.id)}>
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-secondary hover:bg-secondary/5 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{demande.villeDepart}</span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{demande.villeArrivee}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span>{formatWeight(demande.poidsEstime)}</span>
                            {daysRemaining !== null && (
                              <>
                                <span>•</span>
                                <span className={daysRemaining < 3 && daysRemaining >= 0 ? 'text-error font-medium' : ''}>
                                  {daysRemaining >= 0 ? `${daysRemaining}j restants` : 'Expiré'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge variant={demande.statut === 'en_recherche' ? 'info' : demande.statut === 'voyageur_trouve' ? 'success' : 'error'}>
                          {demande.statut === 'en_recherche' ? 'En recherche' : demande.statut === 'voyageur_trouve' ? 'Voyageur trouvé' : 'Annulée'}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        {demandes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link href={ROUTES.MES_DEMANDES}>
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4" />
                Créer une nouvelle demande
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}