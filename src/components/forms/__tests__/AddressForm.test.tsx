import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Address } from '@/types/address';
import type { Country } from '@/types/geo';

import AddressForm from '../AddressForm';

const mockUseCountries = vi.fn();
const mockUseCities = vi.fn();
const mockUseCitySearch = vi.fn();

vi.mock('@/lib/hooks/useGeo', () => ({
  useCountries: () => mockUseCountries(),
  useCities: () => mockUseCities(),
  useCitySearch: () => mockUseCitySearch(),
}));

const cameroun: Country = { value: 'Cameroun', label: 'Cameroun', continent: 'AF' };
const france: Country = { value: 'France', label: 'France', continent: 'EU' };

function makeAddress(overrides: Partial<Address> = {}): Address {
  return {
    id: 1,
    pays: 'Cameroun',
    ville: 'Yaoundé',
    quartier: 'Bastos',
    adresseLigne1: null,
    adresseLigne2: null,
    codePostal: null,
    ...overrides,
  } as Address;
}

// L'asterisque "requis" est colle au libelle sans espace (Select ajoute <span>*</span>
// juste apres le texte) : meme tolerance que labelExact() en E2E (e2e/support/helpers.ts).
function labelExact(text: string): RegExp {
  return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\*?$`);
}

async function selectOption(user: ReturnType<typeof userEvent.setup>, labelText: string, optionName: string) {
  await user.click(screen.getByLabelText(labelExact(labelText)));
  const option = await screen.findByRole('button', { name: optionName });
  await user.click(option);
}

describe('AddressForm - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCountries.mockReturnValue({ countries: [cameroun, france], isLoading: false });
    mockUseCities.mockReturnValue({ cities: [{ value: 'Yaoundé', label: 'Yaoundé' }], isLoading: false });
    mockUseCitySearch.mockReturnValue({ searchResults: [], isSearching: false, search: vi.fn() });
  });

  it("bloque la modification et affiche le delai d'attente quand canModify est faux", () => {
    render(
      <AddressForm
        address={makeAddress()}
        canModify={false}
        daysRemaining={42}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText(/modification non autorisée/i)).toBeInTheDocument();
    expect(screen.getByText(/42 jours/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /enregistrer l'adresse/i })).not.toBeInTheDocument();
  });

  it('affiche le formulaire quand canModify est vrai', () => {
    render(<AddressForm address={makeAddress()} canModify={true} onSubmit={vi.fn()} />);

    expect(screen.queryByText(/modification non autorisée/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enregistrer l'adresse/i })).toBeInTheDocument();
  });

  it('pre-remplit le formulaire avec le format africain existant (Quartier)', () => {
    render(<AddressForm address={makeAddress()} canModify={true} onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/quartier/i)).toHaveValue('Bastos');
    expect(screen.queryByLabelText(/adresse \(ligne 1\)/i)).not.toBeInTheDocument();
  });

  it('bascule vers le format postal quand on choisit un pays hors Afrique', async () => {
    const user = userEvent.setup();
    render(<AddressForm address={makeAddress()} canModify={true} onSubmit={vi.fn()} />);

    await selectOption(user, 'Pays', 'France');
    await selectOption(user, 'Ville', 'Yaoundé');

    expect(screen.getByLabelText(/adresse \(ligne 1\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/code postal/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/quartier/i)).not.toBeInTheDocument();
  });

  it('nettoie les champs du format non utilise avant de soumettre', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AddressForm address={makeAddress()} canModify={true} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /enregistrer l'adresse/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const submitted = onSubmit.mock.calls[0][0];
    expect(submitted.quartier).toBe('Bastos');
    expect(submitted.adresseLigne1).toBeUndefined();
    expect(submitted.codePostal).toBeUndefined();
  });

  it('appelle onCancel au clic sur Annuler', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<AddressForm address={makeAddress()} canModify={true} onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: /^annuler$/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
