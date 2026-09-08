'use client';

import { motion } from 'framer-motion';
import { ROUTES } from '@/lib/utils/constants';
import { useFavoriActions } from '@/lib/hooks/useFavoris';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Voyage } from '@/types';
import { usePathname } from 'next/navigation';
import { Route } from 'next';
import { useState } from 'react';
import ShowProfileModal from '../user/ShowProfileModal';
import VoyageCardMobile from './VoyageCardMobile';
import VoyageCardDesktop from './VoyageCardDesktop';

interface VoyageCardProps {
  voyage: Voyage;
}

export default function VoyageCard({ voyage }: VoyageCardProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { addVoyageToFavoris, removeFavori, isFavoriVoyage } = useFavoriActions();

  const isOwner = user?.id === voyage.voyageur.id;
  const isFavorite = isFavoriVoyage(voyage.id);
  const showFavoriteButton = Boolean(user) && !isOwner;

  const [showProfileModal, setShowProfileModal] = useState(false);

  const link = (pathname?.includes('dashboard/mes-voyages')
    ? ROUTES.MES_VOYAGE_DETAILS(voyage.id)
    : ROUTES.VOYAGE_DETAILS(voyage.id)) as Route;

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
      <VoyageCardMobile
        voyage={voyage}
        link={link}
        showFavoriteButton={showFavoriteButton}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onShowProfile={() => setShowProfileModal(true)}
      />

      <VoyageCardDesktop
        voyage={voyage}
        link={link}
        showFavoriteButton={showFavoriteButton}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onShowProfile={() => setShowProfileModal(true)}
      />

      <ShowProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={voyage.voyageur}
      />
    </motion.div>
  );
}
