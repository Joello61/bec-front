'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Package, Plane, SlidersHorizontal } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { EmptyState, LoadingSpinner } from '@/components/common';
import { DemandeFilters, DemandeList } from '@/components/demande';
import ExploreFiltersDrawer from '@/components/explore/ExploreFiltersDrawer';
import ExploreTabs from '@/components/explore/ExploreTabs';
import { VoyageFilters, VoyageList } from '@/components/voyage';
import { useDemandes, useFavorisDemandes, useFavorisVoyages, useVoyages } from '@/lib/hooks';
import type { DemandeFilters as DemandeFiltersType, VoyageFilters as VoyageFiltersType } from '@/types';

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

  const handleResetFilters = () => {
    if (activeTab === 'voyages') {
      setVoyageFilters({});
    } else {
      setDemandeFilters({});
    }
  };

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

        <ExploreTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

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

      <ExploreFiltersDrawer
        isOpen={showFiltersDrawer}
        onClose={() => setShowFiltersDrawer(false)}
        activeFiltersCount={activeFiltersCount}
        onReset={handleResetFilters}
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
      </ExploreFiltersDrawer>
    </div>
  );
}
