'use client';

import { motion } from 'framer-motion';
import { Calendar, Package, ArrowRight, Verified, Plane, MapPin, Eye } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';
import VoyageStatusBadge from './VoyageStatusBadge';
import { formatDateShort, formatWeight } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import { useFavoriActions } from '@/lib/hooks/useFavoris';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Voyage } from '@/types';
import { usePathname } from 'next/navigation';
import { Route } from 'next';
import { FavoriteButton } from '../favori';
import { PriceDisplay } from '../common';
import AvatarWithButton from '../ui/AvatarWithButton';
import { useState } from 'react';
import ShowProfileModal from '../user/ShowProfileModal';

interface VoyageCardProps {
  voyage: Voyage;
}

export default function VoyageCard({ voyage }: VoyageCardProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { addVoyageToFavoris, removeFavori, isFavoriVoyage } = useFavoriActions();

  const isOwner = user?.id === voyage.voyageur.id;
  const isFavorite = isFavoriVoyage(voyage.id);

  let link = '' as Route;

  const [showProfileModal, setShowProfileModal] = useState(false); 

  if (pathname?.includes('dashboard/mes-voyages')) {
    link = ROUTES.MES_VOYAGE_DETAILS(voyage.id);
  } else {
    link = ROUTES.VOYAGE_DETAILS(voyage.id);
  }

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await removeFavori(voyage.id, 'voyage');
    } else {
      await addVoyageToFavoris(voyage.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative hover:border-primary/30 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1"
    >
      {/* VERSION MOBILE (< 768px) - Optimisée */}
      <div className="md:hidden">
        {/* Bouton Favoris - Overlay discret */}
        {user && !isOwner && (
          <div className="absolute top-3 right-3 z-10">
            <div className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center hover:scale-110 transition-transform">
              <FavoriteButton
                isFavorite={isFavorite}
                onToggle={handleToggleFavorite}
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
                    onButtonClick={() => setShowProfileModal(true)}
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

      {/* VERSION DESKTOP (≥ 768px) - Design actuel conservé */}
      <div className="h-full hidden md:block">
        {/* Bouton Favoris Desktop */}
        {user && !isOwner && (
          <div className="absolute top-4 right-4 z-10 opacity-100 transition-opacity duration-200">
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={handleToggleFavorite}
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
                    onButtonClick={() => setShowProfileModal(true)}
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

      <ShowProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={voyage.voyageur}
      />
    </motion.div>
  );
}