import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteUserModal from '../DeleteUserModal';
import type { User } from '@/types';

const mockDeleteUser = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAdmin: () => ({ deleteUser: mockDeleteUser }),
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

describe('DeleteUserModal - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exige le texte de confirmation exact incluant l email de l utilisateur cible', async () => {
    const user = userEvent.setup();
    render(<DeleteUserModal user={makeUser()} onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByText('SUPPRIMER user@example.com')).toBeInTheDocument();

    const submit = screen.getByRole('button', { name: /supprimer définitivement/i });
    expect(submit).toBeDisabled();

    await user.type(screen.getByPlaceholderText(/expliquez la raison/i), 'Violation répétée des règles');
    await user.type(screen.getByPlaceholderText(/tapez ici pour confirmer/i), 'SUPPRIMER autre@example.com');
    expect(submit).toBeDisabled();

    await user.clear(screen.getByPlaceholderText(/tapez ici pour confirmer/i));
    await user.type(screen.getByPlaceholderText(/tapez ici pour confirmer/i), 'SUPPRIMER user@example.com');
    expect(submit).toBeEnabled();
  });

  it('desactive le bouton tant que la raison fait moins de 10 caracteres', async () => {
    const user = userEvent.setup();
    render(<DeleteUserModal user={makeUser()} onClose={vi.fn()} onSuccess={vi.fn()} />);

    await user.type(screen.getByPlaceholderText(/expliquez la raison/i), 'court');
    await user.type(screen.getByPlaceholderText(/tapez ici pour confirmer/i), 'SUPPRIMER user@example.com');

    expect(screen.getByRole('button', { name: /supprimer définitivement/i })).toBeDisabled();
  });

  it('appelle deleteUser avec la raison une fois confirme', async () => {
    mockDeleteUser.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<DeleteUserModal user={makeUser()} onClose={vi.fn()} onSuccess={onSuccess} />);

    await user.type(screen.getByPlaceholderText(/expliquez la raison/i), 'Violation répétée des règles');
    await user.type(screen.getByPlaceholderText(/tapez ici pour confirmer/i), 'SUPPRIMER user@example.com');
    await user.click(screen.getByRole('button', { name: /supprimer définitivement/i }));

    await waitFor(() => expect(mockDeleteUser).toHaveBeenCalledWith(42, 'Violation répétée des règles'));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
