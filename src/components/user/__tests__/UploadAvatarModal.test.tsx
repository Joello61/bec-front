import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import UploadAvatarModal from '../UploadAvatarModal';

const mockUploadAvatar = vi.fn();
const mockDeleteAvatar = vi.fn();
const mockUseAvatar = vi.fn();
vi.mock('@/lib/hooks/useUsers', () => ({
  useAvatar: () => mockUseAvatar(),
}));

function makeFile(name = 'avatar.png', type = 'image/png') {
  return new File(['x'.repeat(100)], name, { type });
}

describe('UploadAvatarModal - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAvatar.mockReturnValue({
      uploadAvatar: mockUploadAvatar,
      deleteAvatar: mockDeleteAvatar,
      isUploading: false,
    });
  });

  it('desactive Sauvegarder tant qu aucun fichier n est selectionne', () => {
    render(<UploadAvatarModal isOpen onClose={vi.fn()} currentAvatar={null} />);
    expect(screen.getByRole('button', { name: /sauvegarder/i })).toBeDisabled();
  });

  it("n'affiche pas Supprimer l'avatar sans avatar existant", () => {
    render(<UploadAvatarModal isOpen onClose={vi.fn()} currentAvatar={null} />);
    expect(screen.queryByRole('button', { name: /supprimer l'avatar/i })).not.toBeInTheDocument();
  });

  it("masque Supprimer l'avatar des qu'un nouveau fichier est selectionne", async () => {
    const user = userEvent.setup();
    render(<UploadAvatarModal isOpen onClose={vi.fn()} currentAvatar="https://example.com/current.jpg" />);

    expect(screen.getByRole('button', { name: /supprimer l'avatar/i })).toBeInTheDocument();

    const input = screen.getByLabelText(/choisir une nouvelle photo/i);
    await user.upload(input, makeFile());

    await waitFor(() => expect(screen.getByRole('button', { name: /sauvegarder/i })).toBeEnabled());
    expect(screen.queryByRole('button', { name: /supprimer l'avatar/i })).not.toBeInTheDocument();
  });

  it('uploade le fichier selectionne au clic sur Sauvegarder puis ferme la modale', async () => {
    mockUploadAvatar.mockResolvedValue(undefined);
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<UploadAvatarModal isOpen onClose={onClose} currentAvatar={null} />);

    const input = screen.getByLabelText(/choisir une nouvelle photo/i);
    const file = makeFile();
    await user.upload(input, file);

    await waitFor(() => expect(screen.getByRole('button', { name: /sauvegarder/i })).toBeEnabled());
    await user.click(screen.getByRole('button', { name: /sauvegarder/i }));

    await waitFor(() => expect(mockUploadAvatar).toHaveBeenCalledWith(file));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("supprime l'avatar apres confirmation puis ferme la modale", async () => {
    mockDeleteAvatar.mockResolvedValue(undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<UploadAvatarModal isOpen onClose={onClose} currentAvatar="https://example.com/current.jpg" />);

    await user.click(screen.getByRole('button', { name: /supprimer l'avatar/i }));

    await waitFor(() => expect(mockDeleteAvatar).toHaveBeenCalledTimes(1));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("n'appelle pas deleteAvatar si l'utilisateur annule la confirmation", async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const user = userEvent.setup();
    render(<UploadAvatarModal isOpen onClose={vi.fn()} currentAvatar="https://example.com/current.jpg" />);

    await user.click(screen.getByRole('button', { name: /supprimer l'avatar/i }));
    expect(mockDeleteAvatar).not.toHaveBeenCalled();
  });
});
