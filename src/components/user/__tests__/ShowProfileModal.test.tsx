import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShowProfileModal from '../ShowProfileModal';
import type { User } from '@/types';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'user@example.com',
    nom: 'Doe',
    prenom: 'John',
    telephone: null,
    photo: null,
    bio: null,
    emailVerifie: false,
    telephoneVerifie: false,
    roles: ['ROLE_USER'],
    createdAt: '2025-06-15T00:00:00.000Z',
    isBanned: false,
    noteAvisMoyen: null,
    address: null,
    isProfileComplete: true,
    ...overrides,
  };
}

describe('ShowProfileModal - logique metier', () => {
  it("ne rend rien si aucun utilisateur n'est fourni", () => {
    const { container } = render(<ShowProfileModal isOpen user={null} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("n'affiche aucun badge de verification sans email ni telephone verifie", () => {
    render(<ShowProfileModal isOpen user={makeUser()} onClose={vi.fn()} />);
    expect(screen.queryByText(/email vérifié/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/téléphone vérifié/i)).not.toBeInTheDocument();
  });

  it('affiche les badges de verification correspondants', () => {
    render(<ShowProfileModal isOpen user={makeUser({ emailVerifie: true, telephoneVerifie: true })} onClose={vi.fn()} />);
    expect(screen.getByText(/email vérifié/i)).toBeInTheDocument();
    expect(screen.getByText(/téléphone vérifié/i)).toBeInTheDocument();
  });

  it("n'affiche pas la ligne Bio si elle est vide", () => {
    render(<ShowProfileModal isOpen user={makeUser({ bio: null })} onClose={vi.fn()} />);
    expect(screen.queryByText('Bio')).not.toBeInTheDocument();
  });

  it('affiche la bio quand elle est renseignee', () => {
    render(<ShowProfileModal isOpen user={makeUser({ bio: 'Voyageur regulier' })} onClose={vi.fn()} />);
    expect(screen.getByText('Bio')).toBeInTheDocument();
    expect(screen.getByText('Voyageur regulier')).toBeInTheDocument();
  });

  it("n'affiche pas les informations d'adresse sans adresse", () => {
    render(<ShowProfileModal isOpen user={makeUser({ address: null })} onClose={vi.fn()} />);
    expect(screen.queryByText('Pays')).not.toBeInTheDocument();
  });

  it('affiche les informations d adresse quand elle est presente', () => {
    render(
      <ShowProfileModal
        isOpen
        user={makeUser({
          address: {
            id: 1, pays: 'Cameroun', ville: 'Yaoundé', quartier: 'Bastos',
            adresseLigne1: null, adresseLigne2: null, codePostal: null,
            createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z', lastModifiedAt: null,
          },
        })}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText('Cameroun')).toBeInTheDocument();
    expect(screen.getByText('Yaoundé')).toBeInTheDocument();
    expect(screen.getByText('Bastos')).toBeInTheDocument();
  });
});
