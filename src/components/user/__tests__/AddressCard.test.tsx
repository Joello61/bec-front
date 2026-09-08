import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddressCard from '../AddressCard';
import type { Address } from '@/types/address';

function makeAddress(overrides: Partial<Address> = {}): Address {
  return {
    id: 1,
    pays: 'Cameroun',
    ville: 'Yaoundé',
    quartier: 'Bastos',
    adresseLigne1: null,
    adresseLigne2: null,
    codePostal: null,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    lastModifiedAt: null,
    ...overrides,
  };
}

describe('AddressCard - logique metier', () => {
  it('affiche le format Afrique (Quartier) quand quartier est renseigne', () => {
    render(<AddressCard address={makeAddress()} canModify onEdit={vi.fn()} />);
    expect(screen.getByText('Format Afrique')).toBeInTheDocument();
    expect(screen.getByText('Bastos')).toBeInTheDocument();
  });

  it('affiche le format international (Adresse/Code postal) sans quartier', () => {
    render(
      <AddressCard
        address={makeAddress({ quartier: null, adresseLigne1: '12 rue de Paris', codePostal: '75001' })}
        canModify
        onEdit={vi.fn()}
      />
    );
    expect(screen.getByText('Format International')).toBeInTheDocument();
    expect(screen.getByText('12 rue de Paris')).toBeInTheDocument();
    expect(screen.getByText('75001')).toBeInTheDocument();
  });

  it("desactive le bouton Modifier quand la modification n'est pas autorisee (delai 6 mois)", () => {
    render(<AddressCard address={makeAddress()} canModify={false} onEdit={vi.fn()} />);
    expect(screen.getByRole('button', { name: /modifier/i })).toBeDisabled();
  });

  it('affiche la date de prochaine modification autorisee quand bloquee', () => {
    render(
      <AddressCard address={makeAddress()} canModify={false} nextModificationDate="2026-06-01T00:00:00.000Z" onEdit={vi.fn()} />
    );
    expect(screen.getByText(/prochaine modification possible le/i)).toBeInTheDocument();
    expect(screen.queryByText(/modification autorisée/i)).not.toBeInTheDocument();
  });

  it('appelle onEdit au clic quand la modification est autorisee', async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(<AddressCard address={makeAddress()} canModify onEdit={onEdit} />);

    await user.click(screen.getByRole('button', { name: /modifier/i }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("n'affiche pas le bouton Modifier quand showEditButton est false", () => {
    render(<AddressCard address={makeAddress()} canModify onEdit={vi.fn()} showEditButton={false} />);
    expect(screen.queryByRole('button', { name: /modifier/i })).not.toBeInTheDocument();
  });
});
