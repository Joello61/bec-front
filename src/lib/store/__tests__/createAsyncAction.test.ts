import { describe, expect, it, vi } from 'vitest';
import { createAsyncAction, type AsyncActionState } from '../createAsyncAction';
import type { ApiError } from '@/types';

interface TestState extends AsyncActionState {
  data: string | null;
  user: string | null;
  isUploadingAvatar: boolean;
}

function makeSet() {
  let state: TestState = { isLoading: false, error: null, data: null, user: null, isUploadingAvatar: false };
  const set = vi.fn((partial: Partial<TestState> | ((s: TestState) => Partial<TestState>)) => {
    state = { ...state, ...(typeof partial === 'function' ? partial(state) : partial) };
  });
  return { set, getState: () => state };
}

const apiError: ApiError = { success: false, message: 'Erreur serveur' };

describe('createAsyncAction', () => {
  it('met isLoading a true puis false autour d\'un appel reussi (forme 1 : fetch sans rethrow)', async () => {
    const { set, getState } = makeSet();

    const result = await createAsyncAction(set, async () => {
      set({ data: 'valeur', isLoading: false });
      return 'valeur';
    }, { fallbackError: 'Erreur de chargement' });

    expect(result).toBe('valeur');
    expect(getState()).toMatchObject({ isLoading: false, error: null, data: 'valeur' });
    expect(set).toHaveBeenNthCalledWith(1, { isLoading: true, error: null });
  });

  it('absorbe l\'erreur et fixe le message de repli sans relancer (forme 1)', async () => {
    const { set, getState } = makeSet();

    const result = await createAsyncAction(set, async () => {
      throw apiError;
    }, { fallbackError: 'Erreur de chargement' });

    expect(result).toBeUndefined();
    expect(getState()).toMatchObject({ isLoading: false, error: 'Erreur serveur' });
  });

  it('utilise le message de repli quand l\'erreur API n\'a pas de message', async () => {
    const { set, getState } = makeSet();

    await createAsyncAction(set, async () => {
      throw { success: false, message: '' } as ApiError;
    }, { fallbackError: 'Erreur de repli' });

    expect(getState().error).toBe('Erreur de repli');
  });

  it('relance l\'erreur apres avoir mis a jour le state quand rethrow est true (forme 2 : mutation)', async () => {
    const { set, getState } = makeSet();

    await expect(
      createAsyncAction(set, async () => {
        throw apiError;
      }, { fallbackError: 'Erreur de creation', rethrow: true })
    ).rejects.toBe(apiError);

    expect(getState()).toMatchObject({ isLoading: false, error: 'Erreur serveur' });
  });

  it('retourne bien la valeur de fn en cas de succes avec rethrow: true (le throw est inatteignable)', async () => {
    const { set } = makeSet();

    const result = await createAsyncAction(set, async () => 'cree', {
      fallbackError: 'Erreur de creation',
      rethrow: true,
    });

    expect(result).toBe('cree');
  });

  it('permet un branchement custom via onError (forme 3 : ex. login EMAIL_NOT_VERIFIED)', async () => {
    const { set, getState } = makeSet();

    await createAsyncAction(set, async () => {
      throw { success: false, message: 'compte non verifie' } as ApiError;
    }, {
      fallbackError: 'Erreur de connexion',
      onError: (error) =>
        error.message.includes('verifie')
          ? { error: 'EMAIL_NOT_VERIFIED', isLoading: false, user: null }
          : { error: error.message, isLoading: false },
      rethrow: true,
    }).catch(() => {});

    expect(getState()).toMatchObject({ error: 'EMAIL_NOT_VERIFIED', isLoading: false, user: null });
  });

  it('permet d\'avaler l\'erreur sans toucher error via onError (forme 4 : ex. fetchMe/checkProfileStatus)', async () => {
    const { set, getState } = makeSet();

    const result = await createAsyncAction(set, async () => {
      throw apiError;
    }, {
      fallbackError: 'ignore',
      onError: () => ({ isLoading: false, user: null, error: null }),
    });

    expect(result).toBeUndefined();
    expect(getState()).toMatchObject({ isLoading: false, error: null, user: null });
  });

  it('pilote un champ de chargement dedie via loadingKey (ex. isUploadingAvatar) sans toucher isLoading', async () => {
    const { set, getState } = makeSet();

    await createAsyncAction(set, async () => {
      set({ data: 'photo.jpg', isUploadingAvatar: false });
      return 'photo.jpg';
    }, { fallbackError: 'Erreur avatar', loadingKey: 'isUploadingAvatar' });

    expect(set).toHaveBeenNthCalledWith(1, { isUploadingAvatar: true, error: null });
    expect(getState()).toMatchObject({ isLoading: false, isUploadingAvatar: false, data: 'photo.jpg' });
  });
});
