'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

import AvisForm from '@/components/forms/AvisForm';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFavoriActions } from '@/lib/hooks/useFavoris';
import { useSignalementActions } from '@/lib/hooks/useSignalement';
import { useAvisStore } from '@/lib/store';
import type {
  CreateAvisFormData,
  CreateSignalementFormData,
} from '@/lib/validations';
import type { Voyage } from '@/types';

import { useToast } from '../common';
import SignalementForm from '../forms/SignalementForm';
import VoyageDetailsDesktop from './VoyageDetailsDesktop';
import VoyageDetailsMobile from './VoyageDetailsMobile';

interface VoyageDetailsProps {
  voyage: Voyage;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onContact?: () => void;
}

export default function VoyageDetails({
  voyage,
  isOwner = false,
  onEdit,
  onDelete,
  onContact,
}: VoyageDetailsProps) {
  const [isSignalementOpen, setIsSignalementOpen] = useState(false);
  const [isAvisOpen, setIsAvisOpen] = useState(false);
  const { user } = useAuth();
  const toast = useToast();
  const { addVoyageToFavoris, removeFavori, isFavoriVoyage } = useFavoriActions();
  const { createSignalement } = useSignalementActions();
  const { createAvis } = useAvisStore();

  const isFavorite = isFavoriVoyage(voyage.id);
  const isExpired = voyage.statut === 'expire';
  const canLeaveReview = !isOwner && voyage.statut === 'complete';
  const showContactButton = !isOwner && voyage.statut === 'actif';

  const handleToggleFavorite = async () => {
    if (user?.isProfileComplete) {
      if (isFavorite) {
        await removeFavori(voyage.id, 'voyage');
      } else {
        await addVoyageToFavoris(voyage.id);
      }
    } else {
      toast.error("Veuillez compléter votre profil pour pouvoir ajouter aux favoris.");
    }
  };

  const handleSignalement = async (data: CreateSignalementFormData) => {
    if (user?.isProfileComplete) {
      await createSignalement(data);
    } else {
      toast.error("Veuillez compléter votre profil pour pouvoir signaler un voyage.");
    }
  };

  const handleAvis = async (data: CreateAvisFormData) => {
    if (user?.isProfileComplete) {
      await createAvis(data);
    } else {
      toast.error("Veuillez compléter votre profil pour pouvoir laisser un avis.");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <VoyageDetailsMobile
          voyage={voyage}
          user={user}
          isOwner={isOwner}
          isFavorite={isFavorite}
          isExpired={isExpired}
          canLeaveReview={canLeaveReview}
          onToggleFavorite={handleToggleFavorite}
          onOpenSignalement={() => setIsSignalementOpen(true)}
          onOpenAvis={() => setIsAvisOpen(true)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <VoyageDetailsDesktop
          voyage={voyage}
          user={user}
          isOwner={isOwner}
          isFavorite={isFavorite}
          isExpired={isExpired}
          canLeaveReview={canLeaveReview}
          showContactButton={showContactButton}
          onToggleFavorite={handleToggleFavorite}
          onOpenSignalement={() => setIsSignalementOpen(true)}
          onOpenAvis={() => setIsAvisOpen(true)}
          onEdit={onEdit}
          onDelete={onDelete}
          onContact={onContact}
        />
      </motion.div>

      {/* Modals */}
      {user && !isOwner && (
        <SignalementForm
          isOpen={isSignalementOpen}
          onClose={() => setIsSignalementOpen(false)}
          onSubmit={handleSignalement}
          voyageId={voyage.id}
        />
      )}

      {user && canLeaveReview && (
        <AvisForm
          isOpen={isAvisOpen}
          onClose={() => setIsAvisOpen(false)}
          cibleId={voyage.voyageur.id}
          cibleNom={`${voyage.voyageur.prenom} ${voyage.voyageur.nom}`}
          voyageId={voyage.id}
          onSubmit={handleAvis}
        />
      )}
    </>
  );
}
