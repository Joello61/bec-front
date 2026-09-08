import { describe, expect, it } from 'vitest';

import { sendMessageSchema } from '../message.schema';

describe('sendMessageSchema', () => {
  it('accepte un message valide', () => {
    expect(sendMessageSchema.safeParse({ destinataireId: 1, contenu: 'Bonjour !' }).success).toBe(true);
  });

  it('rejette un contenu vide', () => {
    expect(sendMessageSchema.safeParse({ destinataireId: 1, contenu: '' }).success).toBe(false);
  });

  it('rejette un contenu ne contenant que des espaces', () => {
    expect(sendMessageSchema.safeParse({ destinataireId: 1, contenu: '    ' }).success).toBe(false);
  });

  it('rejette un contenu de plus de 2000 caracteres', () => {
    expect(sendMessageSchema.safeParse({ destinataireId: 1, contenu: 'x'.repeat(2001) }).success).toBe(false);
  });

  it('rejette un destinataireId non positif', () => {
    expect(sendMessageSchema.safeParse({ destinataireId: 0, contenu: 'Bonjour' }).success).toBe(false);
  });
});
