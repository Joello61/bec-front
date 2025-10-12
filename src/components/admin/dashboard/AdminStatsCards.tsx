'use client';

import { motion } from 'framer-motion';
import { Users, Plane, Package, Flag, TrendingUp, TrendingDown } from 'lucide-react';
import type { AdminUsersStats, AdminVoyagesStats, AdminDemandesStats, AdminSignalementsStats } from '@/types';

interface AdminStatsCardsProps {
  users: AdminUsersStats;
  voyages: AdminVoyagesStats;
  demandes: AdminDemandesStats;
  signalements: AdminSignalementsStats;
}

export default function AdminStatsCards({ users, voyages, demandes, signalements }: AdminStatsCardsProps) {
  const stats = [
    {
      title: 'Utilisateurs',
      total: users.total,
      active: users.actifs,
      newToday: users.nouveauxAujourdhui,
      icon: Users,
      color: 'primary',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
    },
    {
      title: 'Voyages',
      total: voyages.total,
      active: voyages.actifs,
      newToday: voyages.nouveauxAujourdhui,
      icon: Plane,
      color: 'secondary',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary',
    },
    {
      title: 'Demandes',
      total: demandes.total,
      active: demandes.enRecherche,
      newToday: demandes.nouvellesAujourdhui,
      icon: Package,
      color: 'info',
      bgColor: 'bg-info/10',
      textColor: 'text-info',
    },
    {
      title: 'Signalements',
      total: signalements.total,
      active: signalements.enAttente,
      newToday: signalements.nouveauxCeMois,
      icon: Flag,
      color: 'warning',
      bgColor: 'bg-warning/10',
      textColor: 'text-warning',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const hasGrowth = stat.newToday > 0;

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              {hasGrowth ? (
                <div className="flex items-center gap-1 text-success text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  +{stat.newToday}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-400 text-sm font-medium">
                  <TrendingDown className="w-4 h-4" />
                  0
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.total}</p>
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-semibold">{stat.active}</span> actifs
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}