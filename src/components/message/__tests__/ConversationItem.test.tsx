import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { Conversation, Message, User } from '@/types';

import ConversationItem from '../ConversationItem';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1, email: 'user@example.com', nom: 'Doe', prenom: 'John', telephone: null,
    photo: null, bio: null, emailVerifie: true, telephoneVerifie: false, roles: ['ROLE_USER'],
    createdAt: '2025-01-01T00:00:00.000Z', isBanned: false, noteAvisMoyen: null, address: null,
    isProfileComplete: true, ...overrides,
  };
}

function makeMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: 1, expediteur: makeUser(), destinataire: makeUser({ id: 2 }),
    contenu: 'Bonjour, comment allez-vous ?', lu: false, createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeConversation(overrides: Partial<Conversation> = {}): Conversation {
  return {
    id: 1,
    participant1: makeUser({ id: 1, prenom: 'Alice', nom: 'Martin' }),
    participant2: makeUser({ id: 2, prenom: 'Bob', nom: 'Durand' }),
    dernierMessage: makeMessage(),
    messagesNonLus: 0,
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('ConversationItem - logique metier', () => {
  it("affiche participant2 comme interlocuteur quand l'utilisateur courant est participant1", () => {
    render(<ConversationItem conversation={makeConversation()} currentUserId={1} onClick={vi.fn()} />);
    expect(screen.getByText('Bob Durand')).toBeInTheDocument();
    expect(screen.queryByText('Alice Martin')).not.toBeInTheDocument();
  });

  it("affiche participant1 comme interlocuteur quand l'utilisateur courant est participant2", () => {
    render(<ConversationItem conversation={makeConversation()} currentUserId={2} onClick={vi.fn()} />);
    expect(screen.getByText('Alice Martin')).toBeInTheDocument();
    expect(screen.queryByText('Bob Durand')).not.toBeInTheDocument();
  });

  it("affiche 'Aucun message' quand la conversation n'a pas encore de message", () => {
    render(<ConversationItem conversation={makeConversation({ dernierMessage: undefined })} currentUserId={1} onClick={vi.fn()} />);
    expect(screen.getByText(/aucun message/i)).toBeInTheDocument();
  });

  it("n'affiche pas de badge de non-lus quand messagesNonLus vaut 0", () => {
    render(<ConversationItem conversation={makeConversation({ messagesNonLus: 0 })} currentUserId={1} onClick={vi.fn()} />);
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
  });

  it('affiche le badge avec le compte exact de messages non lus', () => {
    render(<ConversationItem conversation={makeConversation({ messagesNonLus: 3 })} currentUserId={1} onClick={vi.fn()} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('appelle onClick au clic sur la conversation', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<ConversationItem conversation={makeConversation()} currentUserId={1} onClick={onClick} />);

    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
