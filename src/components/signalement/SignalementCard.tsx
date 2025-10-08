'use client';

import { Flag, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, Badge } from '@/components/ui';
import type { Signalement, SignalementStatut } from '@/types';

interface SignalementCardProps {
  signalement: Signalement;
}

export default function SignalementCard({ signalement }: SignalementCardProps) {
  const getStatutConfig = () => {
    const configs: Record<SignalementStatut, { 
      variant: 'success' | 'warning' | 'error'; 
      label: string; 
      icon: typeof Clock;
    }> = {
      en_attente: { 
        variant: 'warning', 
        label: 'En attente', 
        icon: Clock 
      },
      traite: { 
        variant: 'success', 
        label: 'Traité', 
        icon: CheckCircle 
      },
      rejete: { 
        variant: 'error', 
        label: 'Rejeté', 
        icon: XCircle 
      },
    };
    return configs[signalement.statut];
  };

  const getMotifLabel = () => {
    const motifs = {
      contenu_inapproprie: 'Contenu inapproprié',
      spam: 'Spam ou publicité',
      arnaque: 'Arnaque ou fraude',
      objet_illegal: 'Objet illégal',
      autre: 'Autre',
    };
    return motifs[signalement.motif];
  };

  const getEntityInfo = () => {
    if (signalement.voyage) {
      return { 
        type: 'Voyage', 
        info: `${signalement.voyage.villeDepart} → ${signalement.voyage.villeArrivee}`,
        color: 'text-primary'
      };
    }
    if (signalement.demande) {
      return { 
        type: 'Demande', 
        info: `${signalement.demande.villeDepart} → ${signalement.demande.villeArrivee}`,
        color: 'text-accent'
      };
    }
    if (signalement.message) {
      return { 
        type: 'Message', 
        info: 'Message de conversation',
        color: 'text-blue-600'
      };
    }
    if (signalement.utilisateurSignale) {
      return { 
        type: 'Utilisateur', 
        info: `${signalement.utilisateurSignale.prenom} ${signalement.utilisateurSignale.nom}`,
        color: 'text-purple-600'
      };
    }
    return { type: 'Inconnu', info: '', color: 'text-gray-600' };
  };

  const statutConfig = getStatutConfig();
  const StatutIcon = statutConfig.icon;
  const entity = getEntityInfo();

  return (
    <Card variant="default" hoverable>
      <CardContent className="p-4 sm:p-5">
        {/* Header avec type d'entité et statut */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            {/* Type et info de l'entité */}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="neutral" size="sm">
                {entity.type}
              </Badge>
              <span className={`text-sm font-medium truncate ${entity.color}`}>
                {entity.info}
              </span>
            </div>

            {/* Motif */}
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-900">
                {getMotifLabel()}
              </span>
            </div>
          </div>

          {/* Badge de statut */}
          <Badge 
            variant={statutConfig.variant} 
            size="md"
            className="flex items-center gap-1.5 flex-shrink-0"
          >
            <StatutIcon className="w-3.5 h-3.5" />
            {statutConfig.label}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {signalement.description}
        </p>

        {/* Réponse admin si existe */}
        {signalement.reponseAdmin && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-900 mb-1">
                  Réponse de l&apos;équipe CoBage :
                </p>
                <p className="text-sm text-blue-800">
                  {signalement.reponseAdmin}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer avec date */}
      <CardFooter className="px-4 sm:px-5 py-3">
        <div className="flex items-center justify-between w-full text-xs text-gray-500">
          <span>
            Signalé le {new Date(signalement.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
          {signalement.updatedAt !== signalement.createdAt && (
            <span className="text-gray-400">
              Mis à jour le {new Date(signalement.updatedAt).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}