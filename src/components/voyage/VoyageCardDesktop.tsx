import { Calendar, Package, ArrowRight, Verified, Plane, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';
import { Card, CardContent } from '@/components/ui';
import VoyageStatusBadge from './VoyageStatusBadge';
import { formatDateShort, formatWeight } from '@/lib/utils/format';
import { FavoriteButton } from '../favori';
import { PriceDisplay } from '../common';
import AvatarWithButton from '../ui/AvatarWithButton';
import type { Voyage } from '@/types';

interface VoyageCardDesktopProps {
  voyage: Voyage;
  link: Route;
  showFavoriteButton: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => Promise<void>;
  onShowProfile: () => void;
}

export default function VoyageCardDesktop({
  voyage,
  link,
  showFavoriteButton,
  isFavorite,
  onToggleFavorite,
  onShowProfile,
}: VoyageCardDesktopProps) {
  return (
    <div className="h-full hidden md:block">
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
          {/* Header avec Info Voyageur et Date */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 rounded-2xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <AvatarWithButton
                  src={voyage.voyageur.photo}
                  alt={`${voyage.voyageur.prenom} ${voyage.voyageur.nom}`}
                  fallback={`${voyage.voyageur.prenom} ${voyage.voyageur.nom}`}
                  size="lg"
                  buttonType="info"
                  onButtonClick={onShowProfile}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                      {voyage.voyageur.prenom} {voyage.voyageur.nom}
                    </p>
                    {voyage.voyageur.emailVerifie && (
                      <Verified className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate hidden sm:block">
                    {voyage.voyageur.telephone || 'Voyageur vérifié'}
                  </p>
                </div>
              </div>
              {/* Date de départ bien en évidence */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-primary/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex-shrink-0">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-bold text-primary whitespace-nowrap">
                  {formatDateShort(voyage.dateDepart)}
                </span>
              </div>
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
                  {voyage.villeDepart}
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
                  {voyage.villeArrivee}
                </p>
              </div>
            </div>

            {/* Informations Clés - Format Ligne avec justify-between */}
            <div className="space-y-3">
              {/* Poids Disponible */}
              <div className="bg-primary/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border border-primary-20">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      Poids disponible
                    </span>
                  </div>
                  <span className="text-base sm:text-lg lg:text-xl font-bold text-primary">
                    {formatWeight(voyage.poidsDisponibleRestant)}
                  </span>
                </div>
              </div>
              <PriceDisplay
                prixParKilo={voyage.prixParKilo}
                commission={voyage.commissionProposeePourUnBagage}
                currency={voyage.currency}
                converted={voyage.converted}
                viewerCurrency={voyage.viewerCurrency}
                showIcons={true}
              />
            </div>
          </div>

          {/* Footer - Statut et Call to Action */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-100 rounded-2xl">
            <Link href={link}>
              <div className="flex items-center justify-between">
                <VoyageStatusBadge statut={voyage.statut} size="sm" />
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
