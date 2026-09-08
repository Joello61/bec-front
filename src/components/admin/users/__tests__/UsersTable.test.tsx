import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { PaginationMeta, User } from '@/types';

import UsersTable from '../UsersTable';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

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

describe('UsersTable - logique metier', () => {
  it('affiche le badge Admin pour un utilisateur avec ROLE_ADMIN, priorite sur ROLE_MODERATOR', () => {
    render(
      <UsersTable
        users={[makeUser({ roles: ['ROLE_USER', 'ROLE_MODERATOR', 'ROLE_ADMIN'] })]}
        pagination={null}
        onPageChange={vi.fn()}
      />
    );
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.queryByText('Modérateur')).not.toBeInTheDocument();
  });

  it('affiche le statut Banni pour un utilisateur banni', () => {
    render(
      <UsersTable users={[makeUser({ isBanned: true })]} pagination={null} onPageChange={vi.fn()} />
    );
    expect(screen.getByText('Banni')).toBeInTheDocument();
    expect(screen.queryByText('Actif')).not.toBeInTheDocument();
  });

  it("navigue vers le detail utilisateur au clic sur Voir", async () => {
    const user = userEvent.setup();
    render(<UsersTable users={[makeUser({ id: 7 })]} pagination={null} onPageChange={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /voir/i }));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('7'));
  });

  it("n'affiche pas la pagination pour une seule page", () => {
    const pagination: PaginationMeta = { page: 1, pages: 1, total: 2, limit: 20 };
    render(<UsersTable users={[makeUser()]} pagination={pagination} onPageChange={vi.fn()} />);
    expect(screen.queryByLabelText(/page précédente/i)).not.toBeInTheDocument();
  });

  it('affiche la pagination et relaie le changement de page', async () => {
    const onPageChange = vi.fn();
    const pagination: PaginationMeta = { page: 1, pages: 3, total: 50, limit: 20 };
    const user = userEvent.setup();
    render(<UsersTable users={[makeUser()]} pagination={pagination} onPageChange={onPageChange} />);

    const pageTwoButtons = screen.getAllByRole('button', { name: '2' });
    await user.click(pageTwoButtons[0]);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
