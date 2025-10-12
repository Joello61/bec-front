'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common';
import { Users, Plane, Package, Flag } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type StatType = 'users' | 'voyages' | 'demandes' | 'signalements';

export default function AdminStatsPage() {
  const [activeTab, setActiveTab] = useState<StatType>('users');
  const {
    usersStats,
    voyagesStats,
    demandesStats,
    signalementsStats,
    isLoading,
    error,
    fetchUsersStats,
    fetchVoyagesStats,
    fetchDemandesStats,
    fetchSignalementsStats,
  } = useAdmin();

  useEffect(() => {
    // Charger les stats en fonction de l'onglet actif
    switch (activeTab) {
      case 'users':
        if (!usersStats) fetchUsersStats();
        break;
      case 'voyages':
        if (!voyagesStats) fetchVoyagesStats();
        break;
      case 'demandes':
        if (!demandesStats) fetchDemandesStats();
        break;
      case 'signalements':
        if (!signalementsStats) fetchSignalementsStats();
        break;
    }
  }, [
    activeTab,
    usersStats,
    voyagesStats,
    demandesStats,
    signalementsStats,
    fetchUsersStats,
    fetchVoyagesStats,
    fetchDemandesStats,
    fetchSignalementsStats,
  ]);

  const tabs = [
    { id: 'users' as StatType, label: 'Utilisateurs', icon: Users },
    { id: 'voyages' as StatType, label: 'Voyages', icon: Plane },
    { id: 'demandes' as StatType, label: 'Demandes', icon: Package },
    { id: 'signalements' as StatType, label: 'Signalements', icon: Flag },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-error text-lg font-semibold mb-2">Erreur</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Statistiques Détaillées
        </h1>
        <p className="text-gray-500 mt-1">Analyse approfondie de la plateforme</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md p-2">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all',
                  isActive
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {isLoading ? (
          <LoadingSpinner text="Chargement des statistiques..." />
        ) : (
          <>
            {activeTab === 'users' && usersStats && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Statistiques Utilisateurs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard label="Total" value={usersStats.global.total} />
                  <StatCard label="Actifs" value={usersStats.global.actifs} color="success" />
                  <StatCard label="Bannis" value={usersStats.global.bannis} color="error" />
                  <StatCard
                    label="Nouveaux ce mois"
                    value={usersStats.global.nouveauxCeMois}
                  />
                  <StatCard
                    label="Email vérifiés"
                    value={usersStats.global.emailVerifies}
                  />
                  <StatCard
                    label="Téléphone vérifiés"
                    value={usersStats.global.telephoneVerifies}
                  />
                  <StatCard label="Admins" value={usersStats.global.admins} color="primary" />
                  <StatCard
                    label="Modérateurs"
                    value={usersStats.global.moderators}
                    color="primary"
                  />
                  <StatCard
                    label="Taux vérif. email"
                    value={`${usersStats.global.tauxVerificationEmail.toFixed(1)}%`}
                  />
                </div>
              </div>
            )}

            {activeTab === 'voyages' && voyagesStats && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Statistiques Voyages
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard label="Total" value={voyagesStats.total} />
                  <StatCard label="Actifs" value={voyagesStats.actifs} color="success" />
                  <StatCard label="Complets" value={voyagesStats.complets} />
                  <StatCard label="Terminés" value={voyagesStats.termines} />
                  <StatCard label="Annulés" value={voyagesStats.annules} color="error" />
                  <StatCard
                    label="Nouveaux ce mois"
                    value={voyagesStats.nouveauxCeMois}
                  />
                  <StatCard
                    label="Taux de réussite"
                    value={`${voyagesStats.tauxReussite.toFixed(1)}%`}
                    color="primary"
                  />
                </div>
              </div>
            )}

            {activeTab === 'demandes' && demandesStats && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Statistiques Demandes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard label="Total" value={demandesStats.total} />
                  <StatCard
                    label="En recherche"
                    value={demandesStats.enRecherche}
                    color="warning"
                  />
                  <StatCard
                    label="Voyageur trouvé"
                    value={demandesStats.voyageurTrouve}
                    color="success"
                  />
                  <StatCard
                    label="Annulées"
                    value={demandesStats.annulees}
                    color="error"
                  />
                  <StatCard
                    label="Nouvelles ce mois"
                    value={demandesStats.nouvellesCeMois}
                  />
                  <StatCard
                    label="Taux de réussite"
                    value={`${demandesStats.tauxReussite.toFixed(1)}%`}
                    color="primary"
                  />
                </div>
              </div>
            )}

            {activeTab === 'signalements' && signalementsStats && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Statistiques Signalements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard label="Total" value={signalementsStats.total} />
                  <StatCard
                    label="En attente"
                    value={signalementsStats.enAttente}
                    color="warning"
                  />
                  <StatCard
                    label="Traités"
                    value={signalementsStats.traites}
                    color="success"
                  />
                  <StatCard
                    label="Rejetés"
                    value={signalementsStats.rejetes}
                    color="error"
                  />
                  <StatCard
                    label="Nouveaux ce mois"
                    value={signalementsStats.nouveauxCeMois}
                  />
                  <StatCard
                    label="Taux de traitement"
                    value={`${signalementsStats.tauxTraitement.toFixed(1)}%`}
                    color="primary"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Composant StatCard
function StatCard({
  label,
  value,
  color = 'default',
}: {
  label: string;
  value: string | number;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}) {
  const colorClasses = {
    default: 'text-gray-900',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  };

  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <div className={cn('text-3xl font-bold', colorClasses[color])}>{value}</div>
      <div className="text-sm text-gray-600 mt-2">{label}</div>
    </div>
  );
}