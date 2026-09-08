import { Package, MapPin, Calendar, Weight, DollarSign, ArrowRight, Eye } from 'lucide-react';
import { PropositionStatusBadge } from './PropositionStatusBadge';
import type { Proposition, User } from '@/types';
import { formatDateRelative, formatFullName } from '@/lib/utils/format';
import { CurrencyDisplay } from '../common';
import AvatarWithButton from '../ui/AvatarWithButton';

interface PropositionCardDesktopProps {
  proposition: Proposition;
  otherUser: User;
  isReceived: boolean;
  isPending: boolean;
  onAccept?: (id: number) => void;
  onRefuse?: (id: number) => void;
  onViewVoyageDetails?: (idVoyage: number) => void;
  onViewPropositionDetails?: (idProposition: number) => void;
}

export default function PropositionCardDesktop({
  proposition,
  otherUser,
  isReceived,
  isPending,
  onAccept,
  onRefuse,
  onViewVoyageDetails,
  onViewPropositionDetails,
}: PropositionCardDesktopProps) {
  return (
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
  );
}
