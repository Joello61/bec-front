import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ConversationDetail, Message, User } from '@/types';

import ConversationPageClient from '../conversation-client';

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '5' }),
}));

const mockUseAuth = vi.fn();
const mockUseConversation = vi.fn();
const mockSendMessage = vi.fn();
const mockRefetch = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAuth: () => mockUseAuth(),
  useConversation: () => mockUseConversation(),
}));

vi.mock('@/components/message', () => ({
  ChatBox: ({ recipient, onSendMessage }: { recipient: User; onSendMessage: (content: string) => void }) => (
    <div>
      <span>{`Destinataire: ${recipient.prenom} ${recipient.nom}`}</span>
      <button onClick={() => onSendMessage('Salut')}>Envoyer</button>
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

function makeConversation(overrides: Partial<ConversationDetail> = {}): ConversationDetail {
  return {
    id: 5,
    participant1: makeUser({ id: 1, prenom: 'Alice', nom: 'Martin' }),
    participant2: makeUser({ id: 2, prenom: 'Bob', nom: 'Durand' }),
    messages: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('conversation-client - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseConversation.mockReturnValue({
      conversation: makeConversation(), messages: [] as Message[], isLoading: false, error: null,
      sendMessage: mockSendMessage, refetch: mockRefetch,
    });
  });

  it('affiche un etat de chargement', () => {
    mockUseAuth.mockReturnValue({ user: makeUser() });
    mockUseConversation.mockReturnValue({ conversation: null, messages: [], isLoading: true, error: null, sendMessage: mockSendMessage, refetch: mockRefetch });
    render(<ConversationPageClient />);
    expect(screen.getByText(/chargement de la conversation/i)).toBeInTheDocument();
  });

  it("affiche une erreur si aucun utilisateur courant n'est disponible", () => {
    mockUseAuth.mockReturnValue({ user: null });
    render(<ConversationPageClient />);
    expect(screen.getByText(/utilisateur non connecté/i)).toBeInTheDocument();
  });

  it("affiche une erreur si la conversation est introuvable", () => {
    mockUseAuth.mockReturnValue({ user: makeUser({ id: 1 }) });
    mockUseConversation.mockReturnValue({ conversation: null, messages: [], isLoading: false, error: null, sendMessage: mockSendMessage, refetch: mockRefetch });
    render(<ConversationPageClient />);
    expect(screen.getByText(/aucune conversation trouvée/i)).toBeInTheDocument();
  });

  it("determine le destinataire comme participant2 quand l'utilisateur courant est participant1", () => {
    mockUseAuth.mockReturnValue({ user: makeUser({ id: 1 }) });
    render(<ConversationPageClient />);
    expect(screen.getByText('Destinataire: Bob Durand')).toBeInTheDocument();
  });

  it("determine le destinataire comme participant1 quand l'utilisateur courant est participant2", () => {
    mockUseAuth.mockReturnValue({ user: makeUser({ id: 2 }) });
    render(<ConversationPageClient />);
    expect(screen.getByText('Destinataire: Alice Martin')).toBeInTheDocument();
  });

  it('envoie le message avec le bon destinataireId', async () => {
    mockUseAuth.mockReturnValue({ user: makeUser({ id: 1 }) });
    const user = userEvent.setup();
    render(<ConversationPageClient />);

    await user.click(screen.getByText('Envoyer'));
    expect(mockSendMessage).toHaveBeenCalledWith({ destinataireId: 2, contenu: 'Salut' });
  });
});
