'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trash2, Eye, ArrowRight } from 'lucide-react';
import { Pagination } from '@/components/common';
import { Badge } from '@/components/ui';
import { useRouter } from 'next/navigation';
import type { Voyage, PaginationMeta } from '@/types';

interface ModerationVoyagesTableProps {
  voyages: Voyage[];
  pagination: PaginationMeta | null;
  onPageChange: (page: number) => void;
  onDelete: (voyage: Voyage) => void;
}

export default function ModerationVoyagesTable({
  voyages,
  pagination,
  onPageChange,
  onDelete,
}: ModerationVoyagesTableProps) {
  const router = useRouter();

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'actif':
        return <Badge variant="success">Actif</Badge>;
      case 'en_cours':
        return <Badge variant="warning">En cours</Badge>;
      case 'complete':
        return <Badge variant="default">Complété</Badge>;
      case 'annule':
        return <Badge variant="error">Annulé</Badge>;
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
                Voyageur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Poids dispo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {voyages.map((voyage) => (
              <tr
                key={voyage.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Trajet */}
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {voyage.villeDepart} vers {voyage.villeArrivee}
                    </p>
                    {voyage.description && (
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                        {voyage.description}
                      </p>
                    )}
                  </div>
                </td>

                {/* Voyageur */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-xs">
                        {voyage.voyageur.prenom?.charAt(0)}
                        {voyage.voyageur.nom?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {voyage.voyageur.prenom} {voyage.voyageur.nom}
                      </p>
                      <p className="text-xs text-gray-500">
                        {voyage.voyageur.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Dates */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-900">
                    {format(new Date(voyage.dateDepart), 'dd MMM yyyy', {
                      locale: fr,
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    <ArrowRight className="w-4 h-4 ml-1" />{' '}
                    {format(new Date(voyage.dateArrivee), 'dd MMM yyyy', {
                      locale: fr,
                    })}
                  </p>
                </td>

                {/* Statut */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(voyage.statut)}
                </td>

                {/* Poids */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-primary">
                    {voyage.poidsDisponible} kg
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/explore/voyage/${voyage.id}`)
                      }
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Voir le détail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(voyage)}
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
