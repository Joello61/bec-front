'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  Package,
  MapPin,
  Weight,
  DollarSign,
  MessageSquare,
  Plane,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Trash2,
} from 'lucide-react';
import { Card, CardHeader, CardContent, Avatar, Button, CardFooter } from '@/components/ui';
import { PropositionStatusBadge } from './PropositionStatusBadge';
import { CurrencyDisplay } from '@/components/common';
import { formatDate, formatWeight, formatFullName } from '@/lib/utils/format';
import type { Proposition } from '@/types';

interface PropositionDetailsProps {
  proposition: Proposition;
  isReceived: boolean;
  onAccept?: () => void;
  onRefuse?: () => void;
  onDelete?: () => void;
  onContactClient?: () => void;
  onContactVoyageur?: () => void;
  isResponding?: boolean;
  isCanceling?: boolean;
}

export default function PropositionDetails({
  proposition,
  isReceived,
  onAccept,
  onRefuse,
  onDelete,
  onContactClient,
  onContactVoyageur,
  isResponding = false,
  isCanceling = false,
}: PropositionDetailsProps) {
  
  const isPending = proposition.statut === 'en_attente';
  const isAccepted = proposition.statut === 'acceptee';
  const isRefused = proposition.statut === 'refusee';

  const otherUser = isReceived ? proposition.client : proposition.voyageur;
  const showActionButtons = isPending && isReceived && onAccept && onRefuse;
  const showContactButton = (isAccepted || isPending) && (onContactClient || onContactVoyageur);

  return (
    <>
      {/* Version Mobile & Desktop - Responsive unique */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-8xl mx-auto px-0 sm:px-6 lg:px-8"
      >
        {/* Hero Card - Statut & Profil */}
        <Card className="overflow-hidden">
          {/* Header avec gradient */}
          <div className="bg-primary/5 rounded-t-2xl p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <PropositionStatusBadge statut={proposition.statut} />
              <time className="text-xs sm:text-sm text-gray-500">
                {formatDate(proposition.createdAt)}
              </time>
            </div>

            {/* Profil utilisateur */}
            <div className="flex items-center gap-3 md:gap-4">
              <Avatar
                src={otherUser.photo || undefined}
                fallback={formatFullName(otherUser.nom, otherUser.prenom)}
                size="lg"
                verified={otherUser.emailVerifie}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 truncate">
                  {formatFullName(otherUser.nom, otherUser.prenom)}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">
                  {isReceived ? 'Client' : 'Voyageur'}
                </p>
              </div>
            </div>
          </div>

          {/* Montants clés - Responsive grid */}
          <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              <div className="text-center p-2 sm:p-3 md:p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex justify-center mb-1 sm:mb-2">
                  <Weight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-0.5 sm:mb-1">Poids</p>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-primary">
                  {formatWeight(proposition.demande.poidsEstime)}
                </p>
              </div>

              <div className="text-center p-2 sm:p-3 md:p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex justify-center mb-1 sm:mb-2">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-0.5 sm:mb-1">Prix/kg</p>
                <CurrencyDisplay
                  amount={proposition.prixParKilo}
                  currency={proposition.currency}
                  converted={proposition.converted}
                  viewerCurrency={proposition.viewerCurrency}
                  field="prixParKilo"
                  className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-primary"
                />
              </div>

              <div className="text-center p-2 sm:p-3 md:p-4 bg-success/5 rounded-lg border border-success/20">
                <div className="flex justify-center mb-1 sm:mb-2">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-success" />
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-0.5 sm:mb-1">Commission</p>
                <CurrencyDisplay
                  amount={proposition.commissionProposeePourUnBagage}
                  currency={proposition.currency}
                  converted={proposition.converted}
                  viewerCurrency={proposition.viewerCurrency}
                  field="commission"
                  className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-success"
                />
              </div>
            </div>

            {/* Message de la proposition */}
            {proposition.message && (
              <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3">
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 mb-1">Message</p>
                    <p className="text-xs sm:text-sm md:text-base text-gray-700 break-words leading-relaxed">
                      {proposition.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Message de refus */}
            {isRefused && proposition.messageRefus && (
              <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 md:p-4 bg-error/5 rounded-lg border border-error/20">
                <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3">
                  <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-error flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs md:text-sm font-medium text-error mb-1">Raison du refus</p>
                    <p className="text-xs sm:text-sm md:text-base text-error-dark break-words leading-relaxed">
                      {proposition.messageRefus}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Actions */}
          <CardFooter className="px-4 md:px-6 py-3 sm:py-4 md:py-5 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
              {showActionButtons && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={onRefuse}
                    disabled={isResponding}
                    leftIcon={<XCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                    className="flex-1 text-[13px] sm:text-sm md:text-base truncate"
                  >
                    Refuser
                  </Button>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onAccept}
                    disabled={isResponding}
                    leftIcon={<CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                    className="flex-1 text-[13px] sm:text-sm md:text-base truncate"
                  >
                    {isResponding ? 'Acceptation...' : 'Accepter'}
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="lg"
                onClick={onDelete}
                disabled={isCanceling}
                leftIcon={<Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                className="flex-1 text-[12px] sm:text-sm md:text-base text-error border-error hover:bg-error/5 truncate"
              >
                {isCanceling ? 'Annulation...' : 'Annuler la proposition'}
              </Button>
            </div>
          </CardFooter>

        </Card>

        {/* Voyage & Profil - Grid responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 md:mt-6">
          {/* Voyage */}
          <Card>
            <CardContent className="p-0">
              <div className="p-3 sm:p-4 md:p-5 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">Trajet</h3>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">De</p>
                    <p className="text-xs sm:text-sm md:text-base font-bold text-gray-900 truncate">
                      {proposition.voyage.villeDepart}
                    </p>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Plane className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary rotate-45" />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Vers</p>
                    <p className="text-xs sm:text-sm md:text-base font-bold text-gray-900 truncate">
                      {proposition.voyage.villeArrivee}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600 mt-2 pt-2 border-t border-gray-200">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{formatDate(proposition.voyage.dateDepart)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profil utilisateur */}
          <Card>
            <CardHeader 
              title={isReceived ? 'Client' : 'Voyageur'} 
              className="text-xs sm:text-sm md:text-base"
            />
            <CardContent className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                {/* Avatar desktop */}
                <Avatar
                  src={otherUser.photo || undefined}
                  fallback={formatFullName(otherUser.nom, otherUser.prenom)}
                  size="xl"
                  verified={otherUser.emailVerifie}
                  className="hidden lg:block"
                />

                {/* Avatar mobile */}
                <Avatar
                  src={otherUser.photo || undefined}
                  fallback={formatFullName(otherUser.nom, otherUser.prenom)}
                  size="md"
                  verified={otherUser.emailVerifie}
                  className="block lg:hidden"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-1 truncate">
                    {formatFullName(otherUser.nom, otherUser.prenom)}
                  </h3>
                  {otherUser.bio && (
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {otherUser.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2 pt-3 sm:pt-4 border-t border-gray-200">
                {showContactButton && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={isReceived ? onContactClient : onContactVoyageur}
                    leftIcon={<MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                    className="w-full text-xs sm:text-sm md:text-base"
                  >
                    Contacter {isReceived ? 'le client' : 'le voyageur'}
                  </Button>
                )}
                {otherUser.address && (
                  <div className="flex items-start gap-2 p-2">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5" />
                    <span className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {otherUser.address.ville}
                      {otherUser.address.pays && `, ${otherUser.address.pays}`}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </>
  );
}