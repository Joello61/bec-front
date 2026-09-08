import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/lib/utils/constants';
import type { User } from '@/types';

import BottomNav from '../BottomNav';

const mockUsePathname = vi.fn();
const mockPush = vi.fn();
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

const mockUseAuth = vi.fn();
const mockUseUnreadMessages = vi.fn();
const mockLogout = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAuth: () => mockUseAuth(),
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

describe('BottomNav - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue(ROUTES.EXPLORE);
    mockUseAuth.mockReturnValue({ user: makeUser(), logout: mockLogout });
    mockUseUnreadMessages.mockReturnValue({ unreadCount: 0 });
  });

  it('affiche le badge de messages non lus depuis useUnreadMessages', () => {
    mockUseUnreadMessages.mockReturnValue({ unreadCount: 5 });
    render(<BottomNav />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('ouvre le menu Creer au clic sur le bouton central', async () => {
    const user = userEvent.setup();
    const { container } = render(<BottomNav />);

    expect(screen.queryByText(/gérer mes voyages/i)).not.toBeInTheDocument();
    // Le bouton central n'a pas de nom accessible (icone seule, sans libelle visible) :
    // cible directement via l'icone lucide-plus plutot que par role+name.
    const createButton = container.querySelector('svg.lucide-plus')?.closest('button') as HTMLButtonElement;
    await user.click(createButton);
    expect(screen.getByText(/gérer mes voyages/i)).toBeInTheDocument();
  });

  it('ouvre le menu Compte au clic sur le bouton Compte', async () => {
    const user = userEvent.setup();
    render(<BottomNav />);

    await user.click(screen.getByRole('button', { name: /^compte$/i }));
    expect(screen.getByText(/mon compte/i)).toBeInTheDocument();
  });

  it('deconnecte puis redirige vers Accueil au clic sur Deconnexion', async () => {
    mockLogout.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<BottomNav />);

    await user.click(screen.getByRole('button', { name: /^compte$/i }));
    await user.click(screen.getByText(/déconnexion/i));

    await waitFor(() => expect(mockLogout).toHaveBeenCalledTimes(1));
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.HOME);
  });

  it('marque Explorer actif sur une correspondance exacte', () => {
    mockUsePathname.mockReturnValue(ROUTES.EXPLORE);
    render(<BottomNav />);
    expect(screen.getByText('Explorer')).toHaveClass('text-primary');
  });

  it("ne marque pas Explorer actif sur une autre route", () => {
    mockUsePathname.mockReturnValue(ROUTES.DASHBOARD);
    render(<BottomNav />);
    expect(screen.getByText('Explorer')).not.toHaveClass('text-primary');
  });
});
