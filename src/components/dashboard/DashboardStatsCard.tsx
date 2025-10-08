'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Award, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import type { DashboardStats } from '@/types';

interface DashboardStatsCardProps {
  stats: DashboardStats;
}

export default function DashboardStatsCard({ stats }: DashboardStatsCardProps) {
  const maxNotes = Math.max(...Object.values(stats.repartitionNotes));

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Mes Statistiques</h2>
            <p className="text-sm text-gray-500">Vos performances</p>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg h-f">
            <div className="text-2xl font-bold text-primary">{stats.voyagesEffectues}</div>
            <div className="text-sm text-gray-600 mt-1">Voyages effectués</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.bagagesTransportes}</div>
            <div className="text-sm text-gray-600 mt-1">Bagages transportés</div>
          </div>
        </div>

        {/* Rating */}
        {stats.nombreAvis > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium text-gray-700">Note moyenne</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{stats.noteMoyenne.toFixed(1)}</span>
                <Star className="w-5 h-5 fill-warning text-warning" />
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600 mb-3">Répartition des notes ({stats.nombreAvis} avis)</p>
              {[5, 4, 3, 2, 1].map((note) => {
                const count = stats.repartitionNotes[note as keyof typeof stats.repartitionNotes];
                const percentage = stats.nombreAvis > 0 ? (count / stats.nombreAvis) * 100 : 0;
                const barWidth = maxNotes > 0 ? (count / maxNotes) * 100 : 0;

                return (
                  <div key={note} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600 w-6">{note}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.5, delay: (5 - note) * 0.1 }}
                        className="h-full bg-warning rounded-full"
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-12 text-right">
                      {count > 0 ? `${percentage.toFixed(0)}%` : '0%'}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Aucun avis reçu pour le moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}