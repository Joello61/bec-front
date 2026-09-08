import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UpdateRolesModal from '../UpdateRolesModal';
import type { User } from '@/types';

const mockUpdateUserRoles = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAdmin: () => ({ updateUserRoles: mockUpdateUserRoles }),
}));

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 42,
    email: 'user@example.com',
    nom: 'Doe',
    prenom: 'John',
    telephone: null,
    photo: null,
    bio: null,
    emailVerifie: true,
    telephoneVerifie: false,
    roles: ['ROLE_USER'],
    createdAt: new Date().toISOString(),
    isBanned: false,
    noteAvisMoyen: null,
    address: null,
    isProfileComplete: true,
    ...overrides,
  };
}

describe('UpdateRolesModal - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("pre-coche les roles actuels de l'utilisateur", () => {
    render(<UpdateRolesModal user={makeUser({ roles: ['ROLE_USER', 'ROLE_MODERATOR'] })} onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByRole('checkbox', { name: /^utilisateur/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /^modérateur/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /^administrateur/i })).not.toBeChecked();
  });

  it('refuse de retirer ROLE_USER (obligatoire pour tous les utilisateurs)', async () => {
    const user = userEvent.setup();
    render(<UpdateRolesModal user={makeUser({ roles: ['ROLE_USER', 'ROLE_MODERATOR'] })} onClose={vi.fn()} onSuccess={vi.fn()} />);

    await user.click(screen.getByRole('checkbox', { name: /^utilisateur/i }));
    await user.click(screen.getByRole('button', { name: /modifier les rôles/i }));

    expect(await screen.findByText(/role_user est obligatoire/i)).toBeInTheDocument();
    expect(mockUpdateUserRoles).not.toHaveBeenCalled();
  });

  it('refuse la combinaison admin + moderateur simultanee', async () => {
    const user = userEvent.setup();
    render(<UpdateRolesModal user={makeUser({ roles: ['ROLE_USER', 'ROLE_MODERATOR'] })} onClose={vi.fn()} onSuccess={vi.fn()} />);

    await user.click(screen.getByRole('checkbox', { name: /^administrateur/i }));
    await user.click(screen.getByRole('button', { name: /modifier les rôles/i }));

    expect(await screen.findByText(/ne peut pas être admin et modérateur en même temps/i)).toBeInTheDocument();
    expect(mockUpdateUserRoles).not.toHaveBeenCalled();
  });

  it('met a jour les roles avec une combinaison valide', async () => {
    mockUpdateUserRoles.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<UpdateRolesModal user={makeUser()} onClose={vi.fn()} onSuccess={onSuccess} />);

    await user.click(screen.getByRole('checkbox', { name: /^modérateur/i }));
    await user.click(screen.getByRole('button', { name: /modifier les rôles/i }));

    await waitFor(() => expect(mockUpdateUserRoles).toHaveBeenCalledWith(
      42,
      expect.objectContaining({ roles: ['ROLE_USER', 'ROLE_MODERATOR'] })
    ));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
