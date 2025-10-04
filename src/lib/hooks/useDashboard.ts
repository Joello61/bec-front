import { useState, useEffect } from 'react';
import { usersApi } from '@/lib/api/users';
import type { DashboardData } from '@/types';

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dashboardData = await usersApi.dashboard();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    data,
    isLoading,
    error,
    refresh: fetchDashboard,
  };
}