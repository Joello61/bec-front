import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompleteProfileForm from '../CompleteProfileForm';
import type { User } from '@/types';
import type { Country } from '@/types/geo';

const mockUseAuth = vi.fn();
const mockUseCountries = vi.fn();
const mockUseCities = vi.fn();
const mockUseCitySearch = vi.fn();
const mockUseAvatar = vi.fn();
const mockDeleteAvatar = vi.fn();
const mockUploadAvatar = vi.fn();

vi.mock('@/lib/hooks', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@/lib/hooks/useGeo', () => ({
  useCountries: () => mockUseCountries(),
  useCities: () => mockUseCities(),
  useCitySearch: () => mockUseCitySearch(),
}));

vi.mock('@/lib/hooks/useUsers', () => ({
  useAvatar: () => mockUseAvatar(),
}));

const cameroun: Country = { value: 'Cameroun', label: 'Cameroun', continent: 'AF' };
const france: Country = { value: 'France', label: 'France', continent: 'EU' };

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'user@example.com',
    nom: 'Doe',
    prenom: 'John',
    telephone: null,
    photo: null,
    bio: null,
    emailVerifie: true,
    telephoneVerifie: false,
    roles: ['ROLE_USER'],
    createdAt: new Date().toISOString(),
    isBanned: false,
    noteAvisMoyen: null,
    address: null,
    isProfileComplete: false,
    ...overrides,
  };
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

describe('CompleteProfileForm - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: makeUser() });
    mockUseCountries.mockReturnValue({ countries: [cameroun, france], isLoading: false });
    mockUseCities.mockReturnValue({ cities: [{ value: 'Yaoundé', label: 'Yaoundé' }], isLoading: false });
    mockUseCitySearch.mockReturnValue({ searchResults: [], isSearching: false, search: vi.fn() });
    mockUseAvatar.mockReturnValue({
      uploadAvatar: mockUploadAvatar,
      deleteAvatar: mockDeleteAvatar,
      isUploading: false,
      error: null,
      clearError: vi.fn(),
      currentAvatar: null,
    });
  });

  it('desactive le champ telephone et affiche un message quand il est deja verifie', () => {
    mockUseAuth.mockReturnValue({
      user: makeUser({ telephone: '+237612345678', telephoneVerifie: true }),
    });

    render(<CompleteProfileForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/numéro de téléphone/i)).toBeDisabled();
    expect(screen.getByText(/téléphone déjà vérifié/i)).toBeInTheDocument();
  });

  it("laisse le champ telephone actif quand il n'est pas encore verifie", () => {
    render(<CompleteProfileForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/numéro de téléphone/i)).toBeEnabled();
    expect(screen.queryByText(/téléphone déjà vérifié/i)).not.toBeInTheDocument();
  });

  it('affiche le format adresse africain (Quartier) pour un pays du continent AF', async () => {
    const user = userEvent.setup();
    render(<CompleteProfileForm onSubmit={vi.fn()} />);

    await selectOption(user, 'Pays', 'Cameroun');
    await selectOption(user, 'Ville', 'Yaoundé');

    expect(screen.getByLabelText(/quartier/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/adresse \(ligne 1\)/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/code postal/i)).not.toBeInTheDocument();
  });

  it('bascule vers le format postal (Adresse/Code postal) pour un pays hors Afrique', async () => {
    const user = userEvent.setup();
    render(<CompleteProfileForm onSubmit={vi.fn()} />);

    await selectOption(user, 'Pays', 'France');
    await selectOption(user, 'Ville', 'Yaoundé');

    expect(screen.getByLabelText(/adresse \(ligne 1\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/code postal/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/quartier/i)).not.toBeInTheDocument();
  });

  it('reinitialise la ville selectionnee quand on change de pays', async () => {
    const user = userEvent.setup();
    render(<CompleteProfileForm onSubmit={vi.fn()} />);

    await selectOption(user, 'Pays', 'Cameroun');
    await selectOption(user, 'Ville', 'Yaoundé');
    expect(screen.getByLabelText(labelExact('Ville'))).toHaveTextContent('Yaoundé');

    await selectOption(user, 'Pays', 'France');
    expect(screen.getByLabelText(labelExact('Ville'))).not.toHaveTextContent('Yaoundé');
  });

  it("n'affiche pas le bouton de suppression de photo sans avatar existant", () => {
    render(<CompleteProfileForm onSubmit={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /supprimer la photo/i })).not.toBeInTheDocument();
  });

  it('affiche le bouton de suppression de photo et appelle deleteAvatar au clic', async () => {
    mockUseAvatar.mockReturnValue({
      uploadAvatar: mockUploadAvatar,
      deleteAvatar: mockDeleteAvatar,
      isUploading: false,
      error: null,
      clearError: vi.fn(),
      currentAvatar: 'https://example.com/avatar.jpg',
    });

    const user = userEvent.setup();
    render(<CompleteProfileForm onSubmit={vi.fn()} />);

    const deleteButton = screen.getByRole('button', { name: /supprimer la photo/i });
    await user.click(deleteButton);

    expect(mockDeleteAvatar).toHaveBeenCalledTimes(1);
  });

  it('nettoie les champs du format non utilise avant de soumettre (format africain)', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<CompleteProfileForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/numéro de téléphone/i), '+237612345678');
    await selectOption(user, 'Pays', 'Cameroun');
    await selectOption(user, 'Ville', 'Yaoundé');
    await user.type(screen.getByLabelText(/quartier/i), 'Bastos');

    await user.click(screen.getByRole('button', { name: /compléter mon profil/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const submitted = onSubmit.mock.calls[0][0];
    expect(submitted.quartier).toBe('Bastos');
    expect(submitted.adresseLigne1).toBeUndefined();
    expect(submitted.codePostal).toBeUndefined();
    expect(submitted.photo).toBeUndefined();
  });
});
