import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompleteProfilePageClient from '../complete-profil-client';
import type { User } from '@/types';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseAuth = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAuth: () => mockUseAuth(),
}));

const mockCompleteProfile = vi.fn();

vi.mock('@/components/forms/CompleteProfileForm', () => ({
  default: ({ onSubmit }: { onSubmit: (data: { telephone: string }) => void }) => (
    <button onClick={() => onSubmit({ telephone: '+237612345678' })}>Soumettre le profil (mock)</button>
  ),
}));

vi.mock('@/components/auth/VerificationModal', () => ({
  default: ({ onSuccess }: { onSuccess: () => void }) => (
    <button onClick={onSuccess}>Verification reussie (mock)</button>
  ),
}));

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1, email: 'user@example.com', nom: 'Doe', prenom: 'John', telephone: null,
    photo: null, bio: null, emailVerifie: true, telephoneVerifie: false, roles: ['ROLE_USER'],
    createdAt: '2025-01-01T00:00:00.000Z', isBanned: false, noteAvisMoyen: null, address: null,
    isProfileComplete: false, ...overrides,
  };
}

describe('complete-profil-client - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('redirige vers la connexion si aucun utilisateur n est authentifie', () => {
    mockUseAuth.mockReturnValue({ user: null, completeProfile: mockCompleteProfile });
    render(<CompleteProfilePageClient />);
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('login'));
  });

  it('redirige vers explore si le profil est deja complet', () => {
    mockUseAuth.mockReturnValue({ user: makeUser({ isProfileComplete: true }), completeProfile: mockCompleteProfile });
    render(<CompleteProfilePageClient />);
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('explore'));
  });

  it('affiche la modale de verification SMS quand le backend l exige', async () => {
    mockCompleteProfile.mockResolvedValue({ smsVerificationRequired: true });
    mockUseAuth.mockReturnValue({ user: makeUser(), completeProfile: mockCompleteProfile });
    const user = userEvent.setup();
    render(<CompleteProfilePageClient />);

    await user.click(screen.getByRole('button', { name: /soumettre le profil/i }));

    expect(await screen.findByRole('button', { name: /verification reussie/i })).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalledWith(expect.stringContaining('explore'));
  });

  it('redirige directement vers explore quand la verification SMS n est pas exigee (mode dev)', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockCompleteProfile.mockResolvedValue({ smsVerificationRequired: false });
    mockUseAuth.mockReturnValue({ user: makeUser(), completeProfile: mockCompleteProfile });
    const user = userEvent.setup({ delay: null });
    render(<CompleteProfilePageClient />);

    await user.click(screen.getByRole('button', { name: /soumettre le profil/i }));
    await vi.advanceTimersByTimeAsync(1000);

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('explore'));
    expect(screen.queryByRole('button', { name: /verification reussie/i })).not.toBeInTheDocument();
  });
});
