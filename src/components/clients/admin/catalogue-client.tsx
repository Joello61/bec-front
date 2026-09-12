'use client';

import { Package, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import BoostOfferFormModal from '@/components/admin/catalogue/BoostOfferFormModal';
import ConfirmDeleteModal from '@/components/admin/catalogue/ConfirmDeleteModal';
import SubscriptionPlanFormModal from '@/components/admin/catalogue/SubscriptionPlanFormModal';
import { LoadingSpinner } from '@/components/common';
import { useAdmin, useCurrencyFormat } from '@/lib/hooks';
import { cn } from '@/lib/utils/cn';
import type { AdminBoostOffer, AdminSubscriptionPlan } from '@/types';

type CatalogueTab = 'plans' | 'offers';

export default function AdminCataloguePageClient() {
  const [activeTab, setActiveTab] = useState<CatalogueTab>('plans');
  const [editingPlan, setEditingPlan] = useState<AdminSubscriptionPlan | null>(null);
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [deletingPlan, setDeletingPlan] = useState<AdminSubscriptionPlan | null>(null);
  const [editingOffer, setEditingOffer] = useState<AdminBoostOffer | null>(null);
  const [creatingOffer, setCreatingOffer] = useState(false);
  const [deletingOffer, setDeletingOffer] = useState<AdminBoostOffer | null>(null);

  const {
    subscriptionPlans,
    boostOffers,
    isLoading,
    error,
    fetchSubscriptionPlans,
    fetchBoostOffers,
    deleteSubscriptionPlan,
    deleteBoostOffer,
  } = useAdmin();
  const { formatAmount } = useCurrencyFormat();

  useEffect(() => {
    if (activeTab === 'plans' && subscriptionPlans.length === 0) fetchSubscriptionPlans();
    if (activeTab === 'offers' && boostOffers.length === 0) fetchBoostOffers();
  }, [activeTab, subscriptionPlans.length, boostOffers.length, fetchSubscriptionPlans, fetchBoostOffers]);

  const tabs = [
    { id: 'plans' as CatalogueTab, label: 'Abonnements', icon: Package },
    { id: 'offers' as CatalogueTab, label: 'Boosts', icon: Sparkles },
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catalogue</h1>
          <p className="text-gray-500 mt-1">Gestion des plans d&apos;abonnement et des offres de boost</p>
        </div>
        <button
          onClick={() => (activeTab === 'plans' ? setCreatingPlan(true) : setCreatingOffer(true))}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'plans' ? 'Nouveau plan' : 'Nouvelle offre'}
        </button>
      </div>

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
                  isActive ? 'bg-primary text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        {isLoading ? (
          <LoadingSpinner text="Chargement du catalogue..." />
        ) : activeTab === 'plans' ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="pb-3 pr-4">Code</th>
                <th className="pb-3 pr-4">Nom</th>
                <th className="pb-3 pr-4">Prix EUR</th>
                <th className="pb-3 pr-4">Prix XAF</th>
                <th className="pb-3 pr-4">En avant</th>
                <th className="pb-3 pr-4">Actif</th>
                <th className="pb-3 pr-4">Ordre</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {subscriptionPlans.map((plan) => (
                <tr key={plan.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-mono text-xs">{plan.code}</td>
                  <td className="py-3 pr-4 font-medium text-gray-900">{plan.name}</td>
                  <td className="py-3 pr-4">{plan.priceAmountEur ? formatAmount(plan.priceAmountEur, 'EUR') : '-'}</td>
                  <td className="py-3 pr-4">{plan.priceAmountXaf ? formatAmount(plan.priceAmountXaf, 'XAF') : '-'}</td>
                  <td className="py-3 pr-4">{plan.isFeatured ? 'Oui' : 'Non'}</td>
                  <td className="py-3 pr-4">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', plan.isActive ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500')}>
                      {plan.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{plan.sortOrder}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingPlan(plan)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Modifier">
                        <Pencil className="w-4 h-4 text-gray-500" />
                      </button>
                      {plan.code !== 'free' && (
                        <button onClick={() => setDeletingPlan(plan)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Supprimer">
                          <Trash2 className="w-4 h-4 text-error" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="pb-3 pr-4">Nom</th>
                <th className="pb-3 pr-4">Durée</th>
                <th className="pb-3 pr-4">Prix EUR</th>
                <th className="pb-3 pr-4">Prix XAF</th>
                <th className="pb-3 pr-4">En avant</th>
                <th className="pb-3 pr-4">Active</th>
                <th className="pb-3 pr-4">Ordre</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {boostOffers.map((offer) => (
                <tr key={offer.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium text-gray-900">{offer.name}</td>
                  <td className="py-3 pr-4">{offer.durationDays} jours</td>
                  <td className="py-3 pr-4">{formatAmount(offer.priceAmountEur, 'EUR')}</td>
                  <td className="py-3 pr-4">{offer.priceAmountXaf ? formatAmount(offer.priceAmountXaf, 'XAF') : '-'}</td>
                  <td className="py-3 pr-4">{offer.isFeatured ? 'Oui' : 'Non'}</td>
                  <td className="py-3 pr-4">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', offer.isActive ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500')}>
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{offer.sortOrder}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingOffer(offer)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Modifier">
                        <Pencil className="w-4 h-4 text-gray-500" />
                      </button>
                      <button onClick={() => setDeletingOffer(offer)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Supprimer">
                        <Trash2 className="w-4 h-4 text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {(creatingPlan || editingPlan) && (
        <SubscriptionPlanFormModal
          plan={editingPlan}
          onClose={() => {
            setCreatingPlan(false);
            setEditingPlan(null);
          }}
          onSuccess={() => {
            setCreatingPlan(false);
            setEditingPlan(null);
          }}
        />
      )}

      {deletingPlan && (
        <ConfirmDeleteModal
          title="Supprimer ce plan ?"
          description={`Le plan "${deletingPlan.name}" ne sera plus proposé à la souscription. Les abonnements déjà actifs sur ce plan ne sont pas affectés.`}
          onClose={() => setDeletingPlan(null)}
          onConfirm={() => deleteSubscriptionPlan(deletingPlan.id)}
          onSuccess={() => setDeletingPlan(null)}
        />
      )}

      {(creatingOffer || editingOffer) && (
        <BoostOfferFormModal
          offer={editingOffer}
          onClose={() => {
            setCreatingOffer(false);
            setEditingOffer(null);
          }}
          onSuccess={() => {
            setCreatingOffer(false);
            setEditingOffer(null);
          }}
        />
      )}

      {deletingOffer && (
        <ConfirmDeleteModal
          title="Supprimer cette offre ?"
          description={`L'offre "${deletingOffer.name}" ne sera plus proposée à l'achat. Les boosts déjà actifs ne sont pas affectés.`}
          onClose={() => setDeletingOffer(null)}
          onConfirm={() => deleteBoostOffer(deletingOffer.id)}
          onSuccess={() => setDeletingOffer(null)}
        />
      )}
    </div>
  );
}
