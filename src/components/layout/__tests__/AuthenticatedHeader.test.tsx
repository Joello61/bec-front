import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/lib/utils/constants';
import type { User } from '@/types';

import AuthenticatedHeader from '../AuthenticatedHeader';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseAuth = vi.fn();
const mockUseUnreadNotificationCount = vi.fn();
const mockUseUnreadMessages = vi.fn();
const mockLogout = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAuth: () => mockUseAuth(),
  useUnreadNotificationCount: () => mockUseUnreadNotificationCount(),
  useUnreadMessages: () => mockUseUnreadMessages(),
}));

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1, email: 'user@example.com', nom: 'Doe', prenom: 'John', telephone: null,
    photo: null, bio: null, emailVerifie: true, telephoneVerifie: false, roles: ['ROLE_USER'],
    createdAt: '2025-01-01T00:00:00.000Z', isBanned: false, noteAvisMoyen: null, address: null,
    isProfileComplete: true, ...overrides,
  };
}

describe('AuthenticatedHeader - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: makeUser(), logout: mockLogout });
    mockUseUnreadNotificationCount.mockReturnValue({ unreadCount: 0 });
    mockUseUnreadMessages.mockReturnValue({ unreadCount: 0 });
  });

  it("n'affiche pas de badge de notification sans notification non lue", () => {
    render(<AuthenticatedHeader />);
    const bell = screen.getByLabelText(/^notifications$/i);
    expect(bell.querySelector('span')).not.toBeInTheDocument();
  });

  it('plafonne le badge de notifications a "9+" au-dela de 9', () => {
    mockUseUnreadNotificationCount.mockReturnValue({ unreadCount: 12 });
    render(<AuthenticatedHeader />);
    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it('affiche le compte exact de messages non lus sous 10', () => {
    mockUseUnreadMessages.mockReturnValue({ unreadCount: 4 });
    render(<AuthenticatedHeader />);
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('navigue vers Parametres au clic sur l item du menu utilisateur', async () => {
    const user = userEvent.setup();
    render(<AuthenticatedHeader />);

    await user.click(screen.getByLabelText(/menu utilisateur/i));
    await user.click(await screen.findByText(/paramètres/i));

    expect(mockPush).toHaveBeenCalledWith(ROUTES.SETTINGS);
  });

  it("redirige vers l'accueil apres deconnexion reussie", async () => {
    mockLogout.mockResolvedValue(undefined);
    const replaceSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, replace: replaceSpy },
      writable: true,
    });
    const user = userEvent.setup();
    render(<AuthenticatedHeader />);

    await user.click(screen.getByLabelText(/menu utilisateur/i));
    await user.click(await screen.findByText(/déconnexion/i));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
