'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, Avatar, Badge, Button } from '@/components/ui';
import { formatDate, formatStatus } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import type { Signalement } from '@/types';

interface SignalementCardProps {
  signalement: Signalement;
  onProcess?: (id: number, statut: 'traite' | 'rejete', reponse?: string) => void;
  isAdmin?: boolean;
}

export default function SignalementCard({ signalement, onProcess, isAdmin }: SignalementCardProps) {
  const statutIcons = {
    en_attente: <AlertCircle className="w-5 h-5 text-warning" />,
    traite: <CheckCircle className="w-5 h-5 text-success" />,
    rejete: <XCircle className="w-5 h-5 text-error" />,
  };

  const statutVariants = {
    en_attente: 'warning' as const,
    traite: 'success' as const,
    rejete: 'error' as const,
  };

  const motifLabels: Record<string, string> = {
    contenu_inapproprie: 'Contenu inapproprié',
    spam: 'Spam',
    arnaque: 'Arnaque',
    objet_illegal: 'Objet illégal',
    autre: 'Autre',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                signalement.statut === 'en_attente' 
                  ? 'bg-warning/10' 
                  : signalement.statut === 'traite' 
                  ? 'bg-success/10' 
                  : 'bg-error/10'
              }`}>
                {statutIcons[signalement.statut]}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {motifLabels[signalement.motif]}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(signalement.createdAt)}
                </p>
              </div>
            </div>
            <Badge variant={statutVariants[signalement.statut]} size="sm">
              {formatStatus(signalement.statut)}
            </Badge>
          </div>

          {/* Signaleur */}
          <Link
            href={ROUTES.USER_PROFILE(signalement.signaleur.id)}
            className="flex items-center gap-2 mb-3 group"
          >
            <Avatar
              src={signalement.signaleur.photo || undefined}
              fallback={`${signalement.signaleur.nom} ${signalement.signaleur.prenom}`}
              size="sm"
            />
            <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">
              Signalé par {signalement.signaleur.prenom} {signalement.signaleur.nom}
            </span>
          </Link>

          {/* Description */}
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{signalement.description}</p>
          </div>

          {/* Lien vers contenu */}
          {signalement.voyage && (
            <Link
              href={ROUTES.SEARCH_VOYAGE_DETAILS(signalement.voyage.id)}
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Voir le voyage signalé →
            </Link>
          )}
          {signalement.demande && (
            <Link
              href={ROUTES.SEARCH_DEMANDE_DETAILS(signalement.demande.id)}
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Voir la demande signalée →
            </Link>
          )}

          {/* Réponse admin */}
          {signalement.reponseAdmin && (
            <div className="mt-3 p-3 bg-info/10 rounded-lg border border-info/20">
              <p className="text-xs font-medium text-info mb-1">Réponse de l&apos;administrateur</p>
              <p className="text-sm text-gray-700">{signalement.reponseAdmin}</p>
            </div>
          )}

          {/* Actions Admin */}
          {isAdmin && signalement.statut === 'en_attente' && onProcess && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const reponse = prompt('Raison du rejet (optionnel):');
                  onProcess(signalement.id, 'rejete', reponse || undefined);
                }}
                className="flex-1"
              >
                Rejeter
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const reponse = prompt('Mesures prises (optionnel):');
                  onProcess(signalement.id, 'traite', reponse || undefined);
                }}
                className="flex-1"
              >
                Traiter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}