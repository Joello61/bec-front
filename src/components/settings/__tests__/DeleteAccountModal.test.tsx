import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { User } from '@/types';

import DeleteAccountModal from '../DeleteAccountModal';

const mockUseAuth = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAuth: () => mockUseAuth(),
}));

const mockDeleteAccount = vi.fn();

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
    authProvider: 'local',
    roles: ['ROLE_USER'],
    createdAt: new Date().toISOString(),
    isBanned: false,
    noteAvisMoyen: null,
    address: null,
    isProfileComplete: true,
    ...overrides,
  };
}

describe('DeleteAccountModal - logique metier (Phase 5 RGPD)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: makeUser(), deleteAccount: mockDeleteAccount });
  });

  it('exige le mot de passe pour un compte local : bouton desactive tant que le mot de passe est vide', async () => {
    const user = userEvent.setup();
    render(<DeleteAccountModal onClose={vi.fn()} />);

    expect(screen.getByLabelText(/mot de passe actuel/i)).toBeInTheDocument();
    const submit = screen.getByRole('button', { name: /supprimer mon compte/i });
    expect(submit).toBeDisabled();

    await user.type(screen.getByPlaceholderText(/tapez ici pour confirmer/i), 'SUPPRIMER');
    expect(submit).toBeDisabled();

    await user.type(screen.getByLabelText(/mot de passe actuel/i), 'monMotDePasse');
    expect(submit).toBeEnabled();
  });

  it("n'exige pas de mot de passe pour un compte OAuth pur", async () => {
    mockUseAuth.mockReturnValue({
      user: makeUser({ authProvider: 'google' }),
      deleteAccount: mockDeleteAccount,
    });
    const user = userEvent.setup();
    render(<DeleteAccountModal onClose={vi.fn()} />);

    expect(screen.queryByLabelText(/mot de passe actuel/i)).not.toBeInTheDocument();
    const submit = screen.getByRole('button', { name: /supprimer mon compte/i });
    expect(submit).toBeDisabled();

    await user.type(screen.getByPlaceholderText(/tapez ici pour confirmer/i), 'SUPPRIMER');
    expect(submit).toBeEnabled();
  });

  it('refuse la confirmation si le texte tape ne correspond pas exactement', async () => {
    const user = userEvent.setup();
    render(<DeleteAccountModal onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/mot de passe actuel/i), 'monMotDePasse');
    await user.type(screen.getByPlaceholderText(/tapez ici pour confirmer/i), 'supprimer');

    expect(screen.getByRole('button', { name: /supprimer mon compte/i })).toBeDisabled();
  });

  it('appelle deleteAccount avec le mot de passe pour un compte local puis redirige', async () => {
    mockDeleteAccount.mockResolvedValue(undefined);
    const replaceSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, replace: replaceSpy },
      writable: true,
    });

    const user = userEvent.setup();
    render(<DeleteAccountModal onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/mot de passe actuel/i), 'monMotDePasse');
    await user.type(screen.getByPlaceholderText(/tapez ici pour confirmer/i), 'SUPPRIMER');
    await user.click(screen.getByRole('button', { name: /supprimer mon compte/i }));

    await waitFor(() => expect(mockDeleteAccount).toHaveBeenCalledWith('monMotDePasse'));
    expect(replaceSpy).toHaveBeenCalled();
  });

  it('appelle deleteAccount sans mot de passe pour un compte OAuth', async () => {
    mockUseAuth.mockReturnValue({
      user: makeUser({ authProvider: 'facebook' }),
      deleteAccount: mockDeleteAccount,
    });
    mockDeleteAccount.mockResolvedValue(undefined);
    Object.defineProperty(window, 'location', {
      value: { ...window.location, replace: vi.fn() },
      writable: true,
    });

    const user = userEvent.setup();
    render(<DeleteAccountModal onClose={vi.fn()} />);

    await user.type(screen.getByPlaceholderText(/tapez ici pour confirmer/i), 'SUPPRIMER');
    await user.click(screen.getByRole('button', { name: /supprimer mon compte/i }));

    await waitFor(() => expect(mockDeleteAccount).toHaveBeenCalledWith(undefined));
  });

  it("reactive le formulaire et n'echoue pas silencieusement si la suppression echoue", async () => {
    mockDeleteAccount.mockRejectedValue(new Error('Mot de passe incorrect'));

    const user = userEvent.setup();
    render(<DeleteAccountModal onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/mot de passe actuel/i), 'mauvaisMotDePasse');
    await user.type(screen.getByPlaceholderText(/tapez ici pour confirmer/i), 'SUPPRIMER');
    await user.click(screen.getByRole('button', { name: /supprimer mon compte/i }));

    await waitFor(() => expect(mockDeleteAccount).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByRole('button', { name: /supprimer mon compte/i })).toBeEnabled());
  });

  it('appelle onClose au clic sur Annuler', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<DeleteAccountModal onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: /^annuler$/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
