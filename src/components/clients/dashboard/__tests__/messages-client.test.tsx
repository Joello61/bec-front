import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessagesPageClient from '../messages-client';
import type { User, Conversation } from '@/types';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseAuth = vi.fn();
const mockUseConversations = vi.fn();
const mockRefetch = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAuth: () => mockUseAuth(),
  useConversations: () => mockUseConversations(),
}));

vi.mock('@/components/message', () => ({
  ConversationList: ({ conversations, onConversationClick }: {
    conversations: Conversation[]; onConversationClick: (id: number) => void;
  }) => (
    <div>
      {conversations.map((c) => (
        <button key={c.id} onClick={() => onConversationClick(c.id)}>{`Conversation ${c.id}`}</button>
      ))}
    </div>
  ),
}));

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1, email: 'user@example.com', nom: 'Doe', prenom: 'John', telephone: null,
    photo: null, bio: null, emailVerifie: true, telephoneVerifie: false, roles: ['ROLE_USER'],
    createdAt: '2025-01-01T00:00:00.000Z', isBanned: false, noteAvisMoyen: null, address: null,
    isProfileComplete: true, ...overrides,
  };
}

function makeConversation(overrides: Partial<Conversation> = {}): Conversation {
  return {
    id: 1, participant1: makeUser(), participant2: makeUser({ id: 2 }),
    dernierMessage: undefined, messagesNonLus: 0,
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('messages-client - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche une erreur si aucun utilisateur courant n'est disponible", () => {
    mockUseAuth.mockReturnValue({ user: null });
    mockUseConversations.mockReturnValue({ conversations: [], isLoading: false, error: null, refetch: mockRefetch });
    render(<MessagesPageClient />);
    expect(screen.getByText(/impossible de trouver l'utilisateur courant/i)).toBeInTheDocument();
  });

  it('affiche un etat de chargement', () => {
    mockUseAuth.mockReturnValue({ user: makeUser() });
    mockUseConversations.mockReturnValue({ conversations: [], isLoading: true, error: null, refetch: mockRefetch });
    render(<MessagesPageClient />);
    expect(screen.getByText(/chargement des conversations/i)).toBeInTheDocument();
  });

  it('affiche un etat vide sans conversation', () => {
    mockUseAuth.mockReturnValue({ user: makeUser() });
    mockUseConversations.mockReturnValue({ conversations: [], isLoading: false, error: null, refetch: mockRefetch });
    render(<MessagesPageClient />);
    expect(screen.getByText(/aucune conversation/i)).toBeInTheDocument();
  });

  it('navigue vers le detail de la conversation cliquee', async () => {
    mockUseAuth.mockReturnValue({ user: makeUser() });
    mockUseConversations.mockReturnValue({
      conversations: [makeConversation({ id: 9 })], isLoading: false, error: null, refetch: mockRefetch,
    });
    const user = userEvent.setup();
    render(<MessagesPageClient />);

    await user.click(screen.getByText('Conversation 9'));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('9'));
  });
});
