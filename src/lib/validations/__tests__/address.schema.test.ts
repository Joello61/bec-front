import { describe, expect, it } from 'vitest';
import { updateAddressSchema } from '../address.schema';

describe('updateAddressSchema', () => {
  const base = { pays: 'Cameroun', ville: 'Douala' };

  it('accepte un format Afrique (quartier renseigne)', () => {
    expect(updateAddressSchema.safeParse({ ...base, quartier: 'Akwa' }).success).toBe(true);
  });

  it('accepte un format Diaspora (adresse complete + code postal)', () => {
    const result = updateAddressSchema.safeParse({
      ...base,
      adresseLigne1: '10 avenue de la Republique',
      codePostal: '69001',
    });
    expect(result.success).toBe(true);
  });

  it('rejette si ni quartier ni adresse diaspora complete ne sont fournis', () => {
    expect(updateAddressSchema.safeParse(base).success).toBe(false);
  });

  it('rejette une adresse diaspora incomplete (code postal manquant)', () => {
    expect(updateAddressSchema.safeParse({ ...base, adresseLigne1: '10 avenue' }).success).toBe(false);
  });

  it('rejette un pays ou une ville trop courts', () => {
    expect(updateAddressSchema.safeParse({ pays: 'C', ville: 'Douala', quartier: 'Akwa' }).success).toBe(false);
    expect(updateAddressSchema.safeParse({ pays: 'Cameroun', ville: 'D', quartier: 'Akwa' }).success).toBe(false);
  });
});
