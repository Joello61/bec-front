import type { ApiError } from '@/types';

export interface AsyncActionState {
  error: string | null;
}

type SetState<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>),
  replace?: false
) => void;

interface AsyncActionOptions<T> {
  fallbackError: string;
  /**
   * Champ booléen à piloter, défaut 'isLoading'. Obligatoire à préciser si l'état
   * n'a pas de champ 'isLoading' du tout (ex. geoStore : isLoadingCountries,
   * isLoadingCities... par ressource) - non vérifié par le typage, seulement par convention.
   */
  loadingKey?: keyof T;
  /** Remplace le `set({ error, [loadingKey]: false })` par défaut du catch. */
  onError?: (error: ApiError) => Partial<T> | void;
  /** Par défaut false : l'erreur est absorbée dans le state plutôt que relancée. */
  rethrow?: boolean;
}

/**
 * Factorise le pattern set({isLoading:true,error:null}) / try / catch(error:any)
 * dupliqué dans tous les stores zustand (audit Frontend-Qualité #1).
 * `fn` reste responsable de son propre set() de succès : chaque store a des
 * champs de succès différents, le helper ne connaît que isLoading (ou
 * l'équivalent désigné par loadingKey) et error.
 */
export function createAsyncAction<T extends AsyncActionState, R>(
  set: SetState<T>,
  fn: () => Promise<R>,
  options: AsyncActionOptions<T> & { rethrow: true }
): Promise<R>;
export function createAsyncAction<T extends AsyncActionState, R>(
  set: SetState<T>,
  fn: () => Promise<R>,
  options?: AsyncActionOptions<T>
): Promise<R | undefined>;
export async function createAsyncAction<T extends AsyncActionState, R>(
  set: SetState<T>,
  fn: () => Promise<R>,
  options: AsyncActionOptions<T> = { fallbackError: 'Une erreur est survenue' }
): Promise<R | undefined> {
  const loadingKey = options.loadingKey ?? ('isLoading' as keyof T);
  set({ [loadingKey]: true, error: null } as Partial<T>);
  try {
    return await fn();
  } catch (err) {
    const apiError = err as ApiError;
    const errorState = options.onError?.(apiError);
    set((errorState ?? {
      error: apiError.message || options.fallbackError,
      [loadingKey]: false,
    }) as Partial<T>);
    if (options.rethrow) {
      throw apiError;
    }
    return undefined;
  }
}
