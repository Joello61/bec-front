import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { User } from '@/types';

import ProfileForm from '../ProfileForm';

const mockUseAvatar = vi.fn();
const mockUploadAvatar = vi.fn();
const mockDeleteAvatar = vi.fn();
vi.mock('@/lib/hooks/useUsers', () => ({
  useAvatar: () => mockUseAvatar(),
}));

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1, email: 'user@example.com', nom: 'Doe', prenom: 'John', telephone: '+237612345678',
    photo: null, bio: null, emailVerifie: true, telephoneVerifie: true, roles: ['ROLE_USER'],
    createdAt: '2025-01-01T00:00:00.000Z', isBanned: false, noteAvisMoyen: null, address: null,
    isProfileComplete: true, ...overrides,
  };
}

function makeFile(name = 'avatar.png', type = 'image/png') {
  return new File(['x'.repeat(50)], name, { type });
}

describe('ProfileForm - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAvatar.mockReturnValue({
      uploadAvatar: mockUploadAvatar,
      deleteAvatar: mockDeleteAvatar,
      isUploading: false,
      error: null,
      clearError: vi.fn(),
      currentAvatar: null,
    });
  });

  it('rejette un nom trop court avant soumission', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ProfileForm user={makeUser()} onSubmit={onSubmit} />);

    const nomInput = screen.getByLabelText(/^nom$/i);
    await user.clear(nomInput);
    await user.type(nomInput, 'D');
    await user.click(screen.getByRole('button', { name: /enregistrer/i }));

    expect(await screen.findByText(/nom doit contenir au moins 2 caractères/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('uploade l avatar selectionne avant de soumettre le profil', async () => {
    mockUploadAvatar.mockResolvedValue(undefined);
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ProfileForm user={makeUser()} onSubmit={onSubmit} />);

    const file = makeFile();
    await user.upload(screen.getByLabelText('Photo de profil'), file);

    await user.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => expect(mockUploadAvatar).toHaveBeenCalledWith(file));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('soumet quand meme le profil si l upload de l avatar echoue', async () => {
    mockUploadAvatar.mockRejectedValue(new Error('Upload impossible'));
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ProfileForm user={makeUser()} onSubmit={onSubmit} />);

    await user.upload(screen.getByLabelText('Photo de profil'), makeFile());
    await user.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => expect(mockUploadAvatar).toHaveBeenCalled());
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  it("n'affiche pas le bouton Annuler sans onCancel", () => {
    render(<ProfileForm user={makeUser()} onSubmit={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /annuler/i })).not.toBeInTheDocument();
  });

  it('appelle onCancel au clic sur Annuler', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<ProfileForm user={makeUser()} onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: /annuler/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
