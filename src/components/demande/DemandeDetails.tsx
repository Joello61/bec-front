'use client';

import { motion } from 'framer-motion';
import { Calendar, Package, MessageCircle, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardContent, Avatar, Button } from '@/components/ui';
import DemandeStatusBadge from './DemandeStatusBadge';
import { formatDate, formatWeight, getDaysRemaining } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import type { Demande } from '@/types';

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
  onContact 
}: DemandeDetailsProps) {
  const daysRemaining = demande.dateLimite ? getDaysRemaining(demande.dateLimite) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Card */}
      <Card>
        <CardHeader
          title={`${demande.villeDepart} → ${demande.villeArrivee}`}
          action={<DemandeStatusBadge statut={demande.statut} />}
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Poids estimé */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Poids estimé</p>
                <p className="font-semibold text-gray-900">{formatWeight(demande.poidsEstime)}</p>
              </div>
            </div>

            {/* Date limite */}
            {demande.dateLimite && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date limite</p>
                  <p className="font-semibold text-gray-900">{formatDate(demande.dateLimite)}</p>
                  {daysRemaining !== null && (
                    <p className={`text-sm mt-1 ${daysRemaining < 3 ? 'text-error font-medium' : 'text-gray-600'}`}>
                      {daysRemaining >= 0 ? `${daysRemaining} jours restants` : 'Expiré'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Créée le */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Créée le</p>
                <p className="font-semibold text-gray-900">{formatDate(demande.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader title="Description de la demande" />
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">{demande.description}</p>
        </CardContent>
      </Card>

      {/* Client Info */}
      <Card>
        <CardHeader title="Client" />
        <CardContent>
          <div className="flex items-center justify-between">
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
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
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
  );
}