'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Package,
  MessageCircle,
  AlertCircle,
  Flag,
  Star,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Clock,
  Plane,
} from 'lucide-react';
import { Card, CardHeader, CardContent, Avatar, Button } from '@/components/ui';
import VoyageStatusBadge from './VoyageStatusBadge';
import AvisForm from '@/components/forms/AvisForm';
import { formatDate, formatWeight } from '@/lib/utils/format';
import { useFavoriActions } from '@/lib/hooks/useFavoris';
import { useSignalementActions } from '@/lib/hooks/useSignalement';
import { useAvisStore } from '@/lib/store';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Voyage } from '@/types';
import type {
  CreateSignalementFormData,
  CreateAvisFormData,
} from '@/lib/validations';
import { FavoriteButton } from '../favori';
import SignalementForm from '../forms/SignalementForm';
import { CurrencyDisplay, useToast } from '../common';

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
  const { addVoyageToFavoris, removeFavori, isFavoriVoyage } =
    useFavoriActions();
  const { createSignalement } = useSignalementActions();
  const { createAvis } = useAvisStore();

  const isFavorite = isFavoriVoyage(voyage.id);
  const canLeaveReview = !isOwner && voyage.statut === 'complete';

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
        className="space-y-6"
      >
        {/* Header Card */}
        <Card>
          <CardHeader
            title={
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <div className="flex items-center gap-2">
                  <span>{voyage.villeDepart}</span>
                  <Plane className="w-5 h-5 text-primary" />
                  <span>{voyage.villeArrivee}</span>
                </div>

                {/* Sur mobile : statut sous l’itinéraire */}
                <div className="flex sm:hidden mt-3">
                  <VoyageStatusBadge statut={voyage.statut} />
                </div>
              </div>
            }
            action={
              // Sur desktop uniquement : actions + statut à droite
              <div className="hidden sm:flex items-center gap-3">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              {/* Date de départ */}
              <div className="flex items-center sm:items-start gap-3 bg-white rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="flex flex-col justify-center sm:justify-start">
                  <p className="text-xs sm:text-sm text-gray-500">Départ</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                    {formatDate(voyage.dateDepart)}
                  </p>
                </div>
              </div>

              {/* Date d'arrivée */}
              <div className="flex items-center sm:items-start gap-3 bg-white rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="flex flex-col justify-center sm:justify-start">
                  <p className="text-xs sm:text-sm text-gray-500">Arrivée</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                    {formatDate(voyage.dateArrivee)}
                  </p>
                </div>
              </div>

              {/* Poids disponible */}
              <div className="flex items-center sm:items-start gap-3 bg-white rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="flex flex-col justify-center sm:justify-start">
                  <p className="text-xs sm:text-sm text-gray-500">Poids disponible</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                    {formatWeight(voyage.poidsDisponible)}
                  </p>
                </div>
              </div>

              {/* Prix par kilo */}
              {voyage.prixParKilo && (
                <div className="flex items-center sm:items-start gap-3 bg-white rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="flex flex-col justify-center sm:justify-start">
                    <p className="text-xs sm:text-sm text-gray-500">Prix par kilo</p>
                    <CurrencyDisplay
                      amount={voyage.prixParKilo}
                      currency={voyage.currency}
                      converted={voyage.converted}
                      viewerCurrency={voyage.viewerCurrency}
                      field="prixParKilo"
                      className="text-sm sm:text-base font-semibold text-gray-900"
                    />
                  </div>
                </div>
              )}

              {/* Commission proposée */}
              {voyage.commissionProposeePourUnBagage && (
                <div className="flex items-center sm:items-start gap-3 bg-white rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="flex flex-col justify-center sm:justify-start">
                    <p className="text-xs sm:text-sm text-gray-500">Commission bagage</p>
                    <CurrencyDisplay
                      amount={voyage.commissionProposeePourUnBagage}
                      currency={voyage.currency}
                      converted={voyage.converted}
                      viewerCurrency={voyage.viewerCurrency}
                      field="commission"
                      className="text-sm sm:text-base font-semibold text-gray-900"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>


        {/* Description */}
        {voyage.description && (
          <Card>
            <CardHeader title="Description du voyage" />
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {voyage.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Voyageur Info */}
        <Card>
          <CardHeader title="Informations du voyageur" />
          <CardContent>
            <div className="space-y-6">
              {/* Profil du voyageur */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 group">
                  <Avatar
                    src={voyage.voyageur.photo || undefined}
                    fallback={`${voyage.voyageur.nom} ${voyage.voyageur.prenom}`}
                    size="lg"
                    verified={voyage.voyageur.emailVerifie}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        {voyage.voyageur.prenom} {voyage.voyageur.nom}
                      </p>
                      {!isOwner &&
                        voyage.voyageur.noteAvisMoyen !== null &&
                        voyage.voyageur.noteAvisMoyen > 0 && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-full">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium text-amber-700">
                              {voyage.voyageur.noteAvisMoyen.toFixed(1)}
                            </span>
                          </div>
                        )}
                    </div>
                    {voyage.voyageur.bio && (
                      <p className="text-sm text-gray-600 mt-1">
                        {voyage.voyageur.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {canLeaveReview && (
                    <Button
                      variant="outline"
                      leftIcon={<Star className="w-4 h-4" />}
                      onClick={() => setIsAvisOpen(true)}
                    >
                      Laisser un avis
                    </Button>
                  )}
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
              </div>

              {/* Coordonnées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{voyage.voyageur.email}</span>
                </div>
                {voyage.voyageur.telephone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{voyage.voyageur.telephone}</span>
                  </div>
                )}
                {voyage.voyageur.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {voyage.voyageur.address.ville}
                      {voyage.voyageur.address.quartier && `, ${voyage.voyageur.address.quartier}`}
                      {voyage.voyageur.address.pays && ` - ${voyage.voyageur.address.pays}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Membre depuis {formatDate(voyage.voyageur.createdAt)}
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
                <span className="text-gray-500">Créé le :</span>
                <span className="ml-2 font-medium text-gray-900">
                  {formatDate(voyage.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Dernière mise à jour :</span>
                <span className="ml-2 font-medium text-gray-900">
                  {formatDate(voyage.updatedAt)}
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
                  disabled={voyage.statut === 'annule'}
                >
                  Modifier
                </Button>
                <Button
                  variant="danger"
                  onClick={onDelete}
                  className="flex-1 md:flex-none"
                  leftIcon={<AlertCircle className="w-4 h-4" />}
                  disabled={voyage.statut === 'annule'}
                >
                  {voyage.statut === 'annule' ? 'Voyage annulé' : 'Annuler le voyage'}
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

      {/* Modal d'avis */}
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