'use client';

import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { LoadingSpinner, ErrorState } from '@/components/common';
import { Button } from '@/components/ui';
import {
  DashboardSummary,
  RecentVoyages,
  RecentDemandes,
  DashboardStatsCard,
  RecentNotifications,
  RecentMessages,
  QuickActions,
} from '@/components/dashboard';
import { useDashboard } from '@/lib/hooks/useDashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, error, refresh } = useDashboard();

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Chargement du dashboard..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Erreur de chargement"
        message={error}
        onRetry={refresh}
      />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenue, {user?.prenom} !
          </h1>
          <p className="text-gray-600 mt-1">
            Voici un aperçu de votre activité
          </p>
        </div>
        <Button variant="outline" onClick={refresh}>
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <DashboardSummary data={data.summary} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Voyages */}
          <RecentVoyages
            voyages={data.voyages.recents}
            total={data.voyages.total}
            actifs={data.voyages.actifs}
          />

          {/* Demandes */}
          <RecentDemandes
            demandes={data.demandes.recentes}
            total={data.demandes.total}
            enCours={data.demandes.enCours}
          />

          {/* Notifications */}
          <RecentNotifications
            notifications={data.notifications.recentes}
            nonLues={data.notifications.nonLues}
          />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Stats */}
          <DashboardStatsCard stats={data.stats} />

          {/* Messages */}
          <RecentMessages
            messages={data.messages.recents}
            nonLus={data.messages.nonLus}
          />
        </div>
      </div>
    </div>
  );
}