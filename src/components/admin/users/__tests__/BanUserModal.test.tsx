import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BanUserModal from '../BanUserModal';
import type { User } from '@/types';

const mockBanUser = vi.fn();
const mockUnbanUser = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAdmin: () => ({ banUser: mockBanUser, unbanUser: mockUnbanUser }),
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

describe('BanUserModal - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche la confirmation de debannissement et appelle unbanUser pour un utilisateur banni", async () => {
    mockUnbanUser.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<BanUserModal user={makeUser({ isBanned: true })} onClose={vi.fn()} onSuccess={onSuccess} />);

    expect(screen.getByText(/débannir cet utilisateur/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^débannir$/i }));

    await waitFor(() => expect(mockUnbanUser).toHaveBeenCalledWith(42));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("n'affiche la date de fin que pour un bannissement temporaire", async () => {
    const user = userEvent.setup();
    render(<BanUserModal user={makeUser()} onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.queryByLabelText(/date de fin du bannissement/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: /temporaire/i }));
    expect(screen.getByText(/date de fin du bannissement/i)).toBeInTheDocument();
  });

  it('bloque la soumission si la raison est trop courte', async () => {
    const user = userEvent.setup();
    render(<BanUserModal user={makeUser()} onClose={vi.fn()} onSuccess={vi.fn()} />);

    await user.type(screen.getByPlaceholderText(/expliquez la raison/i), 'court');
    await user.click(screen.getByRole('button', { name: /bannir l'utilisateur/i }));

    expect(await screen.findByText(/raison doit contenir au moins 10 caractères/i)).toBeInTheDocument();
    expect(mockBanUser).not.toHaveBeenCalled();
  });

  it('bannit un utilisateur avec une raison valide et les options par defaut', async () => {
    mockBanUser.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<BanUserModal user={makeUser()} onClose={vi.fn()} onSuccess={onSuccess} />);

    await user.type(screen.getByPlaceholderText(/expliquez la raison/i), 'Comportement inapproprié répété');
    await user.click(screen.getByRole('button', { name: /bannir l'utilisateur/i }));

    await waitFor(() => expect(mockBanUser).toHaveBeenCalledWith(42, expect.objectContaining({
      type: 'permanent',
      reason: 'Comportement inapproprié répété',
      notifyUser: true,
      deleteContent: false,
    })));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('exige une date de fin pour un bannissement temporaire', async () => {
    const user = userEvent.setup();
    render(<BanUserModal user={makeUser()} onClose={vi.fn()} onSuccess={vi.fn()} />);

    await user.click(screen.getByRole('radio', { name: /temporaire/i }));
    await user.type(screen.getByPlaceholderText(/expliquez la raison/i), 'Comportement inapproprié répété');
    await user.click(screen.getByRole('button', { name: /bannir l'utilisateur/i }));

    expect(await screen.findByText(/date de fin est obligatoire/i)).toBeInTheDocument();
    expect(mockBanUser).not.toHaveBeenCalled();
  });
});
