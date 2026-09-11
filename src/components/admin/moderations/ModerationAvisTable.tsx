'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';

import { StarRating } from '@/components/avis';
import { Pagination } from '@/components/common';
import type { Avis, PaginationMeta } from '@/types';

interface ModerationAvisTableProps {
  avisList: Avis[];
  pagination: PaginationMeta | null;
  onPageChange: (page: number) => void;
  onDelete: (avis: Avis) => void;
}

export default function ModerationAvisTable({
  avisList,
  pagination,
  onPageChange,
  onDelete,
}: ModerationAvisTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Auteur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cible
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Note
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commentaire
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
            {avisList.map((avis) => (
              <tr key={avis.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm font-medium text-gray-900">
                    {avis.auteur.prenom} {avis.auteur.nom}
                  </p>
                  <p className="text-xs text-gray-500">{avis.auteur.email}</p>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm font-medium text-gray-900">
                    {avis.cible.prenom} {avis.cible.nom}
                  </p>
                  <p className="text-xs text-gray-500">{avis.cible.email}</p>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <StarRating rating={avis.note} size="sm" />
                </td>

                <td className="px-6 py-4 max-w-xs">
                  <p className="text-sm text-gray-600 truncate">
                    {avis.commentaire || <span className="italic text-gray-400">Aucun commentaire</span>}
                  </p>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-900">
                    {format(new Date(avis.createdAt), 'dd MMM yyyy', { locale: fr })}
                  </p>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => onDelete(avis)}
                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {avisList.length === 0 && (
          <div className="p-8 text-center text-gray-500">Aucun avis trouvé.</div>
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
