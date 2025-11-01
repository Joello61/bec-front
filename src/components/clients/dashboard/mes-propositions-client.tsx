'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Inbox } from 'lucide-react';
import { PropositionList } from '@/components/propositions';
import { EmptyState, ErrorState, LoadingSpinner, useToast } from '@/components/common';
import { useMyPropositionsSent, useMyPropositionsReceived, usePropositionActions } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';
import { Modal } from '@/components/ui';

type TabType = 'sent' | 'received';

export default function PropositionsPageClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('received');

  // Hooks pour les propositions
  const {
    propositions: sentPropositions,
    isLoading: isLoadingSent,
    error: errorSent,
    refetch: refetchSent,
  } = useMyPropositionsSent();

  const {
    propositions: receivedPropositions,
    isLoading: isLoadingReceived,
    error: errorReceived,
    refetch: refetchReceived,
  } = useMyPropositionsReceived();

  const { respondToProposition } = usePropositionActions();

  const toast = useToast();

  // Gestion refus
  const [refusalReason, setRefusalReason] = useState('');
  const [isRefuseDialogOpen, setIsRefuseDialogOpen] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [selectedPropositionId, setSelectedPropositionId] = useState<number | null>(null);

  // Données actives selon l'onglet
  const activePropositions = activeTab === 'sent' ? sentPropositions : receivedPropositions;
  const isLoading = activeTab === 'sent' ? isLoadingSent : isLoadingReceived;
  const error = activeTab === 'sent' ? errorSent : errorReceived;
  const refetch = activeTab === 'sent' ? refetchSent : refetchReceived;

  // Compteurs pour les badges
  const sentCount = sentPropositions.length;
  const receivedCount = receivedPropositions.length;
  const pendingReceivedCount = receivedPropositions.filter(p => p.statut === 'en_attente').length;

  const tabs: { id: TabType; label: string; icon: typeof Send; count: number; pendingCount?: number }[] = [
    { 
      id: 'received', 
      label: 'Reçues', 
      icon: Inbox, 
      count: receivedCount,
      pendingCount: pendingReceivedCount 
    },
    { 
      id: 'sent', 
      label: 'Envoyées', 
      icon: Send, 
      count: sentCount 
    },
  ];

  const handleViewPropositionDetails = (propositionId: number) => {
    router.push(ROUTES.MES_PROPOSITION_DETAILS(propositionId));
  };

  const handleViewVoyageDetails = (idVoyage: number) => {
    router.push(ROUTES.MES_VOYAGE_DETAILS(idVoyage));
  };

  const handleAccept = async (idProposition: number) => {
    if (!idProposition) return;
    
    setIsResponding(true);
    try {
      await respondToProposition(idProposition, { action: 'accepter' });
      toast.success('Proposition acceptée avec succès !');
      refetch();
    } catch (err) {
      toast.error('Erreur lors de l\'acceptation');
      console.error(err);
    } finally {
      setIsResponding(false);
    }
  };

  const handleRefuse = async () => {
    if (!selectedPropositionId) return;

    setIsResponding(true);
    try {
      await respondToProposition(selectedPropositionId, {
        action: 'refuser',
        messageRefus: refusalReason || undefined
      });
      
      toast.success('Proposition refusée');
      setIsRefuseDialogOpen(false);
      setRefusalReason('');
      refetch();
    } catch (err) {
      toast.error('Erreur lors du refus');
      console.error(err);
    } finally {
      setIsResponding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Mes Propositions
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Gérez vos propositions envoyées et reçues
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
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

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading && activePropositions.length === 0 ? (
              <LoadingSpinner text="Chargement des propositions..." />
            ) : error ? (
              <ErrorState message={error} onRetry={refetch} />
            ) : activePropositions.length === 0 ? (
              <EmptyState
                icon={activeTab === 'sent' ? <Send className="w-12 h-12 md:w-16 md:h-16 text-gray-400" /> : <Inbox className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />}
                title={activeTab === 'sent' ? 'Aucune proposition envoyée' : 'Aucune proposition reçue'}
                description={
                  activeTab === 'sent'
                    ? "Vous n'avez pas encore envoyé de proposition"
                    : "Vous n'avez pas encore reçu de proposition"
                }
              />
            ) : (
              <PropositionList
                propositions={activePropositions}
                viewMode={activeTab}
                isLoading={isLoading}
                onAccept={handleAccept}
                onRefuse={(id) => {
                  setSelectedPropositionId(id);
                  setIsRefuseDialogOpen(true);
                }}
                onViewVoyageDetails={handleViewVoyageDetails}
                onViewPropositionDetails={handleViewPropositionDetails}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Refuse Dialog */}
        <Modal
          isOpen={isRefuseDialogOpen}
          onClose={() => setIsRefuseDialogOpen(false)}
          title="Refuser la proposition"
          size="md"
        >
          <div className="p-4 md:p-6 space-y-4">
            <p className="text-sm md:text-base text-gray-700">
              Souhaitez-vous expliquer la raison du refus ? (optionnel)
            </p>
            
            <textarea
              className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={4}
              placeholder="Raison du refus..."
              value={refusalReason}
              onChange={(e) => setRefusalReason(e.target.value)}
              disabled={isResponding}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsRefuseDialogOpen(false)}
                disabled={isResponding}
                className="flex-1 px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleRefuse}
                disabled={isResponding}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-error text-white rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
              >
                {isResponding ? 'Refus en cours...' : 'Refuser la proposition'}
              </button>
            </div>
          </div>
        </Modal>
    </div>
  );
}