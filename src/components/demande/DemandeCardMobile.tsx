import { Package, Clock, Verified, Plane, Eye } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';
import { Card, CardContent } from '@/components/ui';
import { formatWeight } from '@/lib/utils/format';
import { FavoriteButton } from '../favori';
import { PriceDisplay } from '../common';
import AvatarWithButton from '../ui/AvatarWithButton';
import type { Demande } from '@/types';

interface DemandeCardMobileProps {
  demande: Demande;
  link: Route;
  showFavoriteButton: boolean;
  isFavorite: boolean;
  isUrgent: boolean;
  isExpired: boolean;
  daysRemaining: number | null;
  onToggleFavorite: () => Promise<void>;
  onShowProfile: () => void;
}

export default function DemandeCardMobile({
  demande,
  link,
  showFavoriteButton,
  isFavorite,
  isUrgent,
  isExpired,
  daysRemaining,
  onToggleFavorite,
  onShowProfile,
}: DemandeCardMobileProps) {
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
          <div className={`relative px-4 py-3 rounded-t-2xl ${
            isUrgent
              ? 'bg-gradient-to-r from-red-50 to-red-100/80'
              : 'bg-gradient-to-r from-accent/5 to-accent/10'
          }`}>
            {/* Date limite - Info clé (remplace la date de départ des voyages) */}
            {demande.dateLimite && (
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isUrgent ? 'bg-red-100' : 'bg-accent/10'
                }`}>
                  <Clock className={`w-4.5 h-4.5 ${isUrgent ? 'text-red-600' : 'text-accent'}`} />
                </div>
                <div>
                  <p className={`text-xs leading-tight ${isUrgent ? 'text-red-700' : 'text-gray-600'}`}>
                    {isExpired ? 'Expiré' : 'Date limite'}
                  </p>
                  <p className={`text-base font-bold leading-tight ${
                    isUrgent ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {!isExpired && daysRemaining !== null
                      ? `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}`
                      : 'Terminé'}
                  </p>
                </div>
              </div>
            )}

            {/* Itinéraire - Horizontal compact */}
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-gray-900 truncate">
                  {demande.villeDepart}
                </p>
              </div>

              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center">
                  <Plane className="w-4.5 h-4.5 text-primary rotate-45" />
                </div>
              </div>

              <div className="flex-1 min-w-0 text-right">
                <p className="text-base font-bold text-gray-900 truncate">
                  {demande.villeArrivee}
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
                  <span className="font-bold text-gray-900">{formatWeight(demande.poidsEstime)}</span>
                  <span className="text-gray-500 ml-1">estimé</span>
                </span>
              </div>

              <div className="text-right">
                <PriceDisplay
                  prixParKilo={demande.prixParKilo}
                  commission={null}
                  currency={demande.currency}
                  converted={demande.converted}
                  viewerCurrency={demande.viewerCurrency}
                  compact={true}
                />
              </div>
            </div>

            {/* Client + CTA */}
            <div className="flex items-center gap-2.5 pt-2.5 border-t border-gray-100">
              {/* Avatar minimal */}
              <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <AvatarWithButton
                  src={demande.client.photo}
                  alt={`${demande.client.prenom} ${demande.client.nom}`}
                  fallback={`${demande.client.prenom} ${demande.client.nom}`}
                  size="sm"
                  buttonType="info"
                  onButtonClick={onShowProfile}
                />
              </div>

              {/* Nom client */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-sm text-gray-700 truncate">
                  {demande.client.prenom} {demande.client.nom[0]}.
                </span>
                {demande.client.emailVerifie && (
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
