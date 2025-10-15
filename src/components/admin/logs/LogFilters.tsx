'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { AdminLogFilters } from '@/types';
import { Select } from '@/components/ui';

interface LogFiltersProps {
  filters: AdminLogFilters;
  onFiltersChange: (filters: AdminLogFilters) => void;
}

export default function LogFilters({ filters, onFiltersChange }: LogFiltersProps) {
  const [localFilters, setLocalFilters] = useState<AdminLogFilters>(filters);

  const actions = [
    { value: 'ban_user', label: 'Bannissement' },
    { value: 'unban_user', label: 'Débannissement' },
    { value: 'update_roles', label: 'Modification rôles' },
    { value: 'delete_user', label: 'Suppression user' },
    { value: 'delete_voyage', label: 'Suppression voyage' },
    { value: 'delete_demande', label: 'Suppression demande' },
    { value: 'delete_avis', label: 'Suppression avis' },
  ];

  const targetTypes = [
    { value: 'user', label: 'Utilisateur' },
    { value: 'voyage', label: 'Voyage' },
    { value: 'demande', label: 'Demande' },
    { value: 'avis', label: 'Avis' },
    { value: 'message', label: 'Message' },
  ];

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleResetFilters = () => {
    const emptyFilters: AdminLogFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const handleActionChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      action: (value || undefined) as AdminLogFilters['action'],
    });
  };

  const handleTargetTypeChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      targetType: (value || undefined) as AdminLogFilters['targetType'],
    });
  };

  const hasActiveFilters = Object.keys(localFilters).some(
    (key) => localFilters[key as keyof AdminLogFilters] !== undefined
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="ml-auto flex items-center gap-1 text-sm text-gray-600 hover:text-error transition-colors"
          >
            <X className="w-4 h-4" />
            Réinitialiser
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Action Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d&apos;action
          </label>
          <Select
            options={[
              { value: '', label: 'Toutes les actions' },
              ...actions.map((action) => ({
                value: action.value,
                label: action.label
              }))
            ]}
            value={localFilters.action || ''}
            onChange={handleActionChange}
            searchable={false}
          />
        </div>

        {/* Target Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de cible
          </label>
          <Select
            options={[
              { value: '', label: 'Tous les types' },
              ...targetTypes.map((type) => ({
                value: type.value,
                label: type.label
              }))
            ]}
            value={localFilters.targetType || ''}
            onChange={handleTargetTypeChange}
            searchable={false}
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de début
          </label>
          <input
            type="date"
            value={localFilters.startDate || ''}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, startDate: e.target.value || undefined })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de fin
          </label>
          <input
            type="date"
            value={localFilters.endDate || ''}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, endDate: e.target.value || undefined })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Apply Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleApplyFilters}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Appliquer les filtres
        </button>
      </div>
    </div>
  );
}