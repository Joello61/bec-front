'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle } from 'lucide-react';

import { Pagination } from '@/components/common';
import { Badge } from '@/components/ui';
import type { PaginationMeta, Signalement, SignalementStatut } from '@/types';

interface SignalementsTableProps {
  signalements: Signalement[];
  pagination: PaginationMeta | null;
  onPageChange: (page: number) => void;
  onTraiter: (signalement: Signalement) => void;
}

const MOTIF_LABELS: Record<Signalement['motif'], string> = {
  contenu_inapproprie: 'Contenu inapproprié',
  spam: 'Spam ou publicité',
  arnaque: 'Arnaque ou fraude',
  objet_illegal: 'Objet illégal',
  autre: 'Autre',
};

// Meme priorite de detection que SignalementCard.tsx (voyage > demande > message >
// utilisateur signale) - duplique plutot qu'extrait en helper partage, ce composant-la
// n'exportant rien de reutilisable et la logique restant courte.
function getCibleInfo(signalement: Signalement): { type: string; info: string } {
  if (signalement.voyage) {
    return { type: 'Voyage', info: `${signalement.voyage.villeDepart} vers ${signalement.voyage.villeArrivee}` };
  }
  if (signalement.demande) {
    return { type: 'Demande', info: `${signalement.demande.villeDepart} vers ${signalement.demande.villeArrivee}` };
  }
  if (signalement.message) {
    return { type: 'Message', info: 'Message de conversation' };
  }
  if (signalement.utilisateurSignale) {
    return { type: 'Utilisateur', info: `${signalement.utilisateurSignale.prenom} ${signalement.utilisateurSignale.nom}` };
  }
  return { type: 'Inconnu', info: '' };
}

function getStatutBadge(statut: SignalementStatut) {
  switch (statut) {
    case 'en_attente':
      return <Badge variant="warning">En attente</Badge>;
    case 'traite':
      return <Badge variant="success">Traité</Badge>;
    case 'rejete':
      return <Badge variant="error">Rejeté</Badge>;
  }
}

export default function SignalementsTable({
  signalements,
  pagination,
  onPageChange,
  onTraiter,
}: SignalementsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cible
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Signalé par
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Motif
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {signalements.map((signalement) => {
              const cible = getCibleInfo(signalement);

              return (
                <tr key={signalement.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Badge variant="neutral" size="sm">{cible.type}</Badge>
                    {cible.info && (
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">{cible.info}</p>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">
                      {signalement.signaleur.prenom} {signalement.signaleur.nom}
                    </p>
                    <p className="text-xs text-gray-500">{signalement.signaleur.email}</p>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{MOTIF_LABELS[signalement.motif]}</p>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatutBadge(signalement.statut)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">
                      {format(new Date(signalement.createdAt), 'dd MMM yyyy', { locale: fr })}
                    </p>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {signalement.statut === 'en_attente' ? (
                      <button
                        onClick={() => onTraiter(signalement)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Traiter"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Déjà traité</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {signalements.length === 0 && (
          <div className="p-8 text-center text-gray-500">Aucun signalement trouvé.</div>
        )}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
