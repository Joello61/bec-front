'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Package, SlidersHorizontal, X } from 'lucide-react';
import { VoyageList, VoyageFilters } from '@/components/voyage';
import { DemandeList, DemandeFilters } from '@/components/demande';
import { useVoyages, useDemandes, useFavorisDemandes, useFavorisVoyages } from '@/lib/hooks';
import { EmptyState, LoadingSpinner } from '@/components/common';
import { cn } from '@/lib/utils/cn';
import type { VoyageFilters as VoyageFiltersType, DemandeFilters as DemandeFiltersType } from '@/types';

type TabType = 'voyages' | 'demandes';

export default function RechercherPageClient() {
  const [activeTab, setActiveTab] = useState<TabType>('voyages');
  const [voyageFilters, setVoyageFilters] = useState<VoyageFiltersType>({});
  const [demandeFilters, setDemandeFilters] = useState<DemandeFiltersType>({});
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  const [currentVoyagePage, setCurrentVoyagePage] = useState(1);
  const [currentDemandePage, setCurrentDemandePage] = useState(1);
  const itemsPerPage = 12; // Définir la limite ici

  // Charger les favoris
  const {} = useFavorisDemandes();
  const {} = useFavorisVoyages();

  const { voyages, isLoading: voyagesLoading, pagination: voyagePagination, refetch: refetchVoyages } = useVoyages(currentVoyagePage, itemsPerPage, voyageFilters)
  const { demandes, isLoading: demandesLoading, pagination: demandePagination, refetch: refetchDemandes } = useDemandes(currentDemandePage, itemsPerPage, demandeFilters);

  // Tabs config
  const tabs = useMemo(() => [
    {
      id: 'voyages' as TabType,
      label: 'Voyages',
      icon: Plane,
      count: voyagePagination?.total || 0,
    },
    {
      id: 'demandes' as TabType,
      label: 'Demandes',
      icon: Package,
      count: demandePagination?.total || 0,
    },
  ], [voyagePagination?.total, demandePagination?.total]);

  // Pagination
  const handleVoyagePageChange = useCallback((page: number) => {
    setCurrentVoyagePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDemandePageChange = useCallback((page: number) => {
    setCurrentDemandePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handlers
  const handleVoyageFilterChange = useCallback((newFilters: VoyageFiltersType) => {
    setVoyageFilters(newFilters);
    setCurrentVoyagePage(1); // Revenir à la page 1 lors d'un filtrage
  }, []);

  const handleDemandeFilterChange = useCallback((newFilters: DemandeFiltersType) => {
    setDemandeFilters(newFilters);
    setCurrentDemandePage(1); // Revenir à la page 1 lors d'un filtrage
  }, []);

  // Compter les filtres actifs
  const activeVoyageFiltersCount = Object.keys(voyageFilters).filter(
    key => voyageFilters[key as keyof VoyageFiltersType]
  ).length;

  const activeDemandeFiltersCount = Object.keys(demandeFilters).filter(
    key => demandeFilters[key as keyof DemandeFiltersType]
  ).length;

  const activeFiltersCount = activeTab === 'voyages' 
    ? activeVoyageFiltersCount 
    : activeDemandeFiltersCount;

  // Vérifier si filtres existent
  const hasVoyageFilters = Object.keys(voyageFilters).some(key => voyageFilters[key as keyof VoyageFiltersType]);
  const hasDemandeFilters = Object.keys(demandeFilters).some(key => demandeFilters[key as keyof DemandeFiltersType]);

  // Empêcher le scroll du body quand le drawer est ouvert
  useEffect(() => {
    if (showFiltersDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showFiltersDrawer]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
            Explorer les opportunités
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Découvrez les voyages disponibles ou les demandes de transport à satisfaire
          </p>
        </div>

        {/* Tabs Navigation - Version Mobile Simplifiée */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-4 md:mb-8">
          {/* Mobile: Segmented Control Style */}
          <div className="md:hidden p-1.5">
            <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex-1 relative px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200',
                      isActive
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600'
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      <span className={cn(
                        'text-xs px-1.5 py-0.5 rounded-full',
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-gray-200 text-gray-600'
                      )}>
                        {tab.count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop: Original Design */}
          <div className="hidden md:block p-2">
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
                        isActive
                          ? 'text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary-dark shadow-lg" />
                      )}

                      <div className="relative flex items-center gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-lg items-center justify-center transition-all flex',
                          isActive ? 'bg-white/20' : 'bg-gray-100'
                        )}>
                          <Icon className={cn(
                            'w-5 h-5',
                            isActive ? 'text-white' : 'text-gray-600'
                          )} />
                        </div>

                        <div className="flex flex-col items-start">
                          <span className="text-sm font-semibold">
                            {tab.label}
                          </span>
                          <span
                            className={cn(
                              'text-xs',
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
        </div>

        {/* Filter Button (Mobile) + Desktop Filters */}
        <div className="mb-6 md:mb-8">
          {/* Mobile: Bouton Filtres Sticky */}
          <div className="md:hidden sticky top-0 z-10 bg-gray-50 pb-4 -mx-4 px-4">
            <button
              onClick={() => setShowFiltersDrawer(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-primary/20 rounded-xl font-medium text-primary hover:bg-primary/5 transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filtres</span>
              {activeFiltersCount > 0 && (
                <span className="ml-auto px-2.5 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop: Filtres normaux */}
          <div className="hidden md:block">
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
                    refetchVoyages={refetchVoyages}
                  />
                ) : (
                  <DemandeFilters
                    onFilterChange={handleDemandeFilterChange}
                    initialFilters={demandeFilters}
                    refetchDemandes={refetchDemandes}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-content`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'voyages' ? (
              <>
                {voyagesLoading && voyages.length === 0 ? (
                  <LoadingSpinner text="Chargement des voyages..." />
                ) : voyages.length === 0 && !hasVoyageFilters ? (
                  <EmptyState
                    title="Aucun voyage disponible"
                    description="Il n'y a pas de voyages disponibles pour le moment"
                    icon={<Plane className="w-12 h-12 text-gray-400" />}
                  />
                ) : voyages.length === 0 && hasVoyageFilters ? (
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
                    voyages={voyages}
                    isLoading={voyagesLoading}
                    onPageChange={handleVoyagePageChange}
                    pagination={voyagePagination}
                  />
                )}
              </>
            ) : (
              <>
                {demandesLoading && demandes.length === 0 ? (
                  <LoadingSpinner text="Chargement des demandes..." />
                ) : demandes.length === 0 && !hasDemandeFilters ? (
                  <EmptyState
                    title="Aucune demande active"
                    description="Il n'y a pas de demandes disponibles pour le moment"
                    icon={<Package className="w-12 h-12 text-gray-400" />}
                  />
                ) : demandes.length === 0 && hasDemandeFilters ? (
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
                    demandes={demandes}
                    isLoading={demandesLoading}
                    onPageChange={handleDemandePageChange}
                    pagination={demandePagination}
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile: Filters Drawer (Bottom Sheet) */}
      <AnimatePresence>
        {showFiltersDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersDrawer(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
            >
              {/* Header du drawer */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Filtres
                  </h2>
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowFiltersDrawer(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Contenu scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {activeTab === 'voyages' ? (
                  <VoyageFilters
                    onFilterChange={handleVoyageFilterChange}
                    initialFilters={voyageFilters}
                    refetchVoyages={refetchVoyages}
                  />
                ) : (
                  <DemandeFilters
                    onFilterChange={handleDemandeFilterChange}
                    initialFilters={demandeFilters}
                    refetchDemandes={refetchDemandes}
                  />
                )}
              </div>

              {/* Footer avec actions */}
              <div className="px-6 py-4 border-t border-gray-200 bg-white">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (activeTab === 'voyages') {
                        setVoyageFilters({});
                      } else {
                        setDemandeFilters({});
                      }
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => setShowFiltersDrawer(false)}
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    Voir les résultats
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}