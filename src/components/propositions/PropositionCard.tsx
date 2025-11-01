'use client';

import { Package, MapPin, Calendar, Weight, DollarSign, ArrowRight, Eye, Plane } from 'lucide-react';
import { PropositionStatusBadge } from './PropositionStatusBadge';
import type { Proposition } from '@/types';
import { formatDateRelative, formatFullName } from '@/lib/utils/format';
import { CurrencyDisplay } from '../common';
import AvatarWithButton from '../ui/AvatarWithButton';

interface PropositionCardProps {
  proposition: Proposition;
  viewMode: 'sent' | 'received';
  onAccept?: (id: number) => void;
  onRefuse?: (id: number) => void;
  onViewDetails?: (id: number) => void;
  onViewVoyageDetails?: (idVoyage: number) => void;
  onViewPropositionDetails?: (idProposition: number) => void;
}

export default function PropositionCard({
  proposition,
  viewMode,
  onAccept,
  onRefuse,
  onViewVoyageDetails,
  onViewPropositionDetails
}: PropositionCardProps) {
  const isReceived = viewMode === 'received';
  const isPending = proposition.statut === 'en_attente';
  const otherUser = isReceived ? proposition.client : proposition.voyageur;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all duration-200">
      {/* VERSION MOBILE (< 768px) */}
      <div className="md:hidden">
        {/* Header Compact */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <AvatarWithButton
                  src={otherUser.photo}
                  alt={`${otherUser.prenom} ${otherUser.nom}`}
                  fallback={`${otherUser.prenom} ${otherUser.nom}`}
                  size="md"
                  buttonType="info"
                />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 truncate">
                  {formatFullName(otherUser.nom, otherUser.prenom)}
                </h3>
                <p className="text-xs text-gray-500">
                  {isReceived ? 'Reçue' : 'Envoyée'}
                </p>
              </div>
            </div>
            <PropositionStatusBadge statut={proposition.statut} />
          </div>

          {/* Itinéraire */}
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {proposition.voyage.villeDepart}
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Plane className="w-3.5 h-3.5 text-primary rotate-45" />
            </div>
            <div className="flex-1 min-w-0 text-right">
              <p className="text-sm font-bold text-gray-900 truncate">
                {proposition.voyage.villeArrivee}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-3 space-y-2.5">
          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>
              {new Date(proposition.voyage.dateDepart).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>

          {/* Prix & Poids */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-1.5 mb-1">
                <Weight className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-gray-600">Poids</span>
              </div>
              <p className="text-sm font-semibold text-primary">
                {proposition.demande.poidsEstime} kg
              </p>
            </div>

            <div className="p-2.5 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-gray-600">Prix/kg</span>
              </div>
              <CurrencyDisplay
                amount={proposition.prixParKilo}
                currency={proposition.currency}
                converted={proposition.converted}
                viewerCurrency={proposition.viewerCurrency}
                field="prixParKilo"
                className="text-sm font-semibold text-primary"
              />
            </div>
          </div>

          {/* Commission */}
          <div className="p-2.5 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Commission</span>
              <CurrencyDisplay
                amount={proposition.commissionProposeePourUnBagage}
                currency={proposition.currency}
                converted={proposition.converted}
                viewerCurrency={proposition.viewerCurrency}
                field="commission"
                className="text-sm font-semibold text-primary"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-gray-500">
              {formatDateRelative(proposition.createdAt)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <div className='flex item-center justify-between'>
              <button onClick={() => onViewPropositionDetails?.(proposition.id)}
              className="w-full px-3 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <span>Détails</span>
                <Eye className="w-4 h-4" />
              </button>
            </div>
            
            {isPending && isReceived ? (
              <>
                <button
                  onClick={() => onRefuse?.(proposition.id)}
                  className="w-full px-3 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                >
                  Refuser
                </button>
                <button
                  onClick={() => onAccept?.(proposition.id)}
                  className="w-full px-3 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Accepter
                </button>
              </>
            ) : (
              <button
                onClick={() => onViewVoyageDetails?.(proposition.voyage.id)}
                className="w-full px-3 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <span>Voir le voyage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* VERSION DESKTOP (≥ 768px) */}
      <div className="hidden md:block">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 rounded-t-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <AvatarWithButton
                  src={otherUser.photo}
                  alt={`${otherUser.prenom} ${otherUser.nom}`}
                  fallback={`${otherUser.prenom} ${otherUser.nom}`}
                  size="lg"
                  buttonType="info"
                />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-gray-900 truncate">
                  {formatFullName(otherUser.nom, otherUser.prenom)}
                </h3>
                <p className="text-sm text-gray-500">
                  {isReceived ? 'Proposition reçue' : 'Proposition envoyée'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {formatDateRelative(proposition.createdAt)}
              </span>
              <PropositionStatusBadge statut={proposition.statut} />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Voyage Info */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-gray-500 uppercase">Départ</span>
                </div>
                <p className="text-base font-bold text-gray-900 truncate">
                  {proposition.voyage.villeDepart}
                </p>
              </div>

              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-primary" />
              </div>

              <div className="flex-1 text-right">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-500 uppercase">Arrivée</span>
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <p className="text-base font-bold text-gray-900 truncate">
                  {proposition.voyage.villeArrivee}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 pt-3 border-t border-gray-200">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>
                Départ le {new Date(proposition.voyage.dateDepart).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Prix & Poids */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Weight className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-600">Poids estimé</span>
              </div>
              <p className="text-lg font-semibold text-primary">
                {proposition.demande.poidsEstime} kg
              </p>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-600">Prix par kilo</span>
              </div>
              <CurrencyDisplay
                amount={proposition.prixParKilo}
                currency={proposition.currency}
                converted={proposition.converted}
                viewerCurrency={proposition.viewerCurrency}
                field="prixParKilo"
                className="text-lg font-semibold text-primary"
              />
            </div>
          </div>

          {/* Commission */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-600">Commission bagage</span>
              </div>
              <CurrencyDisplay
                amount={proposition.commissionProposeePourUnBagage}
                currency={proposition.currency}
                converted={proposition.converted}
                viewerCurrency={proposition.viewerCurrency}
                field="commission"
                className="text-lg font-semibold text-primary"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
          <div className='flex items-center justify-between gap-3'>
            <button
              onClick={() => onViewPropositionDetails?.(proposition.id)}
              className="px-6 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
            >
              <span>Détails</span>
              <Eye className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center justify-end gap-3">
            {isPending && isReceived ? (
              <>
                <button
                  onClick={() => onRefuse?.(proposition.id)}
                  className="px-6 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:border-gray-400 transition-colors"
                >
                  Refuser
                </button>
                <button
                  onClick={() => onAccept?.(proposition.id)}
                  className="px-6 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Accepter
                </button>
              </>
            ) : (
              <button
                onClick={() => onViewVoyageDetails?.(proposition.voyage.id)}
                className="px-6 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
              >
                <span>Voir le voyage</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}