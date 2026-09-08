import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type ErrorHandler = (error: AxiosError) => Promise<unknown>;

const interceptorHandlers: { error?: ErrorHandler } = {};
const mockPost = vi.fn();
const logoutMock = vi.fn();

// instance : a la fois callable (apiClient(originalRequest) pour rejouer une requete)
// et porteur des methodes utilisees par l'intercepteur (post, interceptors.response.use).
const instanceFn = vi.fn();

vi.mock('axios', () => {
  const instance = Object.assign(instanceFn, {
    post: (...args: unknown[]) => mockPost(...args),
    interceptors: {
      response: {
        use: (_success: unknown, error: ErrorHandler) => {
          interceptorHandlers.error = error;
        },
      },
    },
  });
  return {
    default: {
      create: () => instance,
    },
  };
});

vi.mock('@/lib/store', () => ({
  useAuthStore: { getState: () => ({ logout: logoutMock }) },
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function makeError(status: number | undefined, url = '/voyages', retry = false): AxiosError {
  return {
    isAxiosError: true,
    name: 'AxiosError',
    message: 'Request failed',
    toJSON: () => ({}),
    config: { url, _retry: retry } as InternalAxiosRequestConfig & { _retry?: boolean },
    response: status
      ? { status, data: { message: 'Erreur backend' }, statusText: '', headers: {}, config: {} as InternalAxiosRequestConfig }
      : undefined,
  } as AxiosError;
}

describe('apiClient interceptor (client.ts)', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    instanceFn.mockReset();
    instanceFn.mockResolvedValue({ data: 'retried' });
    await import('../client');
  });

  it('rejoue la requete originale apres un refresh reussi sur un 401 isole', async () => {
    mockPost.mockResolvedValueOnce({ data: {} });

    const result = await interceptorHandlers.error!(makeError(401, '/voyages'));

    expect(mockPost).toHaveBeenCalledWith('/token/refresh');
    expect(instanceFn).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ data: 'retried' });
  });

  it('ne declenche qu\'un seul refresh pour plusieurs 401 concurrents, puis rejoue chaque requete', async () => {
    const refreshDeferred = deferred<{ data: unknown }>();
    mockPost.mockReturnValueOnce(refreshDeferred.promise);

    const p1 = interceptorHandlers.error!(makeError(401, '/voyages'));
    const p2 = interceptorHandlers.error!(makeError(401, '/demandes'));

    // Le second 401 doit etre mis en file d'attente, pas declencher un second refresh.
    expect(mockPost).toHaveBeenCalledTimes(1);

    refreshDeferred.resolve({ data: {} });
    await Promise.all([p1, p2]);

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(instanceFn).toHaveBeenCalledTimes(2);
  });

  it('deconnecte et redirige vers la page de connexion si le refresh echoue', async () => {
    const replaceMock = vi.fn();
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, replace: replaceMock },
    });

    const refreshError = new Error('refresh failed');
    mockPost.mockRejectedValueOnce(refreshError);

    await expect(interceptorHandlers.error!(makeError(401, '/voyages'))).rejects.toBe(refreshError);

    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(replaceMock).toHaveBeenCalledWith('/auth/login');

    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
  });

  it('ne tente pas de refresh sur un 401 renvoye par /token/refresh lui-meme', async () => {
    const result = await interceptorHandlers.error!(makeError(401, '/token/refresh')).catch((e) => e);

    expect(mockPost).not.toHaveBeenCalled();
    expect(result).toMatchObject({ success: false, statusCode: 401 });
  });

  it('ne retente pas indefiniment une requete deja marquee _retry', async () => {
    const result = await interceptorHandlers.error!(makeError(401, '/voyages', true)).catch((e) => e);

    expect(mockPost).not.toHaveBeenCalled();
    expect(result).toMatchObject({ success: false, statusCode: 401 });
  });

  it('normalise une erreur non-401 avec reponse en ApiError', async () => {
    const result = await interceptorHandlers.error!(makeError(403, '/admin/users')).catch((e) => e);

    expect(result).toEqual({
      success: false,
      message: 'Erreur backend',
      statusCode: 403,
      errors: undefined,
      debug: undefined,
    });
  });

  it('normalise une erreur reseau (requete envoyee, aucune reponse) sans crash', async () => {
    const error = { isAxiosError: true, request: {}, config: { url: '/voyages' } } as AxiosError;

    const result = await interceptorHandlers.error!(error).catch((e) => e);

    expect(result).toEqual({ success: false, message: 'Impossible de contacter le serveur', statusCode: 0 });
  });

  it('normalise une erreur sans requete ni reponse (erreur de configuration)', async () => {
    const error = { isAxiosError: true, message: 'Configuration invalide', config: {} } as AxiosError;

    const result = await interceptorHandlers.error!(error).catch((e) => e);

    expect(result).toEqual({ success: false, message: 'Configuration invalide', statusCode: 0 });
  });
});
