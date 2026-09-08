import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { User } from '@/types';
import type { DashboardData } from '@/types/dashboard';

import ProfilePageClient from '../profile-client';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseAuth = vi.fn();
const mockUseAddress = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAuth: () => mockUseAuth(),
  useAddress: () => mockUseAddress(),
}));

const mockDashboard = vi.fn();
const mockUpdateMe = vi.fn();
vi.mock('@/lib/api/users', () => ({
  usersApi: {
    dashboard: () => mockDashboard(),
    updateMe: (data: unknown) => mockUpdateMe(data),
  },
}));

const mockUseAvatar = vi.fn();
vi.mock('@/lib/hooks/useUsers', () => ({
  useAvatar: () => mockUseAvatar(),
}));

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'user@example.com',
    nom: 'Doe',
    prenom: 'John',
    telephone: '+237612345678',
    photo: null,
    bio: null,
    emailVerifie: true,
    telephoneVerifie: true,
    authProvider: 'local',
    roles: ['ROLE_USER'],
    createdAt: '2025-01-01T00:00:00.000Z',
    isBanned: false,
    noteAvisMoyen: null,
    address: null,
    isProfileComplete: true,
    ...overrides,
  };
}

function makeDashboard(overrides: Partial<DashboardData> = {}): DashboardData {
  return {
    summary: {} as DashboardData['summary'],
    voyages: { total: 3, actifs: 1, recents: [] },
    demandes: { total: 2, enCours: 1, recentes: [] },
    notifications: { nonLues: 0, recentes: [] },
    messages: { nonLus: 0, recents: [] },
    stats: {
      voyagesEffectues: 3,
      bagagesTransportes: 0,
      noteMoyenne: 4.5,
      nombreAvis: 2,
      repartitionNotes: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 },
    },
    ...overrides,
  } as DashboardData;
}

describe('profile-client - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAddress.mockReturnValue({ modificationInfo: { canModify: true } });
    mockUseAvatar.mockReturnValue({
      uploadAvatar: vi.fn(),
      deleteAvatar: vi.fn(),
      isUploading: false,
      error: null,
      clearError: vi.fn(),
      currentAvatar: null,
    });
    mockDashboard.mockResolvedValue(makeDashboard());
  });

  it('affiche un etat de chargement puis les informations du profil', async () => {
    mockUseAuth.mockReturnValue({ user: makeUser(), fetchMe: vi.fn() });

    render(<ProfilePageClient />);

    expect(screen.getByText(/chargement du profil/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /mon profil/i })).toBeInTheDocument();
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  it("affiche l'etat d'erreur avec un bouton de nouvel essai si le dashboard echoue", async () => {
    mockUseAuth.mockReturnValue({ user: makeUser(), fetchMe: vi.fn() });
    mockDashboard.mockRejectedValueOnce(new Error('Erreur reseau'));

    render(<ProfilePageClient />);

    await waitFor(() => {
      expect(screen.getByText(/erreur reseau/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /réessayer|retry/i })).toBeInTheDocument();
  });

  it("bascule vers le formulaire d'edition au clic sur Modifier puis revient a la vue en lecture au clic sur Annuler", async () => {
    mockUseAuth.mockReturnValue({ user: makeUser(), fetchMe: vi.fn() });
    const user = userEvent.setup();

    render(<ProfilePageClient />);
    await waitFor(() => screen.getByRole('heading', { name: /mon profil/i }));

    await user.click(screen.getByRole('button', { name: /^modifier$/i }));
    expect(screen.getByRole('button', { name: /enregistrer/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^annuler$/i }));
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /enregistrer/i })).not.toBeInTheDocument();
  });

  it('affiche un message specifique OAuth au lieu du bouton changer le mot de passe', async () => {
    mockUseAuth.mockReturnValue({
      user: makeUser({ authProvider: 'google' }),
      fetchMe: vi.fn(),
    });

    render(<ProfilePageClient />);
    await waitFor(() => screen.getByRole('heading', { name: /mon profil/i }));

    expect(screen.getByText(/compte google/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /changer le mot de passe/i })).not.toBeInTheDocument();
  });

  it('affiche le bouton changer le mot de passe pour un compte local', async () => {
    mockUseAuth.mockReturnValue({ user: makeUser({ authProvider: 'local' }), fetchMe: vi.fn() });

    render(<ProfilePageClient />);
    await waitFor(() => screen.getByRole('heading', { name: /mon profil/i }));

    expect(screen.getByRole('button', { name: /changer le mot de passe/i })).toBeInTheDocument();
  });

  it('affiche les statistiques renvoyees par le dashboard', async () => {
    mockUseAuth.mockReturnValue({ user: makeUser(), fetchMe: vi.fn() });
    mockDashboard.mockResolvedValue(makeDashboard({
      voyages: { total: 7, actifs: 2, recents: [] },
      demandes: { total: 4, enCours: 1, recentes: [] },
    }));

    render(<ProfilePageClient />);
    await waitFor(() => screen.getByRole('heading', { name: /mon profil/i }));

    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it("n'affiche pas la section adresse quand l'utilisateur n'a pas d'adresse", async () => {
    mockUseAuth.mockReturnValue({ user: makeUser({ address: null }), fetchMe: vi.fn() });

    render(<ProfilePageClient />);
    await waitFor(() => screen.getByRole('heading', { name: /mon profil/i }));

    expect(screen.queryByText(/mon adresse/i)).not.toBeInTheDocument();
  });
});
