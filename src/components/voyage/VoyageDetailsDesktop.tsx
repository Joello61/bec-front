import {
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
  Shield,
} from 'lucide-react';
import { Card, CardHeader, CardContent, Avatar, Button } from '@/components/ui';
import VoyageStatusBadge from './VoyageStatusBadge';
import { formatDate, formatWeight } from '@/lib/utils/format';
import type { Voyage } from '@/types';
import type { User } from '@/types';
import { FavoriteButton } from '../favori';
import { CurrencyDisplay } from '../common';

interface VoyageDetailsDesktopProps {
  voyage: Voyage;
  user: User | null;
  isOwner: boolean;
  isFavorite: boolean;
  isExpired: boolean;
  canLeaveReview: boolean;
  showContactButton: boolean;
  onToggleFavorite: () => Promise<void>;
  onOpenSignalement: () => void;
  onOpenAvis: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onContact?: () => void;
}

export default function VoyageDetailsDesktop({
  voyage,
  user,
  isOwner,
  isFavorite,
  isExpired,
  canLeaveReview,
  showContactButton,
  onToggleFavorite,
  onOpenSignalement,
  onOpenAvis,
  onEdit,
  onDelete,
  onContact,
}: VoyageDetailsDesktopProps) {
  return (
    <div className="hidden lg:block">
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
                    {voyage.voyageur.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 truncate">{voyage.voyageur.email}</span>
                      </div>
                    )}
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
                        onClick={onOpenAvis}
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
    </div>
  );
}
