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
  Heart,
  Shield,
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
      {/* Layout Mobile (< 1024px) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden space-y-4 md:space-y-6 md:pb-6"
      >
        {/* Header Card Mobile */}
        <Card>
          <CardHeader
            title={
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900">{voyage.villeDepart}</span>
                  <Plane className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-bold text-gray-900">{voyage.villeArrivee}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <VoyageStatusBadge statut={voyage.statut} />
                  {user && !isOwner && (
                    <div className="flex items-center gap-2 ml-auto">
                      {!isExpired && (
                        <button
                          onClick={handleToggleFavorite}
                          className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                          <Heart 
                            className={`w-4.5 h-4.5 transition-colors ${
                              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                            }`} 
                          />
                        </button>
                      )}
                      <button
                        onClick={() => setIsSignalementOpen(true)}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Flag className="w-4.5 h-4.5 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            }
          />
           <CardContent>
            {/* Grid responsive optimisé */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {/* Date de départ */}
              <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">Départ</p>
                </div>
                <p className="text-sm md:text-base font-bold text-gray-900">
                  {formatDate(voyage.dateDepart)}
                </p>
              </div>

              {/* Date d'arrivée */}
              <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">Arrivée</p>
                </div>
                <p className="text-sm md:text-base font-bold text-gray-900">
                  {formatDate(voyage.dateArrivee)}
                </p>
              </div>

              {/* Poids disponible */}
              <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">Poids dispo</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm md:text-base font-bold text-gray-900">
                    {formatWeight(voyage.poidsDisponible)}
                  </p>
                  {parseFloat(voyage.poidsDisponibleRestant) !== parseFloat(voyage.poidsDisponible) && (
                    <p className="text-xs text-gray-500">
                      Restant: <span className="font-semibold text-gray-700">{formatWeight(voyage.poidsDisponibleRestant)}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Prix par kilo */}
              {voyage.prixParKilo && (
                <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">Prix/kg</p>
                  </div>
                  <CurrencyDisplay
                    amount={voyage.prixParKilo}
                    currency={voyage.currency}
                    converted={voyage.converted}
                    viewerCurrency={voyage.viewerCurrency}
                    field="prixParKilo"
                    className="text-sm md:text-base font-bold text-gray-900"
                  />
                </div>
              )}

              {/* Commission */}
              {voyage.commissionProposeePourUnBagage && (
                <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">Commission</p>
                  </div>
                  <CurrencyDisplay
                    amount={voyage.commissionProposeePourUnBagage}
                    currency={voyage.currency}
                    converted={voyage.converted}
                    viewerCurrency={voyage.viewerCurrency}
                    field="commission"
                    className="text-sm md:text-base font-bold text-gray-900"
                  />
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
              <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                {voyage.description}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader title="Informations du voyageur" />
          <CardContent>
            <div className="space-y-4 md:space-y-6">
              {/* Profil du voyageur */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 md:gap-4 flex-1">
                  <Avatar
                    src={voyage.voyageur.photo || undefined}
                    fallback={`${voyage.voyageur.nom} ${voyage.voyageur.prenom}`}
                    size="lg"
                    verified={voyage.voyageur.emailVerifie}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-base md:text-lg text-gray-900">
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
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {voyage.voyageur.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Boutons desktop */}
                {canLeaveReview && (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Star className="w-4 h-4" />}
                    onClick={() => setIsAvisOpen(true)}
                    className="hidden md:flex"
                  >
                    Laisser un avis
                  </Button>
                )}
              </div>

              {/* Coordonnées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 truncate">{voyage.voyageur.email}</span>
                </div>
                {voyage.voyageur.telephone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">{voyage.voyageur.telephone}</span>
                  </div>
                )}
                {voyage.voyageur.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 line-clamp-2">
                      {voyage.voyageur.address.ville}
                      {voyage.voyageur.address.quartier && `, ${voyage.voyageur.address.quartier}`}
                      {voyage.voyageur.address.pays && ` - ${voyage.voyageur.address.pays}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">
                    Membre depuis {formatDate(voyage.voyageur.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations système - Collapsible sur mobile */}
        <details className="md:block group">
          <summary className="md:hidden cursor-pointer list-none">
            <Card className="group-open:rounded-b-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Informations système</span>
                  <svg 
                    className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </summary>
          
          <Card className="md:block hidden group-open:block group-open:rounded-t-none group-open:border-t-0">
            <CardHeader title="Informations système" className="md:block hidden" />
            <CardContent className="pt-0 md:pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
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
        </details>

        {/* Owner Actions - Desktop */}
        {isOwner && !isExpired && (
          <Card className="hidden md:block">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onEdit}
                  disabled={voyage.statut === 'annule'}
                >
                  Modifier
                </Button>
                <Button
                  variant="danger"
                  onClick={onDelete}
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

      {/* Layout Desktop/Tablette (≥ 1024px) - NOUVEAU */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden lg:block"
      >
        <div className="grid grid-cols-12 gap-6 xl:gap-8">
          {/* Colonne principale - Contenu */}
          <div className="col-span-12 xl:col-span-8 space-y-6">
            {/* Hero Section - Itinéraire */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                  <VoyageStatusBadge statut={voyage.statut} size="lg" />
                  {user && !isOwner && (
                    <div className="flex items-center gap-3">
                      {!isExpired && (
                        <FavoriteButton
                          isFavorite={isFavorite}
                          onToggle={handleToggleFavorite}
                          size="lg"
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Flag className="w-4 h-4" />}
                        onClick={() => setIsSignalementOpen(true)}
                        className="text-gray-600 hover:text-error"
                      >
                        Signaler
                      </Button>
                    </div>
                  )}
                </div>

                {/* Itinéraire visuel */}
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Départ</p>
                    <h2 className="text-3xl font-bold text-gray-900">{voyage.villeDepart}</h2>
                    <p className="text-sm text-gray-600 mt-2">{formatDate(voyage.dateDepart)}</p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                      <Plane className="w-8 h-8 text-primary rotate-45" />
                    </div>
                    <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs text-gray-600">Direct</span>
                    </div>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="text-sm text-gray-600 mb-2">Arrivée</p>
                    <h2 className="text-3xl font-bold text-gray-900">{voyage.villeArrivee}</h2>
                    <p className="text-sm text-gray-600 mt-2">{formatDate(voyage.dateArrivee)}</p>
                  </div>
                </div>
              </div>

              {/* Infos rapides en badge */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-gray-900">
                      {formatWeight(voyage.poidsDisponible)}
                    </span>
                    <span className="text-xs text-gray-500">disponible</span>
                  </div>

                  {parseFloat(voyage.poidsDisponibleRestant) !== parseFloat(voyage.poidsDisponible) && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg shadow-sm">
                      <Package className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-semibold text-amber-900">
                        {formatWeight(voyage.poidsDisponibleRestant)}
                      </span>
                      <span className="text-xs text-amber-700">restant</span>
                    </div>
                  )}

                  {voyage.prixParKilo && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <CurrencyDisplay
                        amount={voyage.prixParKilo}
                        currency={voyage.currency}
                        converted={voyage.converted}
                        viewerCurrency={voyage.viewerCurrency}
                        field="prixParKilo"
                        className="text-sm font-semibold text-gray-900"
                      />
                      <span className="text-xs text-gray-500">/kg</span>
                    </div>
                  )}

                  {voyage.commissionProposeePourUnBagage && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm">
                      <Shield className="w-4 h-4 text-primary" />
                      <CurrencyDisplay
                        amount={voyage.commissionProposeePourUnBagage}
                        currency={voyage.currency}
                        converted={voyage.converted}
                        viewerCurrency={voyage.viewerCurrency}
                        field="commission"
                        className="text-sm font-semibold text-gray-900"
                      />
                      <span className="text-xs text-gray-500">commission</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Description */}
            {voyage.description && (
              <Card>
                <CardHeader title="Description du voyage" />
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {voyage.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Informations système - Collapsible */}
            <details className="group">
              <summary className="cursor-pointer list-none">
                <Card className="group-open:rounded-b-none hover:bg-gray-50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Informations système</span>
                      </div>
                      <svg 
                        className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </summary>
              
              <Card className="rounded-t-none border-t-0">
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Créé le :</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {formatDate(voyage.createdAt)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Mise à jour :</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {formatDate(voyage.updatedAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </details>
          </div>

          {/* Sidebar - Sticky */}
          <div className="col-span-12 xl:col-span-4">
            <div className="sticky top-6 space-y-6">
              {/* Card Voyageur */}
              <Card>
                <CardHeader title="Voyageur" />
                <CardContent>
                  <div className="space-y-4">
                    {/* Profil */}
                    <div className="flex items-start gap-4">
                      <Avatar
                        src={voyage.voyageur.photo || undefined}
                        fallback={`${voyage.voyageur.nom} ${voyage.voyageur.prenom}`}
                        size="xl"
                        verified={voyage.voyageur.emailVerifie}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-gray-900 truncate">
                            {voyage.voyageur.prenom} {voyage.voyageur.nom}
                          </h3>
                        </div>
                        
                        {!isOwner && voyage.voyageur.noteAvisMoyen !== null && voyage.voyageur.noteAvisMoyen > 0 && (
                          <div className="flex items-center gap-1.5 mb-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${
                                    i < Math.round(voyage.voyageur.noteAvisMoyen!) 
                                      ? 'fill-amber-400 text-amber-400' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {voyage.voyageur.noteAvisMoyen.toFixed(1)}
                            </span>
                          </div>
                        )}

                        {voyage.voyageur.bio && (
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {voyage.voyageur.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 truncate">{voyage.voyageur.email}</span>
                      </div>
                      {voyage.voyageur.telephone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{voyage.voyageur.telephone}</span>
                        </div>
                      )}
                      {voyage.voyageur.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 line-clamp-2">
                            {voyage.voyageur.address.ville}
                            {voyage.voyageur.address.pays && `, ${voyage.voyageur.address.pays}`}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          Membre depuis {formatDate(voyage.voyageur.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      {showContactButton && (
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={onContact}
                          leftIcon={<MessageCircle className="w-5 h-5" />}
                          className="w-full"
                        >
                          Contacter le voyageur
                        </Button>
                      )}

                      {canLeaveReview && (
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setIsAvisOpen(true)}
                          leftIcon={<Star className="w-5 h-5" />}
                          className="w-full"
                        >
                          Laisser un avis
                        </Button>
                      )}

                      {isOwner && !isExpired && (
                        <>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={onEdit}
                            disabled={voyage.statut === 'annule'}
                            className="w-full"
                          >
                            Modifier le voyage
                          </Button>
                          <Button
                            variant="danger"
                            size="lg"
                            onClick={onDelete}
                            leftIcon={<AlertCircle className="w-5 h-5" />}
                            disabled={voyage.statut === 'annule'}
                            className="w-full"
                          >
                            {voyage.statut === 'annule' ? 'Voyage annulé' : 'Annuler le voyage'}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card Sécurité */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">
                        Conseils de sécurité
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Vérifiez toujours l&apos;identité du voyageur. Ne payez jamais en avance sans confirmation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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