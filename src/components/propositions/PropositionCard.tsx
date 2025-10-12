'use client';

import { Clock, Package, User, MessageSquare } from 'lucide-react';
import { PropositionStatusBadge } from './PropositionStatusBadge';
import type { Proposition } from '@/types';
import {
  formatDateRelative,
  formatPrice,
  formatFullName,
} from '@/lib/utils/format';

interface PropositionCardProps {
  proposition: Proposition;
  viewMode: 'sent' | 'received';
  onAccept?: (id: number) => void;
  onRefuse?: (id: number) => void;
  onViewDetails?: (id: number) => void;
}

export default function PropositionCard({
  proposition,
  viewMode,
  onAccept,
  onRefuse,
  onViewDetails,
}: PropositionCardProps) {
  const isReceived = viewMode === 'received';
  const isPending = proposition.statut === 'en_attente';
  const otherUser = isReceived ? proposition.client : proposition.voyageur;

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {formatFullName(otherUser.nom, otherUser.prenom)}
            </h3>
            <p className="text-sm text-gray-600">
              {isReceived ? 'Proposition reçue' : 'Proposition envoyée'}
            </p>
          </div>
        </div>
        <PropositionStatusBadge statut={proposition.statut} />
      </div>

      {/* Informations voyage */}
      <div className="p-3 bg-gray-50 rounded-lg mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
          <Package className="w-4 h-4" />
          <span className="font-medium">
            {proposition.voyage.villeDepart} vers{' '}
            {proposition.voyage.villeArrivee}
          </span>
        </div>
        <p className="text-xs text-gray-600">
          Départ:{' '}
          {new Date(proposition.voyage.dateDepart).toLocaleDateString('fr-FR')}
        </p>
      </div>

      {/* Prix proposé */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between p-2 bg-primary/5 rounded">
          <span className="text-sm text-gray-700">Prix/kg proposé:</span>
          <span className="font-semibold text-primary">
            {formatPrice(parseFloat(proposition.prixParKilo))}
          </span>
        </div>
        <div className="flex items-center justify-between p-2 bg-secondary/5 rounded">
          <span className="text-sm text-gray-700">Commission bagage:</span>
          <span className="font-semibold text-secondary-dark">
            {formatPrice(
              parseFloat(proposition.commissionProposeePourUnBagage)
            )}
          </span>
        </div>
      </div>

      {/* Message */}
      {proposition.message && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
            <p className="text-sm text-gray-700 flex-1">
              {proposition.message}
            </p>
          </div>
        </div>
      )}

      {/* Message de refus */}
      {proposition.statut === 'refusee' && proposition.messageRefus && (
        <div className="mb-4 p-3 bg-error/5 border border-error/20 rounded-lg">
          <p className="text-sm text-error-dark">
            <strong>Raison du refus:</strong> {proposition.messageRefus}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {formatDateRelative(proposition.createdAt)}
        </div>

        {/* Actions */}
        {isPending && isReceived && (
          <div className="flex gap-2">
            <button
              onClick={() => onRefuse?.(proposition.id)}
              className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Refuser
            </button>
            <button
              onClick={() => onAccept?.(proposition.id)}
              className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              Accepter
            </button>
          </div>
        )}

        {!isPending && (
          <button
            onClick={() => onViewDetails?.(proposition.voyage.id)}
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            Voir le voyage
          </button>
        )}
      </div>
    </div>
  );
}
