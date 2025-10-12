'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Eye, ShieldCheck, ShieldAlert, Mail, Phone } from 'lucide-react';
import { Pagination } from '@/components/common';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import type { User, PaginationMeta } from '@/types';
import { ROUTES } from '@/lib/utils/constants';

interface UsersTableProps {
  users: User[];
  pagination: PaginationMeta | null;
  onPageChange: (page: number) => void;
}

export default function UsersTable({ users, pagination, onPageChange }: UsersTableProps) {
  const router = useRouter();

  const getRoleBadge = (roles: string[]) => {
    if (roles.includes('ROLE_ADMIN')) {
      return <Badge variant="error" size="sm">Admin</Badge>;
    }
    if (roles.includes('ROLE_MODERATOR')) {
      return <Badge variant="warning" size="sm">Modérateur</Badge>;
    }
    return <Badge variant="default" size="sm">User</Badge>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vérifications
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inscrit le
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user.id}
                className={cn(
                  'hover:bg-gray-50 transition-colors',
                  user.isBanned && 'bg-red-50'
                )}
              >
                {/* Utilisateur */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.prenom} {user.nom}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>

                {/* Rôle */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.roles)}
                </td>

                {/* Statut */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isBanned ? (
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-error" />
                      <span className="text-sm font-medium text-error">Banni</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-success">Actif</span>
                    </div>
                  )}
                </td>

                {/* Vérifications */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded text-xs',
                        user.emailVerifie
                          ? 'bg-success/10 text-success'
                          : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      <Mail className="w-3 h-3" />
                      {user.emailVerifie ? '✓' : '✗'}
                    </div>
                    <div
                      className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded text-xs',
                        user.telephoneVerifie
                          ? 'bg-success/10 text-success'
                          : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      <Phone className="w-3 h-3" />
                      {user.telephoneVerifie ? '✓' : '✗'}
                    </div>
                  </div>
                </td>

                {/* Date inscription */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: fr })}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => router.push(ROUTES.ADMIN_USER_DETAILS(user.id))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Voir
                  </button>
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