'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

import { useAuth } from '@/lib/hooks/useAuth';
import { useFavoriActions } from '@/lib/hooks/useFavoris';
import { useSignalementActions } from '@/lib/hooks/useSignalement';
import { getDaysRemaining } from '@/lib/utils/format';
import type { CreateSignalementFormData } from '@/lib/validations';
import type { Demande } from '@/types';

import { useToast } from '../common';
import SignalementForm from '../forms/SignalementForm';
import DemandeDetailsDesktop from './DemandeDetailsDesktop';
import DemandeDetailsMobile from './DemandeDetailsMobile';

interface DemandeDetailsProps {
  demande: Demande;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onContact?: () => void;
}

export default function DemandeDetails({
  demande,
  isOwner = false,
  onEdit,
  onDelete,
  onContact,
}: DemandeDetailsProps) {
  const [isSignalementOpen, setIsSignalementOpen] = useState(false);
  const toast = useToast();
  const daysRemaining = demande.dateLimite ? getDaysRemaining(demande.dateLimite) : null;
  const { user } = useAuth();
  const { addDemandeToFavoris, removeFavori, isFavoriDemande } = useFavoriActions();
  const { createSignalement } = useSignalementActions();

  const isFavorite = isFavoriDemande(demande.id);
  const isExpired = demande.statut === 'expiree';
  const isUrgent = daysRemaining !== null && daysRemaining < 3 && daysRemaining >= 0;
  const showContactButton = !isOwner && demande.statut === 'en_recherche';

  const handleToggleFavorite = async () => {
    if (user?.isProfileComplete) {
      if (isFavorite) {
        await removeFavori(demande.id, 'demande');
      } else {
        await addDemandeToFavoris(demande.id);
      }
    } else {
      toast.error("Veuillez compléter votre profil pour pouvoir ajouter aux favoris.");
    }
  };

  const handleSignalement = async (data: CreateSignalementFormData) => {
    if (user?.isProfileComplete) {
      await createSignalement(data);
    } else {
      toast.error("Veuillez compléter votre profil pour pouvoir signaler une demande.");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <DemandeDetailsMobile
          demande={demande}
          user={user}
          isOwner={isOwner}
          isFavorite={isFavorite}
          isExpired={isExpired}
          isUrgent={isUrgent}
          daysRemaining={daysRemaining}
          onToggleFavorite={handleToggleFavorite}
          onOpenSignalement={() => setIsSignalementOpen(true)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <DemandeDetailsDesktop
          demande={demande}
          user={user}
          isOwner={isOwner}
          isFavorite={isFavorite}
          isExpired={isExpired}
          isUrgent={isUrgent}
          daysRemaining={daysRemaining}
          showContactButton={showContactButton}
          onToggleFavorite={handleToggleFavorite}
          onOpenSignalement={() => setIsSignalementOpen(true)}
          onEdit={onEdit}
          onDelete={onDelete}
          onContact={onContact}
        />
      </motion.div>

      {/* Modal de signalement */}
      {user && !isOwner && (
        <SignalementForm
          isOpen={isSignalementOpen}
          onClose={() => setIsSignalementOpen(false)}
          onSubmit={handleSignalement}
          demandeId={demande.id}
        />
      )}
    </>
  );
}
