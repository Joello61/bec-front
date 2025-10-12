'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Pagination } from '@/components/common';
import { Badge } from '@/components/ui';
import type { AdminLog, PaginationMeta } from '@/types';
import { Shield, User, Plane, Package, Star, MessageSquare } from 'lucide-react';

interface LogsTableProps {
  logs: AdminLog[];
  pagination: PaginationMeta | null;
  onPageChange: (page: number) => void;
}

export default function LogsTable({ logs, pagination, onPageChange }: LogsTableProps) {
  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      ban_user: 'Bannissement utilisateur',
      unban_user: 'Débannissement utilisateur',
      update_roles: 'Modification des rôles',
      delete_user: 'Suppression utilisateur',
      delete_voyage: 'Suppression voyage',
      delete_demande: 'Suppression demande',
      delete_avis: 'Suppression avis',
      delete_message: 'Suppression message',
      delete_all_user_content: 'Suppression tous contenus',
    };
    return labels[action] || action;
  };

  const getActionColor = (action: string) => {
    if (action.includes('delete')) return 'error';
    if (action.includes('ban')) return 'warning';
    if (action.includes('unban')) return 'success';
    return 'default';
  };

  const getTargetIcon = (type: string) => {
    switch (type) {
      case 'user':
        return User;
      case 'voyage':
        return Plane;
      case 'demande':
        return Package;
      case 'avis':
        return Star;
      case 'message':
        return MessageSquare;
      default:
        return Shield;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cible
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Administrateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => {
              const TargetIcon = getTargetIcon(log.targetType);

              return (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  {/* Action */}
                  <td className="px-6 py-4">
                    <Badge variant={getActionColor(log.action)} size="sm">
                      {getActionLabel(log.action)}
                    </Badge>
                  </td>

                  {/* Cible */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <TargetIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {log.targetType} #{log.targetId}
                      </span>
                    </div>
                    {log.details?.email && typeof log.details.email === 'string' && (
                      <p className="text-xs text-gray-500 mt-1">
                        {log.details.email}
                      </p>
                    )}
                  </td>

                  {/* Admin */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-xs">
                          {log.admin.prenom?.charAt(0)}{log.admin.nom?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {log.admin.prenom} {log.admin.nom}
                        </p>
                        <p className="text-xs text-gray-500">{log.admin.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">
                      {format(new Date(log.createdAt), 'dd MMM yyyy', { locale: fr })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(log.createdAt), 'HH:mm:ss', { locale: fr })}
                    </p>
                  </td>

                  {/* IP */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {log.ipAddress}
                    </code>
                  </td>
                </tr>
              );
            })}
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