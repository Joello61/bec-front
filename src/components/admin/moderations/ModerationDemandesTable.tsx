'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trash2, Eye } from 'lucide-react';
import { Pagination } from '@/components/common';
import { Badge } from '@/components/ui';
import { useRouter } from 'next/navigation';
import type { Demande, PaginationMeta } from '@/types';

interface ModerationDemandesTableProps {
  demandes: Demande[];
  pagination: PaginationMeta | null;
  onPageChange: (page: number) => void;
  onDelete: (demande: Demande) => void;
}

export default function ModerationDemandesTable({
  demandes,
  pagination,
  onPageChange,
  onDelete,
}: ModerationDemandesTableProps) {
  const router = useRouter();

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'en_recherche':
        return <Badge variant="warning">En recherche</Badge>;
      case 'voyageur_trouve':
        return <Badge variant="success">Voyageur trouvé</Badge>;
      case 'annulee':
        return <Badge variant="error">Annulée</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trajet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date limite
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Poids estimé
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {demandes.map((demande) => (
              <tr
                key={demande.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Trajet */}
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {demande.villeDepart} vers {demande.villeArrivee}
                    </p>
                    {demande.description && (
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                        {demande.description}
                      </p>
                    )}
                  </div>
                </td>

                {/* Client */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="text-secondary font-semibold text-xs">
                        {demande.client.prenom?.charAt(0)}
                        {demande.client.nom?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {demande.client.prenom} {demande.client.nom}
                      </p>
                      <p className="text-xs text-gray-500">
                        {demande.client.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Date limite */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {demande.dateLimite ? (
                    <p className="text-sm text-gray-900">
                      {format(new Date(demande.dateLimite), 'dd MMM yyyy', {
                        locale: fr,
                      })}
                    </p>
                  ) : (
                    <span className="text-sm text-gray-400">Non spécifiée</span>
                  )}
                </td>

                {/* Statut */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(demande.statut)}
                </td>

                {/* Poids */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-secondary">
                    {demande.poidsEstime} kg
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/explore/demande/${demande.id}`)
                      }
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Voir le détail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(demande)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
