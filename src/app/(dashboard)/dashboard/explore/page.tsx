'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Package } from 'lucide-react';
import { VoyageList, VoyageFilters } from '@/components/voyage';
import { DemandeList, DemandeFilters } from '@/components/demande';
import { useVoyages, useDemandes, useAuth, useFavorisDemandes, useFavorisVoyages } from '@/lib/hooks';
import { EmptyState, LoadingSpinner } from '@/components/common';
import { cn } from '@/lib/utils/cn';
import type { VoyageFilters as VoyageFiltersType, DemandeFilters as DemandeFiltersType } from '@/types';

type TabType = 'voyages' | 'demandes';

export default function RechercherPage() {
  const [activeTab, setActiveTab] = useState<TabType>('voyages');
  const [voyageFilters, setVoyageFilters] = useState<VoyageFiltersType>({});
  const [demandeFilters, setDemandeFilters] = useState<DemandeFiltersType>({});
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAuth();

  // Charger les favoris pour afficher les icônes cœur
  const {} = useFavorisDemandes();
  const {} = useFavorisVoyages();

  // Éviter le bug d'animation au premier rendu
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { voyages, isLoading: voyagesLoading } = useVoyages(1, 12, voyageFilters);
  const { demandes, isLoading: demandesLoading } = useDemandes(1, 12, demandeFilters);

  // ==================== FILTRAGE OPTIMISÉ AVEC USEMEMO ====================
  // Exclure les voyages/demandes de l'utilisateur connecté
  const filteredVoyages = useMemo(() => {
    if (!voyages) return [];
    if (!user) return voyages;
    return voyages.filter(voyage => voyage.voyageur.id !== user.id);
  }, [voyages, user]);

  const filteredDemandes = useMemo(() => {
    if (!demandes) return [];
    if (!user) return demandes;
    return demandes.filter(demande => demande.client.id !== user.id);
  }, [demandes, user]);

  // ==================== TABS CONFIG ====================
  const tabs = useMemo(() => [
    {
      id: 'voyages' as TabType,
      label: 'Voyages',
      icon: Plane,
      count: filteredVoyages.length,
    },
    {
      id: 'demandes' as TabType,
      label: 'Demandes',
      icon: Package,
      count: filteredDemandes.length,
    },
  ], [filteredVoyages.length, filteredDemandes.length]);

  // ==================== HANDLERS ====================
  const handleVoyageFilterChange = (newFilters: VoyageFiltersType) => {
    setVoyageFilters(newFilters);
  };

  const handleDemandeFilterChange = (newFilters: DemandeFiltersType) => {
    setDemandeFilters(newFilters);
  };

  // ==================== RENDER CONDITIONS ====================
  const hasVoyageFilters = Object.keys(voyageFilters).some(key => voyageFilters[key as keyof VoyageFiltersType]);
  const hasDemandeFilters = Object.keys(demandeFilters).some(key => demandeFilters[key as keyof DemandeFiltersType]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Explorer les opportunités
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les voyages disponibles ou les demandes de transport à satisfaire
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-8">
          <div className="grid grid-cols-2 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="cursor-pointer relative"
                >
                  <div
                    className={cn(
                      'relative flex items-center justify-center gap-3 px-4 py-4 rounded-xl font-medium transition-colors',
                      'md:flex-row md:justify-center',
                      isActive
                        ? 'text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {/* Background animé - uniquement après le premier rendu */}
                    {isMounted && isActive && (
                      <motion.div
                        layoutId="activeTabBackground"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary-dark shadow-lg"
                        initial={false}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 400, 
                          damping: 30 
                        }}
                      />
                    )}

                    {/* Background statique pour le premier rendu */}
                    {!isMounted && isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary-dark shadow-lg" />
                    )}

                    <div className="relative flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg items-center justify-center transition-all hidden lg:flex',
                        isActive ? 'bg-white/20' : 'bg-gray-100'
                      )}>
                        <Icon className={cn(
                          'w-5 h-5',
                          isActive ? 'text-white' : 'text-gray-600'
                        )} />
                      </div>

                      <div className="flex flex-col items-center md:items-start">
                        <span className="text-sm text-center md:text-left font-semibold">
                          {tab.label}
                        </span>
                        <span
                          className={cn(
                            'text-xs text-center md:text-left',
                            isActive ? 'text-white/80' : 'text-gray-500'
                          )}
                        >
                          {tab.count} disponible{tab.count > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'voyages' ? (
              <VoyageFilters
                onFilterChange={handleVoyageFilterChange}
                initialFilters={voyageFilters}
              />
            ) : (
              <DemandeFilters
                onFilterChange={handleDemandeFilterChange}
                initialFilters={demandeFilters}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-content`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-8"
          >
            {activeTab === 'voyages' ? (
              <>
                {voyagesLoading && filteredVoyages.length === 0 ? (
                  <LoadingSpinner text="Chargement des voyages..." />
                ) : filteredVoyages.length === 0 && !hasVoyageFilters ? (
                  <EmptyState
                    title="Aucun voyage disponible"
                    description="Il n'y a pas de voyages disponibles pour le moment"
                    icon={<Plane className="w-12 h-12 text-gray-400" />}
                  />
                ) : filteredVoyages.length === 0 && hasVoyageFilters ? (
                  <EmptyState
                    title="Aucun voyage ne correspond"
                    description="Essayez de modifier vos critères de recherche"
                    icon={<Plane className="w-12 h-12 text-gray-400" />}
                    action={{
                      label: 'Effacer les filtres',
                      onClick: () => setVoyageFilters({}),
                    }}
                  />
                ) : (
                  <VoyageList
                    voyages={filteredVoyages}
                    isLoading={voyagesLoading}
                  />
                )}
              </>
            ) : (
              <>
                {demandesLoading && filteredDemandes.length === 0 ? (
                  <LoadingSpinner text="Chargement des demandes..." />
                ) : filteredDemandes.length === 0 && !hasDemandeFilters ? (
                  <EmptyState
                    title="Aucune demande active"
                    description="Il n'y a pas de demandes disponibles pour le moment"
                    icon={<Package className="w-12 h-12 text-gray-400" />}
                  />
                ) : filteredDemandes.length === 0 && hasDemandeFilters ? (
                  <EmptyState
                    title="Aucune demande ne correspond"
                    description="Essayez de modifier vos critères de recherche"
                    icon={<Package className="w-12 h-12 text-gray-400" />}
                    action={{
                      label: 'Effacer les filtres',
                      onClick: () => setDemandeFilters({}),
                    }}
                  />
                ) : (
                  <DemandeList
                    demandes={filteredDemandes}
                    isLoading={demandesLoading}
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}