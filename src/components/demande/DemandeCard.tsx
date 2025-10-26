'use client';

import { motion } from 'framer-motion';
import { Package, Clock, ArrowRight, Verified, Plane, MapPin, Eye } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';
import DemandeStatusBadge from './DemandeStatusBadge';
import { formatWeight, getDaysRemaining } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import { useFavoriActions } from '@/lib/hooks/useFavoris';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Demande } from '@/types';
import { usePathname } from 'next/navigation';
import { Route } from 'next';
import { FavoriteButton } from '../favori';
import { PriceDisplay } from '../common';
import AvatarWithButton from '../ui/AvatarWithButton';
import { useState } from 'react';
import ShowProfileModal from '../user/ShowProfileModal';

interface DemandeCardProps {
  demande: Demande;
}

export default function DemandeCard({ demande }: DemandeCardProps) {
  const daysRemaining = demande.dateLimite ? getDaysRemaining(demande.dateLimite) : null;
  const pathname = usePathname();
  const { user } = useAuth();
  const { addDemandeToFavoris, removeFavori, isFavoriDemande } = useFavoriActions();

  const isOwner = user?.id === demande.client.id;
  const isFavorite = isFavoriDemande(demande.id);

  const [showProfileModal, setShowProfileModal] = useState(false); 

  let link = '' as Route;

  if (pathname?.includes('/dashboard/mes-demandes')) {
    link = ROUTES.MES_DEMANDE_DETAILS(demande.id);
  } else {
    link = ROUTES.DEMANDE_DETAILS(demande.id);
  }

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await removeFavori(demande.id, 'demande');
    } else {
      await addDemandeToFavoris(demande.id);
    }
  };

  // Déterminer l'urgence de la date limite
  const isUrgent = daysRemaining !== null && daysRemaining < 3;
  const isExpired = daysRemaining !== null && daysRemaining < 0;

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
                      onButtonClick={() => setShowProfileModal(true)}
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

      {/* VERSION DESKTOP (≥ 768px) - Design actuel conservé */}
      <div className="hidden md:block">
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
                      onButtonClick={() => setShowProfileModal(true)}
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
      <ShowProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={demande.client}
      />
    </motion.div>
  );
}