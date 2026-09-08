import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Clock,
  DollarSign,
  Flag,
  Heart,
  Mail,
  MapPin,
  Package,
  Phone,
} from 'lucide-react';

import { Avatar, Button, Card, CardContent, CardHeader } from '@/components/ui';
import { formatDate, formatWeight } from '@/lib/utils/format';
import type { Demande } from '@/types';
import type { User } from '@/types';

import { CurrencyDisplay } from '../common';
import { FavoriteButton } from '../favori';
import DemandeStatusBadge from './DemandeStatusBadge';

interface DemandeDetailsMobileProps {
  demande: Demande;
  user: User | null;
  isOwner: boolean;
  isFavorite: boolean;
  isExpired: boolean;
  isUrgent: boolean;
  daysRemaining: number | null;
  onToggleFavorite: () => Promise<void>;
  onOpenSignalement: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function DemandeDetailsMobile({
  demande,
  user,
  isOwner,
  isFavorite,
  isExpired,
  isUrgent,
  daysRemaining,
  onToggleFavorite,
  onOpenSignalement,
  onEdit,
  onDelete,
}: DemandeDetailsMobileProps) {
  return (
    <div className="lg:hidden space-y-4 md:space-y-6 md:pb-6">
      {/* Header Card */}
      <Card>
        <CardHeader
          title={
            <div className="flex flex-col gap-3">
              {/* Itinéraire */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900">{demande.villeDepart}</span>
                <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="font-bold text-gray-900">{demande.villeArrivee}</span>
              </div>

              {/* Statut + Actions secondaires mobile */}
              <div className="flex items-center gap-2 flex-wrap">
                <DemandeStatusBadge statut={demande.statut} />

                {/* Badge urgence mobile */}
                {isUrgent && daysRemaining !== null && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {daysRemaining}j restant{daysRemaining > 1 ? 's' : ''}
                  </span>
                )}

                {/* Actions secondaires - Mobile uniquement */}
                {user && !isOwner && (
                  <div className="flex md:hidden items-center gap-2 ml-auto">
                    {!isExpired && (
                      <button
                        onClick={onToggleFavorite}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Heart
                          className={`w-4.5 h-4.5 transition-colors ${
                            isFavorite
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    )}
                    <button
                      onClick={onOpenSignalement}
                      className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Flag className="w-4.5 h-4.5 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          }
          action={
            // Actions desktop
            <div className="hidden md:flex items-center gap-3">
              {user && !isOwner && (
                <>
                  {!isExpired && (
                    <FavoriteButton
                      isFavorite={isFavorite}
                      onToggle={onToggleFavorite}
                      size="md"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Flag className="w-4 h-4" />}
                    onClick={onOpenSignalement}
                    className="text-gray-600 hover:text-error"
                  >
                    Signaler
                  </Button>
                </>
              )}
            </div>
          }
        />

        <CardContent>
          {/* Grid responsive optimisé */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* Poids estimé */}
            <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <p className="text-xs md:text-sm text-gray-500 font-medium">Poids estimé</p>
              </div>
              <p className="text-sm md:text-base font-bold text-gray-900">
                {formatWeight(demande.poidsEstime)}
              </p>
            </div>

            {/* Date limite */}
            {demande.dateLimite && (
              <div className={`flex flex-col gap-2 rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-1 ${
                isUrgent ? 'bg-red-50' : 'bg-white'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isUrgent ? 'bg-red-100' : 'bg-primary/10'
                  }`}>
                    <Clock className={`w-4 h-4 md:w-5 md:h-5 ${
                      isUrgent ? 'text-red-600' : 'text-primary'
                    }`} />
                  </div>
                  <p className={`text-xs md:text-sm font-medium ${
                    isUrgent ? 'text-red-700' : 'text-gray-500'
                  }`}>Date limite</p>
                </div>
                <div>
                  <p className={`text-sm md:text-base font-bold ${
                    isUrgent ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {formatDate(demande.dateLimite)}
                  </p>
                  {daysRemaining !== null && (
                    <p className={`text-xs md:text-sm mt-1 font-medium ${
                      daysRemaining < 0
                        ? 'text-gray-500'
                        : isUrgent
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}>
                      {daysRemaining < 0
                        ? 'Expiré'
                        : daysRemaining === 0
                        ? "Aujourd'hui"
                        : daysRemaining === 1
                        ? 'Demain'
                        : `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}`}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Prix par kilo */}
            {demande.prixParKilo && (
              <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">Prix/kg</p>
                </div>
                <CurrencyDisplay
                  amount={demande.prixParKilo}
                  currency={demande.currency}
                  converted={demande.converted}
                  viewerCurrency={demande.viewerCurrency}
                  field="prixParKilo"
                  className="text-sm md:text-base font-bold text-gray-900"
                />
              </div>
            )}

            {/* Commission */}
            {demande.commissionProposeePourUnBagage && (
              <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">Commission</p>
                </div>
                <CurrencyDisplay
                  amount={demande.commissionProposeePourUnBagage}
                  currency={demande.currency}
                  converted={demande.converted}
                  viewerCurrency={demande.viewerCurrency}
                  field="commission"
                  className="text-sm md:text-base font-bold text-gray-900"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader title="Description de la demande" />
        <CardContent>
          <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
            {demande.description}
          </p>
        </CardContent>
      </Card>

      {/* Client Info */}
      <Card>
        <CardHeader title="Informations du client" />
        <CardContent>
          <div className="space-y-4 md:space-y-6">
            {/* Profil du client */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 md:gap-4 flex-1">
                <Avatar
                  src={demande.client.photo || undefined}
                  fallback={`${demande.client.nom} ${demande.client.prenom}`}
                  size="lg"
                  verified={demande.client.emailVerifie}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base md:text-lg text-gray-900">
                    {demande.client.prenom} {demande.client.nom}
                  </p>
                  {demande.client.bio && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {demande.client.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Coordonnées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pt-4 border-t border-gray-200">
              {demande.client.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 truncate">{demande.client.email}</span>
                </div>
              )}
              {demande.client.telephone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">{demande.client.telephone}</span>
                </div>
              )}
              {demande.client.address && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 line-clamp-2">
                    {demande.client.address.ville}
                    {demande.client.address.quartier && `, ${demande.client.address.quartier}`}
                    {demande.client.address.pays && ` - ${demande.client.address.pays}`}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">
                  Membre depuis {formatDate(demande.client.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations système - Collapsible sur mobile */}
      <details className="md:block group">
        <summary className="md:hidden cursor-pointer list-none">
          <Card className="group-open:rounded-b-none">
            <CardContent className="">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Informations système</span>
                <svg
                  className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </summary>

        <Card className="md:block hidden group-open:block group-open:rounded-t-none group-open:border-t-0">
          <CardHeader title="Informations système" className="md:block hidden" />
          <CardContent className="pt-0 md:pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
              <div>
                <span className="text-gray-500">Créée le :</span>
                <span className="ml-2 font-medium text-gray-900">
                  {formatDate(demande.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Dernière mise à jour :</span>
                <span className="ml-2 font-medium text-gray-900">
                  {formatDate(demande.updatedAt)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </details>

      {/* Owner Actions - Desktop */}
      {isOwner && !isExpired && (
        <Card className="hidden md:block">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onEdit}
                disabled={demande.statut === 'annulee'}
              >
                Modifier
              </Button>
              <Button
                variant="danger"
                onClick={onDelete}
                leftIcon={<AlertCircle className="w-4 h-4" />}
                disabled={demande.statut === 'annulee'}
              >
                {demande.statut === 'annulee' ? 'Demande annulée' : 'Annuler la demande'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
