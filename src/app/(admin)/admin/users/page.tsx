'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common';
import { Search } from 'lucide-react';
import { UsersTable } from '@/components/admin';
import { Select } from '@/components/ui';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [bannedFilter, setBannedFilter] = useState<string>('');

  const { users, usersPagination, isLoading, error, fetchUsers } = useAdmin();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {};
    if (roleFilter) filters.role = roleFilter;
    if (bannedFilter) filters.banned = bannedFilter === 'true';
    if (search) filters.search = search;

    fetchUsers(page, 20, filters);
  }, [page, roleFilter, bannedFilter, search, fetchUsers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-500 mt-1">
            {usersPagination?.total || 0} utilisateurs au total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <Select
            options={[
              { value: '', label: 'Tous les rôles' },
              { value: 'ROLE_USER', label: 'Utilisateurs' },
              { value: 'ROLE_MODERATOR', label: 'Modérateurs' },
              { value: 'ROLE_ADMIN', label: 'Administrateurs' }
            ]}
            value={roleFilter}
            onChange={(value) => {
              setRoleFilter(value);
              setPage(1);
            }}
            searchable={false}
          />

          {/* Banned Filter */}
          <Select
            options={[
              { value: '', label: 'Tous les statuts' },
              { value: 'false', label: 'Actifs' },
              { value: 'true', label: 'Bannis' }
            ]}
            value={bannedFilter}
            onChange={(value) => {
              setBannedFilter(value);
              setPage(1);
            }}
            searchable={false}
          />

          {/* Reset */}
          <button
            onClick={() => {
              setSearch('');
              setRoleFilter('');
              setBannedFilter('');
              setPage(1);
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Users Table */}
      {error ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-error text-lg font-semibold mb-2">Erreur</p>
          <p className="text-gray-600">{error}</p>
        </div>
      ) : isLoading && users.length === 0 ? (
        <LoadingSpinner text="Chargement des utilisateurs..." />
      ) : (
        <UsersTable
          users={users}
          pagination={usersPagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}