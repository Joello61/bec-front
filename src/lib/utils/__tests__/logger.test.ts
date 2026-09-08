import { afterEach, describe, expect, it, vi } from 'vitest';

describe('logger', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('relaie vers console en développement', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { logger } = await import('@/lib/utils/logger');
    logger.log('message');
    logger.warn('avertissement');
    logger.error('erreur');

    expect(logSpy).toHaveBeenCalledWith('message');
    expect(warnSpy).toHaveBeenCalledWith('avertissement');
    expect(errorSpy).toHaveBeenCalledWith('erreur');
  });

  it('reste silencieux en production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { logger } = await import('@/lib/utils/logger');
    logger.log('message');
    logger.warn('avertissement');
    logger.error('erreur');

    expect(logSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
