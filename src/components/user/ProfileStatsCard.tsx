import { User as UserIcon, MapPin, Package, Star } from 'lucide-react';
import { Card } from '@/components/ui';
import type { DashboardData } from '@/types';

interface ProfileStatsCardProps {
  stats: DashboardData | null;
}

export default function ProfileStatsCard({ stats }: ProfileStatsCardProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <UserIcon className="w-5 h-5 text-primary" />
        Statistiques
      </h3>

      <div className="space-y-4">
        {/* Voyages */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Voyages</span>
          </div>
          <span className="font-semibold text-gray-900">
            {stats?.voyages.total || 0}
          </span>
        </div>

        {/* Demandes */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Demandes</span>
          </div>
          <span className="font-semibold text-gray-900">
            {stats?.demandes.total || 0}
          </span>
        </div>

        {/* Note moyenne */}
        {stats?.stats !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className={`w-4 h-4 ${stats.stats.nombreAvis > 0 ? 'text-warning' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-600">Note moyenne</span>
            </div>
            {stats.stats.nombreAvis > 0 ? (
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-900">
                  {stats.stats.noteMoyenne.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500">
                  ({stats.stats.nombreAvis} avis)
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-500">
                Aucun avis
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
