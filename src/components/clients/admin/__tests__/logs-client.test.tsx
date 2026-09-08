import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminLogsPageClient from '../logs-client';
import type { AdminLogStats } from '@/types';

const mockFetchLogs = vi.fn();
const mockFetchLogsStats = vi.fn();
const mockExportLogs = vi.fn();
const mockUseAdmin = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAdmin: () => mockUseAdmin(),
}));

function makeStats(overrides: Partial<AdminLogStats> = {}): AdminLogStats {
  return {
    todayActions: 3,
    weekActions: 12,
    monthActions: 40,
    mostActiveAdmins: [],
    mostFrequentActions: [],
    ...overrides,
  };
}

describe('clients/admin/logs-client - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAdmin.mockReturnValue({
      logs: [],
      logsPagination: null,
      logsStats: makeStats(),
      isLoading: false,
      error: null,
      fetchLogs: mockFetchLogs,
      fetchLogsStats: mockFetchLogsStats,
      exportLogs: mockExportLogs,
    });
  });

  it('declenche fetchLogs et fetchLogsStats au montage', () => {
    render(<AdminLogsPageClient />);
    expect(mockFetchLogs).toHaveBeenCalledWith(1, 20, {});
    expect(mockFetchLogsStats).toHaveBeenCalledTimes(1);
  });

  it("n'affiche pas les cartes de statistiques tant qu elles ne sont pas chargees", () => {
    mockUseAdmin.mockReturnValue({
      logs: [], logsPagination: null, logsStats: null, isLoading: false, error: null,
      fetchLogs: mockFetchLogs, fetchLogsStats: mockFetchLogsStats, exportLogs: mockExportLogs,
    });
    render(<AdminLogsPageClient />);
    expect(screen.queryByText(/aujourd'hui/i)).not.toBeInTheDocument();
  });

  it('affiche les statistiques une fois chargees', () => {
    render(<AdminLogsPageClient />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('exporte les logs filtres au format CSV au clic sur Exporter', async () => {
    const blob = new Blob(['a,b,c'], { type: 'text/csv' });
    mockExportLogs.mockResolvedValue(blob);
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    globalThis.URL.revokeObjectURL = vi.fn();

    const user = userEvent.setup();
    render(<AdminLogsPageClient />);

    await user.click(screen.getByRole('button', { name: /exporter csv/i }));

    await waitFor(() => expect(mockExportLogs).toHaveBeenCalledWith({}));
    expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});
