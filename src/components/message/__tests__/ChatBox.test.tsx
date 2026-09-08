import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatBox from '../ChatBox';
import type { Message, User } from '@/types';

const mockCreateSignalement = vi.fn();
vi.mock('@/lib/hooks/useSignalement', () => ({
  useSignalementActions: () => ({ createSignalement: mockCreateSignalement }),
}));

vi.mock('../MessageBubble', () => ({
  default: ({ message, isOwn, showAvatar, onSignaler }: {
    message: Message; isOwn: boolean; showAvatar: boolean; onSignaler?: (id: number) => void;
  }) => (
    <div>
      <span>{`Message ${message.id} - ${isOwn ? 'own' : 'other'} - avatar:${showAvatar ? 'yes' : 'no'}`}</span>
      {onSignaler && <button onClick={() => onSignaler(message.id)}>{`Signaler ${message.id}`}</button>}
    </div>
  ),
}));

vi.mock('../MessageInput', () => ({
  default: ({ onSend }: { onSend: (content: string) => void }) => (
    <button onClick={() => onSend('test')}>MessageInput (mock)</button>
  ),
}));

vi.mock('@/components/forms/SignalementForm', () => ({
  default: ({ onClose, onSubmit, messageId }: { onClose: () => void; onSubmit: (data: unknown) => void; messageId: number }) => (
    <div>
      <span>SignalementForm pour message {messageId}</span>
      <button onClick={() => onSubmit({ motif: 'spam' })}>Soumettre le signalement</button>
      <button onClick={onClose}>Fermer</button>
    </div>
  ),
}));

Element.prototype.scrollIntoView = vi.fn();

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
    id: 1, expediteur: makeUser({ id: 1 }), destinataire: makeUser({ id: 2 }),
    contenu: 'Bonjour', lu: false, createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('ChatBox - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche un etat vide sans aucun message", () => {
    render(<ChatBox messages={[]} recipient={makeUser({ id: 2 })} currentUserId={1} onSendMessage={vi.fn()} />);
    expect(screen.getByText(/commencez la conversation/i)).toBeInTheDocument();
  });

  it('determine isOwn en comparant l expediteur a currentUserId', () => {
    render(
      <ChatBox
        messages={[makeMessage({ id: 1, expediteur: makeUser({ id: 1 }) }), makeMessage({ id: 2, expediteur: makeUser({ id: 2 }) })]}
        recipient={makeUser({ id: 2 })}
        currentUserId={1}
        onSendMessage={vi.fn()}
      />
    );
    expect(screen.getByText('Message 1 - own - avatar:yes')).toBeInTheDocument();
    expect(screen.getByText('Message 2 - other - avatar:yes')).toBeInTheDocument();
  });

  it("groupe l'avatar : masque quand le meme expediteur enchaine plusieurs messages", () => {
    render(
      <ChatBox
        messages={[
          makeMessage({ id: 1, expediteur: makeUser({ id: 2 }) }),
          makeMessage({ id: 2, expediteur: makeUser({ id: 2 }) }),
          makeMessage({ id: 3, expediteur: makeUser({ id: 1 }) }),
        ]}
        recipient={makeUser({ id: 2 })}
        currentUserId={1}
        onSendMessage={vi.fn()}
      />
    );
    expect(screen.getByText('Message 1 - other - avatar:yes')).toBeInTheDocument();
    expect(screen.getByText('Message 2 - other - avatar:no')).toBeInTheDocument();
    expect(screen.getByText('Message 3 - own - avatar:yes')).toBeInTheDocument();
  });

  it("n'affiche pas le bouton retour sans onBack", () => {
    render(<ChatBox messages={[]} recipient={makeUser({ id: 2 })} currentUserId={1} onSendMessage={vi.fn()} />);
    expect(screen.queryByRole('button', { name: '' })).not.toBeInTheDocument();
  });

  it('ouvre la modale de signalement pour le message cible puis la ferme', async () => {
    const user = userEvent.setup();
    render(
      <ChatBox
        messages={[makeMessage({ id: 7, expediteur: makeUser({ id: 2 }) })]}
        recipient={makeUser({ id: 2 })}
        currentUserId={1}
        onSendMessage={vi.fn()}
      />
    );

    expect(screen.queryByText(/signalementform/i)).not.toBeInTheDocument();
    await user.click(screen.getByText('Signaler 7'));
    expect(screen.getByText(/signalementform pour message 7/i)).toBeInTheDocument();

    await user.click(screen.getByText('Fermer'));
    expect(screen.queryByText(/signalementform/i)).not.toBeInTheDocument();
  });

  it('soumet le signalement via createSignalement', async () => {
    mockCreateSignalement.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(
      <ChatBox
        messages={[makeMessage({ id: 7, expediteur: makeUser({ id: 2 }) })]}
        recipient={makeUser({ id: 2 })}
        currentUserId={1}
        onSendMessage={vi.fn()}
      />
    );

    await user.click(screen.getByText('Signaler 7'));
    await user.click(screen.getByText('Soumettre le signalement'));

    expect(mockCreateSignalement).toHaveBeenCalledWith({ motif: 'spam' });
  });
});
