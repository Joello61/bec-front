import { Package, Clock, ArrowRight, Verified, Plane, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';
import { Card, CardContent } from '@/components/ui';
import DemandeStatusBadge from './DemandeStatusBadge';
import { formatWeight } from '@/lib/utils/format';
import { FavoriteButton } from '../favori';
import { PriceDisplay } from '../common';
import AvatarWithButton from '../ui/AvatarWithButton';
import type { Demande } from '@/types';

interface DemandeCardDesktopProps {
  demande: Demande;
  link: Route;
  showFavoriteButton: boolean;
  isFavorite: boolean;
  isUrgent: boolean;
  daysRemaining: number | null;
  onToggleFavorite: () => Promise<void>;
  onShowProfile: () => void;
}

export default function DemandeCardDesktop({
  demande,
  link,
  showFavoriteButton,
  isFavorite,
  isUrgent,
  daysRemaining,
  onToggleFavorite,
  onShowProfile,
}: DemandeCardDesktopProps) {
  return (
    <div className="hidden md:block">
      {/* Bouton Favoris Desktop */}
      {showFavoriteButton && (
        <div className="absolute top-4 right-4 z-10 opacity-100 transition-opacity duration-200">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            size="sm"
          />
        </div>
      )}

      <Card className="h-full overflow-hidden border border-gray-200">
        <CardContent className="p-0">
          {/* Header avec Info Client et Date Limite */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 rounded-2xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <AvatarWithButton
                  src={demande.client.photo}
                  alt={`${demande.client.prenom} ${demande.client.nom}`}
                  fallback={`${demande.client.prenom} ${demande.client.nom}`}
                  size="lg"
                  buttonType="info"
                  onButtonClick={onShowProfile}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                      {demande.client.prenom} {demande.client.nom}
                    </p>
                    {demande.client.emailVerifie && (
                      <Verified className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate hidden sm:block">
                    {demande.client.telephone || 'Client vérifié'}
                  </p>
                </div>
              </div>
              {/* Date limite bien en évidence */}
              {demande.dateLimite && (
                <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex-shrink-0 ${
                  isUrgent ? 'bg-red-100' : 'bg-accent/10'
                }`}>
                  <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                    isUrgent ? 'text-red-600' : 'text-accent'
                  }`} />
                  <span className={`text-xs sm:text-sm font-bold whitespace-nowrap ${
                    isUrgent ? 'text-red-600' : 'text-accent'
                  }`}>
                    {daysRemaining !== null && daysRemaining >= 0
                      ? `${daysRemaining}j restants`
                      : 'Expiré'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Corps Principal - Itinéraire */}
          <div className="px-4 sm:px-6 py-4 sm:py-5">
            {/* Itinéraire - Version Compacte sur une ligne */}
            <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <MapPin className='w-2 h-2 sm:w-3 sm:h-3 text-primary flex-shrink-0'/>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Départ
                  </span>
                </div>
                <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 truncate">
                  {demande.villeDepart}
                </p>
              </div>

              <div className="flex flex-shrink-0">
                <div className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plane className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary rotate-45" />
                </div>
              </div>

              <div className="flex-1 min-w-0 text-right">
                <div className="flex justify-end items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Arrivée
                  </span>
                  <MapPin className='w-2 h-2 sm:w-3 sm:h-3 text-primary flex-shrink-0'/>
                </div>
                <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 truncate">
                  {demande.villeArrivee}
                </p>
              </div>
            </div>

            {/* Informations Clés - Format Ligne avec justify-between */}
            <div className="space-y-3">
              {/* Poids Estimé */}
              <div className="bg-primary/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border border-primary/20">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      Poids estimé
                    </span>
                  </div>
                  <span className="text-base sm:text-lg lg:text-xl font-bold text-primary">
                    {formatWeight(demande.poidsEstime)}
                  </span>
                </div>
              </div>
              {/* Prix avec conversion */}
              <PriceDisplay
                prixParKilo={demande.prixParKilo}
                commission={demande.commissionProposeePourUnBagage}
                currency={demande.currency}
                converted={demande.converted}
                viewerCurrency={demande.viewerCurrency}
                showIcons={true}
              />
            </div>
          </div>

          {/* Footer - Statut et Call to Action */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-100 rounded-2xl">
            <Link href={link}>
              <div className="flex items-center justify-between">
                <DemandeStatusBadge statut={demande.statut} size="sm" />
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <span>Voir les détails</span>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
