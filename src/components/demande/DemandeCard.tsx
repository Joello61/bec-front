'use client';

import { motion } from 'framer-motion';
import { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/lib/hooks/useAuth';
import { useFavoriActions } from '@/lib/hooks/useFavoris';
import { ROUTES } from '@/lib/utils/constants';
import { getDaysRemaining } from '@/lib/utils/format';
import type { Demande } from '@/types';

import ShowProfileModal from '../user/ShowProfileModal';
import DemandeCardDesktop from './DemandeCardDesktop';
import DemandeCardMobile from './DemandeCardMobile';

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
  const showFavoriteButton = Boolean(user) && !isOwner;

  const [showProfileModal, setShowProfileModal] = useState(false);

  const link = (pathname?.includes('/dashboard/mes-demandes')
    ? ROUTES.MES_DEMANDE_DETAILS(demande.id)
    : ROUTES.DEMANDE_DETAILS(demande.id)) as Route;

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
      <DemandeCardMobile
        demande={demande}
        link={link}
        showFavoriteButton={showFavoriteButton}
        isFavorite={isFavorite}
        isUrgent={isUrgent}
        isExpired={isExpired}
        daysRemaining={daysRemaining}
        onToggleFavorite={handleToggleFavorite}
        onShowProfile={() => setShowProfileModal(true)}
      />

      <DemandeCardDesktop
        demande={demande}
        link={link}
        showFavoriteButton={showFavoriteButton}
        isFavorite={isFavorite}
        isUrgent={isUrgent}
        daysRemaining={daysRemaining}
        onToggleFavorite={handleToggleFavorite}
        onShowProfile={() => setShowProfileModal(true)}
      />

      <ShowProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={demande.client}
      />
    </motion.div>
  );
}
