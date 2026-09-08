import { describe, expect, it } from 'vitest';
import {
  loginSchema,
  registerSchema,
  completeProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  verifyPhoneSchema,
} from '../auth.schema';

describe('loginSchema', () => {
  it('accepte un email et un mot de passe valides', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'password123' });
    expect(result.success).toBe(true);
  });

  it('rejette un email mal forme', () => {
    const result = loginSchema.safeParse({ email: 'pas-un-email', password: 'password123' });
    expect(result.success).toBe(false);
  });

  it('rejette un mot de passe de moins de 8 caracteres', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'short1' });
    expect(result.success).toBe(false);
  });

  it('rejette des champs vides', () => {
    const result = loginSchema.safeParse({ email: '', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const valid = {
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    password: 'Password1',
    confirmPassword: 'Password1',
  };

  it('accepte un enregistrement valide', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('rejette si les mots de passe ne correspondent pas', () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: 'Autre1234' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('confirmPassword');
    }
  });

  it('rejette un mot de passe sans majuscule', () => {
    expect(registerSchema.safeParse({ ...valid, password: 'password1', confirmPassword: 'password1' }).success).toBe(false);
  });

  it('rejette un mot de passe sans minuscule', () => {
    expect(registerSchema.safeParse({ ...valid, password: 'PASSWORD1', confirmPassword: 'PASSWORD1' }).success).toBe(false);
  });

  it('rejette un mot de passe sans chiffre', () => {
    expect(registerSchema.safeParse({ ...valid, password: 'Password', confirmPassword: 'Password' }).success).toBe(false);
  });

  it('rejette un nom d\'un seul caractere', () => {
    expect(registerSchema.safeParse({ ...valid, nom: 'D' }).success).toBe(false);
  });

  it('rejette un nom de plus de 50 caracteres', () => {
    expect(registerSchema.safeParse({ ...valid, nom: 'D'.repeat(51) }).success).toBe(false);
  });

  it('n\'accepte plus de champ telephone (retire au profit de completeProfile)', () => {
    // Le schema n'a pas de champ telephone : un extra non declare doit etre ignore par zod, pas provoquer d'echec.
    const result = registerSchema.safeParse({ ...valid, telephone: '+237612345678' });
    expect(result.success).toBe(true);
  });
});

describe('completeProfileSchema', () => {
  const base = { telephone: '+237612345678', pays: 'Cameroun', ville: 'Douala' };

  it('accepte un format Afrique (quartier renseigne)', () => {
    const result = completeProfileSchema.safeParse({ ...base, quartier: 'Bonapriso' });
    expect(result.success).toBe(true);
  });

  it('accepte un format Diaspora (adresse complete + code postal, sans quartier)', () => {
    const result = completeProfileSchema.safeParse({
      ...base,
      adresseLigne1: '12 rue de la Paix',
      codePostal: '75001',
    });
    expect(result.success).toBe(true);
  });

  it('rejette si ni quartier ni adresse complete diaspora ne sont fournis', () => {
    const result = completeProfileSchema.safeParse(base);
    expect(result.success).toBe(false);
  });

  it('rejette une adresse diaspora incomplete (ligne1 sans code postal)', () => {
    const result = completeProfileSchema.safeParse({ ...base, adresseLigne1: '12 rue de la Paix' });
    expect(result.success).toBe(false);
  });

  it('rejette un numero de telephone invalide', () => {
    const result = completeProfileSchema.safeParse({ ...base, quartier: 'Bonapriso', telephone: 'pas-un-numero' });
    expect(result.success).toBe(false);
  });

  it('rejette une bio de plus de 500 caracteres', () => {
    const result = completeProfileSchema.safeParse({ ...base, quartier: 'Bonapriso', bio: 'x'.repeat(501) });
    expect(result.success).toBe(false);
  });
});

describe('changePasswordSchema', () => {
  it('accepte un changement de mot de passe valide', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'ancien',
      newPassword: 'Nouveau1',
      confirmNewPassword: 'Nouveau1',
    });
    expect(result.success).toBe(true);
  });

  it('rejette si la confirmation ne correspond pas au nouveau mot de passe', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'ancien',
      newPassword: 'Nouveau1',
      confirmNewPassword: 'Different1',
    });
    expect(result.success).toBe(false);
  });
});

describe('forgotPasswordSchema', () => {
  it('accepte un email valide', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'user@example.com' }).success).toBe(true);
  });

  it('rejette un email invalide', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'invalide' }).success).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  const base = { token: 'token-valide', newPassword: 'Nouveau1', confirmPassword: 'Nouveau1' };

  it('accepte un reset valide', () => {
    expect(resetPasswordSchema.safeParse(base).success).toBe(true);
  });

  it('rejette un token vide', () => {
    expect(resetPasswordSchema.safeParse({ ...base, token: '' }).success).toBe(false);
  });

  it('rejette si les mots de passe ne correspondent pas', () => {
    expect(resetPasswordSchema.safeParse({ ...base, confirmPassword: 'Autre1234' }).success).toBe(false);
  });
});

describe('verifyEmailSchema / verifyPhoneSchema', () => {
  it('accepte un code a 6 chiffres', () => {
    expect(verifyEmailSchema.safeParse({ code: '123456' }).success).toBe(true);
    expect(verifyPhoneSchema.safeParse({ code: '123456' }).success).toBe(true);
  });

  it('rejette un code de longueur differente de 6', () => {
    expect(verifyEmailSchema.safeParse({ code: '12345' }).success).toBe(false);
    expect(verifyEmailSchema.safeParse({ code: '1234567' }).success).toBe(false);
  });

  it('rejette un code non numerique', () => {
    expect(verifyEmailSchema.safeParse({ code: 'abcdef' }).success).toBe(false);
  });
});
