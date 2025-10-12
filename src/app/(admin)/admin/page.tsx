'use client';

import { useEffect } from 'react';
import { useAdmin } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/common';
import { AdminActivityChart, AdminQuickActions, AdminStatsCards } from '@/components/admin';

export default function AdminDashboardPage() {
  const { dashboardData, isLoading, error, fetchDashboard } = useAdmin();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  console.log('Dashboard Data:', dashboardData);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  if (isLoading && !dashboardData) {
    return <LoadingSpinner fullScreen text="Chargement du dashboard admin..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-error text-lg font-semibold mb-2">Erreur</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Administration
          </h1>
          <p className="text-gray-500 mt-1">
            Vue d&apos;ensemble de la plateforme
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <AdminQuickActions />

      {/* Stats Cards */}
      <AdminStatsCards
        users={dashboardData.users}
        voyages={dashboardData.voyages}
        demandes={dashboardData.demandes}
        signalements={dashboardData.signalements}
      />

      {/* Activity Chart */}
      <AdminActivityChart activity={dashboardData.activity} />

      {/* Engagement Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Statistiques d&apos;engagement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {dashboardData.engagement.totalAvis}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total avis</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {dashboardData.engagement.totalMessages}
            </div>
            <div className="text-sm text-gray-600 mt-1">Messages envoyés</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {dashboardData.engagement.totalConversations}
            </div>
            <div className="text-sm text-gray-600 mt-1">Conversations</div>
          </div>
        </div>
      </div>
    </div>
  );
}