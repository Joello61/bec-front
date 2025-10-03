'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import VoyageCard from '@/components/voyage/VoyageCard';
import DemandeCard from '@/components/demande/DemandeCard';
import { cn } from '@/lib/utils/cn';
import type { Favori } from '@/types';

interface FavoritesListProps {
  favorisVoyages: Favori[];
  favorisDemandes: Favori[];
  onRemove: (id: number) => Promise<void>;
  isLoading?: boolean;
}

type TabType = 'voyages' | 'demandes';

export default function FavoritesList({ 
  favorisVoyages, 
  favorisDemandes, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRemove,
  isLoading = false 
}: FavoritesListProps) {
  const [activeTab, setActiveTab] = useState<TabType>('voyages');

  const tabs = [
    { id: 'voyages' as TabType, label: 'Voyages', count: favorisVoyages.length },
    { id: 'demandes' as TabType, label: 'Demandes', count: favorisDemandes.length },
  ];

  const currentItems = activeTab === 'voyages' ? favorisVoyages : favorisDemandes;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="h-48 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-3 text-sm font-medium transition-colors relative',
              activeTab === tab.id
                ? 'text-primary'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {tab.label} ({tab.count})
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {currentItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun favori
          </h3>
          <p className="text-gray-600">
            Commencez à ajouter des {activeTab === 'voyages' ? 'voyages' : 'demandes'} à vos favoris
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((favori) =>
            activeTab === 'voyages' && favori.voyage ? (
              <VoyageCard key={favori.id} voyage={favori.voyage} />
            ) : activeTab === 'demandes' && favori.demande ? (
              <DemandeCard key={favori.id} demande={favori.demande} />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}