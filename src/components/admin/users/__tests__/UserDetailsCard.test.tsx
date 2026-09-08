import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserDetailsCard from '../UserDetailsCard';
import type { User, AdminUserActivity, AdminLog } from '@/types';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'user@example.com',
    nom: 'Doe',
    prenom: 'John',
    telephone: null,
    photo: null,
    bio: null,
    emailVerifie: true,
    telephoneVerifie: false,
    roles: ['ROLE_USER'],
    createdAt: '2025-01-01T00:00:00.000Z',
    isBanned: false,
    noteAvisMoyen: null,
    address: null,
    isProfileComplete: true,
    ...overrides,
  };
}

function makeActivity(overrides: Partial<AdminUserActivity> = {}): AdminUserActivity {
  return {
    voyages: [],
    demandes: [],
    messagesCount: 5,
    avisCount: 2,
    signalements: 0,
    lastLogin: null,
    accountAge: 30,
    ...overrides,
  };
}

function makeLog(overrides: Partial<AdminLog> = {}): AdminLog {
  return {
    id: 1,
    admin: { id: 9, email: 'admin@example.com', nom: 'Admin', prenom: 'Super' },
    action: 'ban_user',
    targetType: 'user',
    targetId: 1,
    details: null,
    ipAddress: '127.0.0.1',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('UserDetailsCard - logique metier', () => {
  it("propose Bannir pour un utilisateur actif et Debannir pour un utilisateur banni", () => {
    const { rerender } = render(
      <UserDetailsCard user={makeUser({ isBanned: false })} activity={null} adminLogs={[]} onBan={vi.fn()} onUpdateRoles={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: /^bannir$/i })).toBeInTheDocument();

    rerender(
      <UserDetailsCard user={makeUser({ isBanned: true, bannedAt: '2026-01-01T00:00:00.000Z', banReason: 'Fraude' })} activity={null} adminLogs={[]} onBan={vi.fn()} onUpdateRoles={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: /débannir/i })).toBeInTheDocument();
  });

  it("affiche les informations de bannissement uniquement pour un utilisateur banni avec date", () => {
    render(
      <UserDetailsCard
        user={makeUser({ isBanned: true, bannedAt: '2026-01-01T00:00:00.000Z', banReason: 'Contenu frauduleux' })}
        activity={null}
        adminLogs={[]}
        onBan={vi.fn()}
        onUpdateRoles={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText(/contenu frauduleux/i)).toBeInTheDocument();
  });

  it("n'affiche pas la section activite quand activity est null", () => {
    render(<UserDetailsCard user={makeUser()} activity={null} adminLogs={[]} onBan={vi.fn()} onUpdateRoles={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.queryByText(/activité de l'utilisateur/i)).not.toBeInTheDocument();
  });

  it('affiche les compteurs d activite quand activity est fourni', () => {
    render(
      <UserDetailsCard
        user={makeUser()}
        activity={makeActivity({ messagesCount: 12, avisCount: 4 })}
        adminLogs={[]}
        onBan={vi.fn()}
        onUpdateRoles={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it("n'affiche que les 5 premiers logs administratifs", () => {
    const logs = Array.from({ length: 8 }, (_, i) => makeLog({ id: i + 1, action: `action_${i + 1}` }));
    render(<UserDetailsCard user={makeUser()} activity={null} adminLogs={logs} onBan={vi.fn()} onUpdateRoles={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(/historique administratif \(8\)/i)).toBeInTheDocument();
    expect(screen.getByText('action_1')).toBeInTheDocument();
    expect(screen.getByText('action_5')).toBeInTheDocument();
    expect(screen.queryByText('action_6')).not.toBeInTheDocument();
  });

  it('appelle les callbacks appropries au clic sur chaque action', async () => {
    const onBan = vi.fn();
    const onUpdateRoles = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<UserDetailsCard user={makeUser()} activity={null} adminLogs={[]} onBan={onBan} onUpdateRoles={onUpdateRoles} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: /modifier les rôles/i }));
    await user.click(screen.getByRole('button', { name: /^bannir$/i }));
    await user.click(screen.getByRole('button', { name: /supprimer le compte/i }));

    expect(onUpdateRoles).toHaveBeenCalledTimes(1);
    expect(onBan).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
