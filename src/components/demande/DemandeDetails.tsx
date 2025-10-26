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
  ArrowRight,
  Heart,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardContent, Avatar, Button } from '@/components/ui';
import DemandeStatusBadge from './DemandeStatusBadge';
import { formatDate, formatWeight, getDaysRemaining } from '@/lib/utils/format';
import { useFavoriActions } from '@/lib/hooks/useFavoris';
import { useSignalementActions } from '@/lib/hooks/useSignalement';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Demande } from '@/types';
import type { CreateSignalementFormData } from '@/lib/validations';
import { FavoriteButton } from '../favori';
import SignalementForm from '../forms/SignalementForm';
import { CurrencyDisplay, useToast } from '../common';

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
      {/* Layout Mobile (< 1024px) - Version précédente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden space-y-4 md:space-y-6 md:pb-6"
      >
        {/* Header Card */}
        <Card>
          <CardHeader
            title={
              <div className="flex flex-col gap-3">
                {/* Itinéraire */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900">{demande.villeDepart}</span>
                  <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="font-bold text-gray-900">{demande.villeArrivee}</span>
                </div>

                {/* Statut + Actions secondaires mobile */}
                <div className="flex items-center gap-2 flex-wrap">
                  <DemandeStatusBadge statut={demande.statut} />
                  
                  {/* Badge urgence mobile */}
                  {isUrgent && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {daysRemaining}j restant{daysRemaining > 1 ? 's' : ''}
                    </span>
                  )}
                  
                  {/* Actions secondaires - Mobile uniquement */}
                  {user && !isOwner && (
                    <div className="flex md:hidden items-center gap-2 ml-auto">
                      {!isExpired && (
                        <button
                          onClick={handleToggleFavorite}
                          className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                          <Heart 
                            className={`w-4.5 h-4.5 transition-colors ${
                              isFavorite 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-600'
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
            action={
              // Actions desktop
              <div className="hidden md:flex items-center gap-3">
                {user && !isOwner && (
                  <>
                    {!isExpired && (
                      <FavoriteButton
                        isFavorite={isFavorite}
                        onToggle={handleToggleFavorite}
                        size="md"
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
                  </>
                )}
              </div>
            }
          />

          <CardContent>
            {/* Grid responsive optimisé */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {/* Poids estimé */}
              <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">Poids estimé</p>
                </div>
                <p className="text-sm md:text-base font-bold text-gray-900">
                  {formatWeight(demande.poidsEstime)}
                </p>
              </div>

              {/* Date limite */}
              {demande.dateLimite && (
                <div className={`flex flex-col gap-2 rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-1 ${
                  isUrgent ? 'bg-red-50' : 'bg-white'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isUrgent ? 'bg-red-100' : 'bg-primary/10'
                    }`}>
                      <Clock className={`w-4 h-4 md:w-5 md:h-5 ${
                        isUrgent ? 'text-red-600' : 'text-primary'
                      }`} />
                    </div>
                    <p className={`text-xs md:text-sm font-medium ${
                      isUrgent ? 'text-red-700' : 'text-gray-500'
                    }`}>Date limite</p>
                  </div>
                  <div>
                    <p className={`text-sm md:text-base font-bold ${
                      isUrgent ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {formatDate(demande.dateLimite)}
                    </p>
                    {daysRemaining !== null && (
                      <p className={`text-xs md:text-sm mt-1 font-medium ${
                        daysRemaining < 0
                          ? 'text-gray-500'
                          : isUrgent
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}>
                        {daysRemaining < 0
                          ? 'Expiré'
                          : daysRemaining === 0
                          ? "Aujourd'hui"
                          : daysRemaining === 1
                          ? 'Demain'
                          : `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}`}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Prix par kilo */}
              {demande.prixParKilo && (
                <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">Prix/kg</p>
                  </div>
                  <CurrencyDisplay
                    amount={demande.prixParKilo}
                    currency={demande.currency}
                    converted={demande.converted}
                    viewerCurrency={demande.viewerCurrency}
                    field="prixParKilo"
                    className="text-sm md:text-base font-bold text-gray-900"
                  />
                </div>
              )}

              {/* Commission */}
              {demande.commissionProposeePourUnBagage && (
                <div className="flex flex-col gap-2 bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">Commission</p>
                  </div>
                  <CurrencyDisplay
                    amount={demande.commissionProposeePourUnBagage}
                    currency={demande.currency}
                    converted={demande.converted}
                    viewerCurrency={demande.viewerCurrency}
                    field="commission"
                    className="text-sm md:text-base font-bold text-gray-900"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader title="Description de la demande" />
          <CardContent>
            <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
              {demande.description}
            </p>
          </CardContent>
        </Card>

        {/* Client Info */}
        <Card>
          <CardHeader title="Informations du client" />
          <CardContent>
            <div className="space-y-4 md:space-y-6">
              {/* Profil du client */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 md:gap-4 flex-1">
                  <Avatar
                    src={demande.client.photo || undefined}
                    fallback={`${demande.client.nom} ${demande.client.prenom}`}
                    size="lg"
                    verified={demande.client.emailVerifie}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base md:text-lg text-gray-900">
                      {demande.client.prenom} {demande.client.nom}
                    </p>
                    {demande.client.bio && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {demande.client.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Coordonnées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 truncate">{demande.client.email}</span>
                </div>
                {demande.client.telephone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">{demande.client.telephone}</span>
                  </div>
                )}
                {demande.client.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 line-clamp-2">
                      {demande.client.address.ville}
                      {demande.client.address.quartier && `, ${demande.client.address.quartier}`}
                      {demande.client.address.pays && ` - ${demande.client.address.pays}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">
                    Membre depuis {formatDate(demande.client.createdAt)}
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
              <CardContent className="">
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
        </details>

        {/* Owner Actions - Desktop */}
        {isOwner && !isExpired && (
          <Card className="hidden md:block">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onEdit}
                  disabled={demande.statut === 'annulee'}
                >
                  Modifier
                </Button>
                <Button
                  variant="danger"
                  onClick={onDelete}
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
              <div className={`px-6 py-8 ${
                isUrgent 
                  ? 'bg-gradient-to-r from-red-50 via-orange-50 to-red-50' 
                  : 'bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <DemandeStatusBadge statut={demande.statut} size="lg" />
                    {isUrgent && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-bold text-red-700">
                          {daysRemaining} jour{daysRemaining! > 1 ? 's' : ''} restant{daysRemaining! > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
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
                    <h2 className="text-3xl font-bold text-gray-900">{demande.villeDepart}</h2>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center ${
                      isUrgent ? 'bg-red-100' : 'bg-white'
                    }`}>
                      <Package className={`w-8 h-8 ${isUrgent ? 'text-red-600' : 'text-accent'}`} />
                    </div>
                    <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full">
                      <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs text-gray-600">Transport</span>
                    </div>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="text-sm text-gray-600 mb-2">Arrivée</p>
                    <h2 className="text-3xl font-bold text-gray-900">{demande.villeArrivee}</h2>
                  </div>
                </div>

                {/* Date limite avec urgence */}
                {demande.dateLimite && (
                  <div className={`mt-6 flex items-center justify-center gap-3 px-4 py-3 rounded-lg ${
                    isUrgent ? 'bg-red-100' : 'bg-white/60'
                  }`}>
                    <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-600' : 'text-accent'}`} />
                    <div className="text-center">
                      <p className={`text-xs font-medium ${isUrgent ? 'text-red-700' : 'text-gray-600'}`}>
                        Date limite
                      </p>
                      <p className={`text-lg font-bold ${isUrgent ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatDate(demande.dateLimite)}
                      </p>
                      {daysRemaining !== null && (
                        <p className={`text-sm font-medium mt-1 ${
                          daysRemaining < 0
                            ? 'text-gray-500'
                            : isUrgent
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}>
                          {daysRemaining < 0
                            ? 'Expiré'
                            : daysRemaining === 0
                            ? "Expire aujourd'hui !"
                            : daysRemaining === 1
                            ? 'Expire demain !'
                            : `${daysRemaining} jours restants`}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Infos rapides en badge */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm">
                    <Package className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-gray-900">
                      {formatWeight(demande.poidsEstime)}
                    </span>
                    <span className="text-xs text-gray-500">estimé</span>
                  </div>

                  {demande.prixParKilo && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm">
                      <DollarSign className="w-4 h-4 text-accent" />
                      <CurrencyDisplay
                        amount={demande.prixParKilo}
                        currency={demande.currency}
                        converted={demande.converted}
                        viewerCurrency={demande.viewerCurrency}
                        field="prixParKilo"
                        className="text-sm font-semibold text-gray-900"
                      />
                      <span className="text-xs text-gray-500">/kg</span>
                    </div>
                  )}

                  {demande.commissionProposeePourUnBagage && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm">
                      <Shield className="w-4 h-4 text-accent" />
                      <CurrencyDisplay
                        amount={demande.commissionProposeePourUnBagage}
                        currency={demande.currency}
                        converted={demande.converted}
                        viewerCurrency={demande.viewerCurrency}
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
            <Card>
              <CardHeader title="Description de la demande" />
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {demande.description}
                </p>
              </CardContent>
            </Card>

            {/* Informations système - Collapsible */}
            <details className="group">
              <summary className="cursor-pointer list-none">
                <Card className="group-open:rounded-b-none hover:bg-gray-50 transition-colors">
                  <CardContent className="">
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
                      <span className="text-gray-500">Créée le :</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {formatDate(demande.createdAt)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Mise à jour :</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {formatDate(demande.updatedAt)}
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
              {/* Card Client */}
              <Card>
                <CardHeader title="Client" />
                <CardContent>
                  <div className="space-y-4">
                    {/* Profil */}
                    <div className="flex items-start gap-4">
                      <Avatar
                        src={demande.client.photo || undefined}
                        fallback={`${demande.client.nom} ${demande.client.prenom}`}
                        size="xl"
                        verified={demande.client.emailVerifie}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 truncate mb-1">
                          {demande.client.prenom} {demande.client.nom}
                        </h3>

                        {demande.client.bio && (
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {demande.client.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 truncate">{demande.client.email}</span>
                      </div>
                      {demande.client.telephone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{demande.client.telephone}</span>
                        </div>
                      )}
                      {demande.client.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 line-clamp-2">
                            {demande.client.address.ville}
                            {demande.client.address.pays && `, ${demande.client.address.pays}`}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          Membre depuis {formatDate(demande.client.createdAt)}
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
                          Proposer mes services
                        </Button>
                      )}

                      {isOwner && !isExpired && (
                        <>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={onEdit}
                            disabled={demande.statut === 'annulee'}
                            className="w-full"
                          >
                            Modifier la demande
                          </Button>
                          <Button
                            variant="danger"
                            size="lg"
                            onClick={onDelete}
                            leftIcon={<AlertCircle className="w-5 h-5" />}
                            disabled={demande.statut === 'annulee'}
                            className="w-full"
                          >
                            {demande.statut === 'annulee' ? 'Demande annulée' : 'Annuler la demande'}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card Urgence (si applicable) */}
              {isUrgent && (
                <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-100">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">
                          Demande urgente
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Cette demande expire dans {daysRemaining} jour{daysRemaining! > 1 ? 's' : ''}. 
                          Contactez rapidement le client si vous êtes intéressé.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

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
                        Vérifiez toujours le contenu du colis. Ne transportez jamais d&apos;objets illégaux ou suspects.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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