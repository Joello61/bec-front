import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { AdminLog } from '@/types';

import LogsTable from '../LogsTable';

function makeLog(overrides: Partial<AdminLog> = {}): AdminLog {
  return {
    id: 1,
    admin: { id: 9, email: 'admin@example.com', nom: 'Admin', prenom: 'Super' },
    action: 'ban_user',
    targetType: 'user',
    targetId: 42,
    details: { email: 'cible@example.com' },
    ipAddress: '127.0.0.1',
    createdAt: '2026-01-05T10:00:00.000Z',
    ...overrides,
  };
}

describe('LogsTable - logique metier', () => {
  it('traduit une action connue en libelle lisible', () => {
    render(<LogsTable logs={[makeLog({ action: 'ban_user' })]} pagination={null} onPageChange={vi.fn()} />);
    expect(screen.getByText('Bannissement utilisateur')).toBeInTheDocument();
  });

  it("retombe sur le code brut de l'action pour une action inconnue", () => {
    render(<LogsTable logs={[makeLog({ action: 'action_future_inconnue' as AdminLog['action'] })]} pagination={null} onPageChange={vi.fn()} />);
    expect(screen.getByText('action_future_inconnue')).toBeInTheDocument();
  });

  it("affiche l'email cible present dans les details du log", () => {
    render(<LogsTable logs={[makeLog({ details: { email: 'cible@example.com' } })]} pagination={null} onPageChange={vi.fn()} />);
    expect(screen.getByText('cible@example.com')).toBeInTheDocument();
  });
});
