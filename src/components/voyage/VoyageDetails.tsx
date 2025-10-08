'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Package, MessageCircle, AlertCircle, Flag } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardContent, Avatar, Button } from '@/components/ui';
import VoyageStatusBadge from './VoyageStatusBadge';
import { formatDate, formatWeight } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import { useFavoriActions } from '@/lib/hooks/useFavoris';
import { useSignalementActions } from '@/lib/hooks/useSignalement';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Voyage } from '@/types';
import type { CreateSignalementFormData } from '@/lib/validations';
import { FavoriteButton } from '../favori';
import SignalementForm from '../forms/SignalementForm';

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
  onContact 
}: VoyageDetailsProps) {
  const [isSignalementOpen, setIsSignalementOpen] = useState(false);
  const { user } = useAuth();
  const { addVoyageToFavoris, removeFavori, isFavoriVoyage } = useFavoriActions();
  const { createSignalement } = useSignalementActions();
  
  const isFavorite = isFavoriVoyage(voyage.id);

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await removeFavori(voyage.id, 'voyage');
    } else {
      await addVoyageToFavoris(voyage.id);
    }
  };

  const handleSignalement = async (data: CreateSignalementFormData) => {
    await createSignalement(data);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header Card */}
        <Card>
          <CardHeader
            title={`${voyage.villeDepart} → ${voyage.villeArrivee}`}
            action={
              <div className="flex items-center gap-3">
                {user && !isOwner && (
                  <>
                    <FavoriteButton
                      isFavorite={isFavorite}
                      onToggle={handleToggleFavorite}
                      size="md"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Flag className="w-4 h-4" />}
                      onClick={() => setIsSignalementOpen(true)}
                      className="text-gray-600 hover:text-error"
                    >
                      Signaler
                    </Button>
                  </>
                )}
                <VoyageStatusBadge statut={voyage.statut} />
              </div>
            }
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date de départ */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Départ</p>
                  <p className="font-semibold text-gray-900">{formatDate(voyage.dateDepart)}</p>
                </div>
              </div>

              {/* Date d'arrivée */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Arrivée</p>
                  <p className="font-semibold text-gray-900">{formatDate(voyage.dateArrivee)}</p>
                </div>
              </div>

              {/* Poids disponible */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Poids disponible</p>
                  <p className="font-semibold text-gray-900">{formatWeight(voyage.poidsDisponible)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {voyage.description && (
          <Card>
            <CardHeader title="Description" />
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{voyage.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Voyageur Info */}
        <Card>
          <CardHeader title="Voyageur" />
          <CardContent>
            <div className="flex items-center justify-between">
              <Link
                href={ROUTES.USER_PROFILE(voyage.voyageur.id)}
                className="flex items-center gap-4 group"
              >
                <Avatar
                  src={voyage.voyageur.photo || undefined}
                  fallback={`${voyage.voyageur.nom} ${voyage.voyageur.prenom}`}
                  size="lg"
                  verified={voyage.voyageur.emailVerifie}
                />
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {voyage.voyageur.prenom} {voyage.voyageur.nom}
                  </p>
                  {voyage.voyageur.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {voyage.voyageur.bio}
                    </p>
                  )}
                </div>
              </Link>

              {!isOwner && voyage.statut === 'actif' && (
                <Button
                  variant="primary"
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                  onClick={onContact}
                >
                  Contacter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Owner Actions */}
        {isOwner && (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={onEdit}
                  className="flex-1 md:flex-none"
                >
                  Modifier
                </Button>
                <Button
                  variant="danger"
                  onClick={onDelete}
                  className="flex-1 md:flex-none"
                  leftIcon={<AlertCircle className="w-4 h-4" />}
                >
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Modal de signalement */}
      {user && !isOwner && (
        <SignalementForm
          isOpen={isSignalementOpen}
          onClose={() => setIsSignalementOpen(false)}
          onSubmit={handleSignalement}
          voyageId={voyage.id}
        />
      )}
    </>
  );
}