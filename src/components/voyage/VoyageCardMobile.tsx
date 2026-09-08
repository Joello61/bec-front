import { Calendar, Package, Plane, Verified, Eye } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';
import { Card, CardContent } from '@/components/ui';
import { formatDateShort, formatWeight } from '@/lib/utils/format';
import { FavoriteButton } from '../favori';
import { PriceDisplay } from '../common';
import AvatarWithButton from '../ui/AvatarWithButton';
import type { Voyage } from '@/types';

interface VoyageCardMobileProps {
  voyage: Voyage;
  link: Route;
  showFavoriteButton: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => Promise<void>;
  onShowProfile: () => void;
}

export default function VoyageCardMobile({
  voyage,
  link,
  showFavoriteButton,
  isFavorite,
  onToggleFavorite,
  onShowProfile,
}: VoyageCardMobileProps) {
  return (
    <div className="md:hidden">
      {/* Bouton Favoris - Overlay discret */}
      {showFavoriteButton && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center hover:scale-110 transition-transform">
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={onToggleFavorite}
              size="sm"
            />
          </div>
        </div>
      )}

      <Card className="h-full overflow-hidden border border-gray-200">
        <CardContent className="p-0">
          {/* Header Compact - Info prioritaire */}
          <div className="relative bg-gradient-to-r from-primary/5 to-primary/10 px-4 py-3 rounded-t-2xl">
            {/* Date de départ - Info clé */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-600 leading-tight">Départ le</p>
                <p className="text-base font-bold text-gray-900 leading-tight">
                  {formatDateShort(voyage.dateDepart)}
                </p>
              </div>
            </div>

            {/* Itinéraire - Horizontal compact */}
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-gray-900 truncate">
                  {voyage.villeDepart}
                </p>
              </div>

              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center">
                  <Plane className="w-4.5 h-4.5 text-primary rotate-45" />
                </div>
              </div>

              <div className="flex-1 min-w-0 text-right">
                <p className="text-base font-bold text-gray-900 truncate">
                  {voyage.villeArrivee}
                </p>
              </div>
            </div>
          </div>

          {/* Body - Infos essentielles UNIQUEMENT */}
          <div className="px-4 py-3.5 space-y-2.5">
            {/* Poids et Prix sur une ligne */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Package className="w-4.5 h-4.5 text-gray-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  <span className="font-bold text-gray-900">{formatWeight(voyage.poidsDisponible)}</span>
                  <span className="text-gray-500 ml-1">dispo</span>
                </span>
              </div>

              <div className="text-right">
                <PriceDisplay
                  prixParKilo={voyage.prixParKilo}
                  commission={null}
                  currency={voyage.currency}
                  converted={voyage.converted}
                  viewerCurrency={voyage.viewerCurrency}
                  compact={true}
                />
              </div>
            </div>

            {/* Voyageur + CTA */}
            <div className="flex items-center gap-2.5 pt-2.5 border-t border-gray-100">
              {/* Avatar minimal */}
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <AvatarWithButton
                  src={voyage.voyageur.photo}
                  alt={`${voyage.voyageur.prenom} ${voyage.voyageur.nom}`}
                  fallback={`${voyage.voyageur.prenom} ${voyage.voyageur.nom}`}
                  size="sm"
                  buttonType="info"
                  onButtonClick={onShowProfile}
                />
              </div>

              {/* Nom voyageur */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-sm text-gray-700 truncate">
                  {voyage.voyageur.prenom} {voyage.voyageur.nom[0]}.
                </span>
                {voyage.voyageur.emailVerifie && (
                  <Verified className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                )}
              </div>

              {/* CTA */}
              <Link href={link}>
                <button className="ml-auto text-primary text-sm font-medium flex items-center gap-1 hover:gap-1.5 transition-all">
                  <span className="xs:inline">Voir</span>
                  <Eye className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
