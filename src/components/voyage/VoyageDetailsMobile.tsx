import {
  Calendar,
  Package,
  AlertCircle,
  Flag,
  Star,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Clock,
  Plane,
  Heart,
} from 'lucide-react';
import { Card, CardHeader, CardContent, Avatar, Button } from '@/components/ui';
import VoyageStatusBadge from './VoyageStatusBadge';
import { formatDate, formatWeight } from '@/lib/utils/format';
import type { Voyage } from '@/types';
import type { User } from '@/types';
import { CurrencyDisplay } from '../common';

interface VoyageDetailsMobileProps {
  voyage: Voyage;
  user: User | null;
  isOwner: boolean;
  isFavorite: boolean;
  isExpired: boolean;
  canLeaveReview: boolean;
  onToggleFavorite: () => Promise<void>;
  onOpenSignalement: () => void;
  onOpenAvis: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function VoyageDetailsMobile({
  voyage,
  user,
  isOwner,
  isFavorite,
  isExpired,
  canLeaveReview,
  onToggleFavorite,
  onOpenSignalement,
  onOpenAvis,
  onEdit,
  onDelete,
}: VoyageDetailsMobileProps) {
  return (
    <div className="lg:hidden space-y-4 md:space-y-6 md:pb-6">
      {/* Header Card Mobile */}
      <Card>
        <CardHeader
          title={
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900">{voyage.villeDepart}</span>
                <Plane className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="font-bold text-gray-900">{voyage.villeArrivee}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <VoyageStatusBadge statut={voyage.statut} />
                {user && !isOwner && (
                  <div className="flex items-center gap-2 ml-auto">
                    {!isExpired && (
                      <button
                        onClick={onToggleFavorite}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Heart
                          className={`w-4.5 h-4.5 transition-colors ${
                            isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
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
        />
         <CardContent>
          {/* Grid responsive optimisé */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {/* Date de départ */}
            <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <p className="text-xs md:text-sm text-gray-500 font-medium">Départ</p>
              </div>
              <p className="text-sm md:text-base font-bold text-gray-900">
                {formatDate(voyage.dateDepart)}
              </p>
            </div>

            {/* Date d'arrivée */}
            <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <p className="text-xs md:text-sm text-gray-500 font-medium">Arrivée</p>
              </div>
              <p className="text-sm md:text-base font-bold text-gray-900">
                {formatDate(voyage.dateArrivee)}
              </p>
            </div>

            {/* Poids disponible */}
            <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <p className="text-xs md:text-sm text-gray-500 font-medium">Poids dispo</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm md:text-base font-bold text-gray-900">
                  {formatWeight(voyage.poidsDisponible)}
                </p>
                {parseFloat(voyage.poidsDisponibleRestant) !== parseFloat(voyage.poidsDisponible) && (
                  <p className="text-xs text-gray-500">
                    Restant: <span className="font-semibold text-gray-700">{formatWeight(voyage.poidsDisponibleRestant)}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Prix par kilo */}
            {voyage.prixParKilo && (
              <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">Prix/kg</p>
                </div>
                <CurrencyDisplay
                  amount={voyage.prixParKilo}
                  currency={voyage.currency}
                  converted={voyage.converted}
                  viewerCurrency={voyage.viewerCurrency}
                  field="prixParKilo"
                  className="text-sm md:text-base font-bold text-gray-900"
                />
              </div>
            )}

            {/* Commission */}
            {voyage.commissionProposeePourUnBagage && (
              <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">Commission</p>
                </div>
                <CurrencyDisplay
                  amount={voyage.commissionProposeePourUnBagage}
                  currency={voyage.currency}
                  converted={voyage.converted}
                  viewerCurrency={voyage.viewerCurrency}
                  field="commission"
                  className="text-sm md:text-base font-bold text-gray-900"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {voyage.description && (
        <Card>
          <CardHeader title="Description du voyage" />
          <CardContent>
            <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
              {voyage.description}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader title="Informations du voyageur" />
        <CardContent>
          <div className="space-y-4 md:space-y-6">
            {/* Profil du voyageur */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 md:gap-4 flex-1">
                <Avatar
                  src={voyage.voyageur.photo || undefined}
                  fallback={`${voyage.voyageur.nom} ${voyage.voyageur.prenom}`}
                  size="lg"
                  verified={voyage.voyageur.emailVerifie}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-base md:text-lg text-gray-900">
                      {voyage.voyageur.prenom} {voyage.voyageur.nom}
                    </p>
                    {!isOwner &&
                      voyage.voyageur.noteAvisMoyen !== null &&
                      voyage.voyageur.noteAvisMoyen > 0 && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-full">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium text-amber-700">
                            {voyage.voyageur.noteAvisMoyen.toFixed(1)}
                          </span>
                        </div>
                      )}
                  </div>
                  {voyage.voyageur.bio && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {voyage.voyageur.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Boutons desktop */}
              {canLeaveReview && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Star className="w-4 h-4" />}
                  onClick={onOpenAvis}
                  className="hidden md:flex"
                >
                  Laisser un avis
                </Button>
              )}
            </div>

            {/* Coordonnées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pt-4 border-t border-gray-200">
              {voyage.voyageur.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 truncate">{voyage.voyageur.email}</span>
                </div>
              )}
              {voyage.voyageur.telephone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">{voyage.voyageur.telephone}</span>
                </div>
              )}
              {voyage.voyageur.address && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 line-clamp-2">
                    {voyage.voyageur.address.ville}
                    {voyage.voyageur.address.quartier && `, ${voyage.voyageur.address.quartier}`}
                    {voyage.voyageur.address.pays && ` - ${voyage.voyageur.address.pays}`}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">
                  Membre depuis {formatDate(voyage.voyageur.createdAt)}
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
            <CardContent className="p-4">
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
                <span className="text-gray-500">Créé le :</span>
                <span className="ml-2 font-medium text-gray-900">
                  {formatDate(voyage.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Dernière mise à jour :</span>
                <span className="ml-2 font-medium text-gray-900">
                  {formatDate(voyage.updatedAt)}
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
                disabled={voyage.statut === 'annule'}
              >
                Modifier
              </Button>
              <Button
                variant="danger"
                onClick={onDelete}
                leftIcon={<AlertCircle className="w-4 h-4" />}
                disabled={voyage.statut === 'annule'}
              >
                {voyage.statut === 'annule' ? 'Voyage annulé' : 'Annuler le voyage'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
