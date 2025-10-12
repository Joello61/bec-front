'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Package,
  MessageCircle,
  AlertCircle,
  Clock,
  Flag,
  DollarSign,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardContent, Avatar, Button } from '@/components/ui';
import DemandeStatusBadge from './DemandeStatusBadge';
import { formatDate, formatWeight, getDaysRemaining } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import { useFavoriActions } from '@/lib/hooks/useFavoris';
import { useSignalementActions } from '@/lib/hooks/useSignalement';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Demande } from '@/types';
import type { CreateSignalementFormData } from '@/lib/validations';
import { FavoriteButton } from '../favori';
import SignalementForm from '../forms/SignalementForm';
import { useToast } from '../common';

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
  const daysRemaining = demande.dateLimite
    ? getDaysRemaining(demande.dateLimite)
    : null;
  const { user } = useAuth();
  const { addDemandeToFavoris, removeFavori, isFavoriDemande } =
    useFavoriActions();
  const { createSignalement } = useSignalementActions();

  const isFavorite = isFavoriDemande(demande.id);

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
        className="space-y-6"
      >
        {/* Header Card */}
        <Card>
          <CardHeader
            title={`${demande.villeDepart} → ${demande.villeArrivee}`}
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
                <DemandeStatusBadge statut={demande.statut} />
              </div>
            }
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Poids estimé */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Poids estimé</p>
                  <p className="font-semibold text-gray-900">
                    {formatWeight(demande.poidsEstime)}
                  </p>
                </div>
              </div>

              {/* Date limite */}
              {demande.dateLimite && (
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    daysRemaining !== null && daysRemaining < 3 
                      ? 'bg-red-50' 
                      : 'bg-primary/10'
                  }`}>
                    <Clock className={`w-5 h-5 ${
                      daysRemaining !== null && daysRemaining < 3 
                        ? 'text-error' 
                        : 'text-primary'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date limite</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(demande.dateLimite)}
                    </p>
                    {daysRemaining !== null && (
                      <p
                        className={`text-sm mt-1 font-medium ${
                          daysRemaining < 0
                            ? 'text-gray-500'
                            : daysRemaining < 3
                            ? 'text-error'
                            : 'text-green-600'
                        }`}
                      >
                        {daysRemaining < 0
                          ? 'Expiré'
                          : daysRemaining === 0
                          ? "Aujourd'hui"
                          : daysRemaining === 1
                          ? 'Demain'
                          : `${daysRemaining} jours restants`}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Prix par kilo */}
              {demande.prixParKilo && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prix par kilo</p>
                    <p className="font-semibold text-green-600">
                      {demande.prixParKilo} XAF
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Commission proposée */}
            {demande.commissionProposeePourUnBagage && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      Commission proposée pour un bagage
                    </p>
                    <p className="text-2xl font-bold text-amber-600">
                      {demande.commissionProposeePourUnBagage} XAF
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader title="Description de la demande" />
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">
              {demande.description}
            </p>
          </CardContent>
        </Card>

        {/* Client Info */}
        <Card>
          <CardHeader title="Informations du client" />
          <CardContent>
            <div className="space-y-6">
              {/* Profil du client */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <Link
                  href={ROUTES.USER_PROFILE(demande.client.id)}
                  className="flex items-center gap-4 group"
                >
                  <Avatar
                    src={demande.client.photo || undefined}
                    fallback={`${demande.client.nom} ${demande.client.prenom}`}
                    size="lg"
                    verified={demande.client.emailVerifie}
                  />
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {demande.client.prenom} {demande.client.nom}
                    </p>
                    {demande.client.bio && (
                      <p className="text-sm text-gray-600 mt-1">
                        {demande.client.bio}
                      </p>
                    )}
                  </div>
                </Link>

                {!isOwner && demande.statut === 'en_recherche' && (
                  <Button
                    variant="primary"
                    leftIcon={<MessageCircle className="w-4 h-4" />}
                    onClick={onContact}
                  >
                    Proposer mes services
                  </Button>
                )}
              </div>

              {/* Coordonnées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{demande.client.email}</span>
                </div>
                {demande.client.telephone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{demande.client.telephone}</span>
                  </div>
                )}
                {demande.client.ville && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {demande.client.ville}
                      {demande.client.quartier && `, ${demande.client.quartier}`}
                      {demande.client.pays && ` - ${demande.client.pays}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Membre depuis {formatDate(demande.client.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dates de gestion */}
        <Card>
          <CardHeader title="Informations système" />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Créée le :</span>
                <span className="ml-2 font-medium text-gray-900">
                  {formatDate(demande.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Dernière mise à jour :</span>
                <span className="ml-2 font-medium text-gray-900">
                  {formatDate(demande.updatedAt)}
                </span>
              </div>
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
                  disabled={demande.statut === 'annulee'}
                >
                  Modifier
                </Button>
                <Button
                  variant="danger"
                  onClick={onDelete}
                  className="flex-1 md:flex-none"
                  leftIcon={<AlertCircle className="w-4 h-4" />}
                  disabled={demande.statut === 'annulee'}
                >
                  {demande.statut === 'annulee' ? 'Demande annulée' : 'Annuler la demande'}
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
          demandeId={demande.id}
        />
      )}
    </>
  );
}