import { describe, expect, it, vi } from 'vitest';

vi.mock('../client', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: undefined }),
  },
}));

import apiClient from '../client';
import { favorisApi } from '../favoris';

describe('favorisApi - contrat', () => {
  it('ajoute un voyage aux favoris vers POST /favoris/voyage/{id}', async () => {
    await favorisApi.addVoyage(5);
    expect(apiClient.post).toHaveBeenCalledWith('/favoris/voyage/5');
  });

  it('ajoute une demande aux favoris vers POST /favoris/demande/{id}', async () => {
    await favorisApi.addDemande(8);
    expect(apiClient.post).toHaveBeenCalledWith('/favoris/demande/8');
  });

  it('retire un favori en distinguant le type dans l\'URL', async () => {
    await favorisApi.remove(5, 'voyage');
    expect(apiClient.delete).toHaveBeenCalledWith('/favoris/voyage/5');

    await favorisApi.remove(8, 'demande');
    expect(apiClient.delete).toHaveBeenCalledWith('/favoris/demande/8');
  });
});
