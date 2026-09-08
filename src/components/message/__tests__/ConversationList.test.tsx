import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { Conversation, User } from '@/types';

import ConversationList from '../ConversationList';

vi.mock('../ConversationItem', () => ({
  default: ({ conversation, isActive, onClick }: { conversation: Conversation; isActive: boolean; onClick: () => void }) => (
    <button onClick={onClick} data-active={isActive}>
      Conversation {conversation.id}
    </button>
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

describe('ConversationList - logique metier', () => {
  it('affiche un etat vide quand aucune conversation', () => {
    render(<ConversationList conversations={[]} currentUserId={1} onConversationClick={vi.fn()} />);
    expect(screen.getByText(/aucune conversation/i)).toBeInTheDocument();
  });

  it('priorise le squelette de chargement meme sans conversations', () => {
    render(<ConversationList conversations={[]} currentUserId={1} onConversationClick={vi.fn()} isLoading />);
    expect(screen.queryByText(/aucune conversation/i)).not.toBeInTheDocument();
  });

  it('appelle onConversationClick avec l id de la conversation cliquee', async () => {
    const onConversationClick = vi.fn();
    const user = userEvent.setup();
    render(
      <ConversationList
        conversations={[makeConversation({ id: 5 }), makeConversation({ id: 9 })]}
        currentUserId={1}
        onConversationClick={onConversationClick}
      />
    );

    await user.click(screen.getByText('Conversation 9'));
    expect(onConversationClick).toHaveBeenCalledWith(9);
  });

  it('marque comme active uniquement la conversation correspondant a activeConversationId', () => {
    render(
      <ConversationList
        conversations={[makeConversation({ id: 5 }), makeConversation({ id: 9 })]}
        currentUserId={1}
        activeConversationId={9}
        onConversationClick={vi.fn()}
      />
    );

    expect(screen.getByText('Conversation 5')).toHaveAttribute('data-active', 'false');
    expect(screen.getByText('Conversation 9')).toHaveAttribute('data-active', 'true');
  });
});
