'use client';

import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/utils/constants';

export default function AdminModerationAvisPage() {
  const [search, setSearch] = useState('');

  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push(ROUTES.ADMIN_MODERATION)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Modération des Avis
          </h1>
          <p className="text-gray-500 mt-1">
            Gérer les avis et notes des utilisateurs
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un avis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Reset */}
          <button
            onClick={() => setSearch('')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Info :</strong> La suppression d&apos;un avis notifiera automatiquement
          l&apos;auteur et la cible, et enregistrera l&apos;action dans les logs d&apos;administration.
        </p>
      </div>

      {/* Coming Soon Placeholder */}
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚧</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Fonctionnalité en cours de développement
          </h3>
          <p className="text-gray-600 mb-6">
            La gestion des avis depuis l&apos;interface admin sera bientôt disponible.
            Pour le moment, utilisez les endpoints API directement.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <p className="text-sm font-medium text-gray-700 mb-2">Endpoints disponibles :</p>
            <code className="text-xs text-gray-600 block">
              DELETE /api/admin/moderation/avis/:id
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}