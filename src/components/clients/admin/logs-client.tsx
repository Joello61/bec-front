'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common';
import { Download } from 'lucide-react';
import type { AdminLogFilters } from '@/types';
import { LogFilters, LogsTable } from '@/components/admin';

export default function AdminLogsPageClient() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AdminLogFilters>({});

  const { logs, logsPagination, logsStats, isLoading, error, fetchLogs, fetchLogsStats, exportLogs } = useAdmin();

  useEffect(() => {
    fetchLogs(page, 20, filters);
  }, [page, filters, fetchLogs]);

  useEffect(() => {
    fetchLogsStats();
  }, [fetchLogsStats]);

  const handleExport = async () => {
    try {
      const blob = await exportLogs(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs-admin-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur export:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Logs d&apos;Administration</h1>
          <p className="text-gray-500 mt-1">
            Historique de toutes les actions administratives
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          Exporter CSV
        </button>
      </div>

      {/* Stats */}
      {logsStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Aujourd&apos;hui</p>
            <p className="text-2xl font-bold text-primary">
              {logsStats.todayActions}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Cette semaine</p>
            <p className="text-2xl font-bold text-primary">
              {logsStats.weekActions}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Ce mois</p>
            <p className="text-2xl font-bold text-primary">
              {logsStats.monthActions}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <LogFilters
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters);
          setPage(1);
        }}
      />

      {/* Logs Table */}
      {error ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-error text-lg font-semibold mb-2">Erreur</p>
          <p className="text-gray-600">{error}</p>
        </div>
      ) : isLoading && logs.length === 0 ? (
        <LoadingSpinner text="Chargement des logs..." />
      ) : (
        <LogsTable
          logs={logs}
          pagination={logsPagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}