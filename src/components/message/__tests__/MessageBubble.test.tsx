import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessageBubble from '../MessageBubble';
import type { Message, User } from '@/types';

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
    contenu: 'Bonjour', lu: false, createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('MessageBubble - logique metier', () => {
  it("n'affiche pas le menu Signaler sur ses propres messages", () => {
    render(<MessageBubble message={makeMessage()} isOwn onSignaler={vi.fn()} />);
    expect(screen.queryByLabelText(/options du message/i)).not.toBeInTheDocument();
  });

  it("affiche le menu Signaler sur les messages d'un autre utilisateur si onSignaler est fourni", () => {
    render(<MessageBubble message={makeMessage()} isOwn={false} onSignaler={vi.fn()} />);
    expect(screen.getByLabelText(/options du message/i)).toBeInTheDocument();
  });

  it("n'affiche pas le menu sans callback onSignaler", () => {
    render(<MessageBubble message={makeMessage()} isOwn={false} />);
    expect(screen.queryByLabelText(/options du message/i)).not.toBeInTheDocument();
  });

  it('ferme le menu et appelle onSignaler avec l id du message au clic sur Signaler', async () => {
    const onSignaler = vi.fn();
    const user = userEvent.setup();
    render(<MessageBubble message={makeMessage({ id: 42 })} isOwn={false} onSignaler={onSignaler} />);

    await user.click(screen.getByLabelText(/options du message/i));
    await user.click(screen.getByText(/signaler/i));

    expect(onSignaler).toHaveBeenCalledWith(42);
    expect(screen.queryByText(/signaler/i)).not.toBeInTheDocument();
  });

  it("n'affiche pas d'indicateur de lecture sur les messages d'un autre utilisateur", () => {
    const { container } = render(<MessageBubble message={makeMessage({ lu: true })} isOwn={false} />);
    expect(container.querySelector('.lucide-check-check')).not.toBeInTheDocument();
  });

  it('affiche une double coche sur ses propres messages lus, une simple sinon', () => {
    const { container, rerender } = render(<MessageBubble message={makeMessage({ lu: false })} isOwn />);
    expect(container.querySelector('.lucide-check-check')).not.toBeInTheDocument();
    expect(container.querySelector('.lucide-check')).toBeInTheDocument();

    rerender(<MessageBubble message={makeMessage({ lu: true })} isOwn />);
    expect(container.querySelector('.lucide-check-check')).toBeInTheDocument();
  });
});
