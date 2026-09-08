import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ApiError } from '@/types';

vi.mock('@/lib/api/contacts', () => ({
  contactsApi: {
    create: vi.fn(),
  },
}));

import { contactsApi } from '@/lib/api/contacts';
import { useContactStore } from '../contactStore';

const initialState = useContactStore.getState();

beforeEach(() => {
  useContactStore.setState(initialState, true);
  vi.clearAllMocks();
});

describe('contactStore.createContact', () => {
  it('efface successMessage des le debut, meme avant la reponse de l\'API', () => {
    useContactStore.setState({ successMessage: 'ancien message' });
    vi.mocked(contactsApi.create).mockReturnValue(new Promise(() => {}));

    useContactStore.getState().createContact({} as never);

    expect(useContactStore.getState().successMessage).toBeNull();
  });

  it('fixe successMessage avec le message de la reponse en cas de succes', async () => {
    vi.mocked(contactsApi.create).mockResolvedValue({ id: 1, message: 'Message envoye' });

    await useContactStore.getState().createContact({} as never);

    expect(useContactStore.getState()).toMatchObject({ successMessage: 'Message envoye', isLoading: false });
  });

  it('relance l\'erreur en cas d\'echec', async () => {
    const apiError: ApiError = { success: false, message: 'Erreur envoi' };
    vi.mocked(contactsApi.create).mockRejectedValue(apiError);

    await expect(useContactStore.getState().createContact({} as never)).rejects.toBe(apiError);
    expect(useContactStore.getState()).toMatchObject({ isLoading: false, error: 'Erreur envoi' });
  });
});
