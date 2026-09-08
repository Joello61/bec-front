import {
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
  Shield,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { Card, CardHeader, CardContent, Avatar, Button } from '@/components/ui';
import DemandeStatusBadge from './DemandeStatusBadge';
import { formatDate, formatWeight } from '@/lib/utils/format';
import type { Demande } from '@/types';
import type { User } from '@/types';
import { FavoriteButton } from '../favori';
import { CurrencyDisplay } from '../common';

interface DemandeDetailsDesktopProps {
  demande: Demande;
  user: User | null;
  isOwner: boolean;
  isFavorite: boolean;
  isExpired: boolean;
  isUrgent: boolean;
  daysRemaining: number | null;
  showContactButton: boolean;
  onToggleFavorite: () => Promise<void>;
  onOpenSignalement: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onContact?: () => void;
}

export default function DemandeDetailsDesktop({
  demande,
  user,
  isOwner,
  isFavorite,
  isExpired,
  isUrgent,
  daysRemaining,
  showContactButton,
  onToggleFavorite,
  onOpenSignalement,
  onEdit,
  onDelete,
  onContact,
}: DemandeDetailsDesktopProps) {
  return (
    <div className="hidden lg:block">
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
                  {isUrgent && daysRemaining !== null && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-bold text-red-700">
                        {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
                {user && !isOwner && (
                  <div className="flex items-center gap-3">
                    {!isExpired && (
                      <FavoriteButton
                        isFavorite={isFavorite}
                        onToggle={onToggleFavorite}
                        size="lg"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Flag className="w-4 h-4" />}
                      onClick={onOpenSignalement}
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
                    {demande.client.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 truncate">{demande.client.email}</span>
                      </div>
                    )}
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
            {isUrgent && daysRemaining !== null && (
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
                        Cette demande expire dans {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}.
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
    </div>
  );
}
