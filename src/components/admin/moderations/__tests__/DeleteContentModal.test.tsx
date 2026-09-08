import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteContentModal from '../DeleteContentModal';

const mockDeleteVoyage = vi.fn();
const mockDeleteDemande = vi.fn();
const mockDeleteAvis = vi.fn();
const mockDeleteMessage = vi.fn();
vi.mock('@/lib/hooks', () => ({
  useAdmin: () => ({
    deleteVoyage: mockDeleteVoyage,
    deleteDemande: mockDeleteDemande,
    deleteAvis: mockDeleteAvis,
    deleteMessage: mockDeleteMessage,
  }),
}));

describe('DeleteContentModal - logique metier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("n'affiche pas le champ raison du bannissement tant que Bannir l'utilisateur n'est pas coche", () => {
    render(
      <DeleteContentModal
        contentType="voyage"
        contentId={7}
        contentTitle="Yaoundé -> Douala"
        userId={99}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.queryByPlaceholderText(/raison du bannissement/i)).not.toBeInTheDocument();
  });

  it("exige une raison de bannissement quand Bannir l'utilisateur est coche", async () => {
    const user = userEvent.setup();
    render(
      <DeleteContentModal
        contentType="voyage"
        contentId={7}
        contentTitle="Yaoundé -> Douala"
        userId={99}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: /bannir également/i }));
    expect(screen.getByPlaceholderText(/raison du bannissement/i)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/expliquez en détail/i), 'Contenu frauduleux confirmé');
    await user.click(screen.getByRole('button', { name: /supprimer le contenu/i }));

    expect(await screen.findByText(/raison du bannissement est obligatoire/i)).toBeInTheDocument();
    expect(mockDeleteVoyage).not.toHaveBeenCalled();
  });

  it('route la suppression vers deleteDemande pour contentType=demande', async () => {
    mockDeleteDemande.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(
      <DeleteContentModal
        contentType="demande"
        contentId={12}
        contentTitle="Colis Douala -> Paris"
        userId={99}
        onClose={vi.fn()}
        onSuccess={onSuccess}
      />
    );

    await user.type(screen.getByPlaceholderText(/expliquez en détail/i), 'Contenu frauduleux confirmé');
    await user.click(screen.getByRole('button', { name: /supprimer le contenu/i }));

    await waitFor(() => expect(mockDeleteDemande).toHaveBeenCalledWith(12, expect.objectContaining({
      reason: 'Contenu frauduleux confirmé',
      motif: 'autre',
      severity: 'medium',
    })));
    expect(mockDeleteVoyage).not.toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('route la suppression vers deleteAvis pour contentType=avis', async () => {
    mockDeleteAvis.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(
      <DeleteContentModal
        contentType="avis"
        contentId={3}
        contentTitle="Avis 5 étoiles"
        userId={99}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    await user.type(screen.getByPlaceholderText(/expliquez en détail/i), 'Avis diffamatoire signalé');
    await user.click(screen.getByRole('button', { name: /supprimer le contenu/i }));

    await waitFor(() => expect(mockDeleteAvis).toHaveBeenCalledWith(3, expect.any(Object)));
  });
});
