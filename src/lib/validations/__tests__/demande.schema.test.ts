import { describe, expect, it } from 'vitest';
import { createDemandeSchema, updateDemandeSchema, demandeFiltersSchema } from '../demande.schema';

function isoDateInDays(days: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

describe('createDemandeSchema', () => {
  const valid = {
    villeDepart: 'Douala',
    villeArrivee: 'Paris',
    dateLimite: isoDateInDays(5),
    poidsEstime: 5,
    prixParKilo: 15,
    commissionProposeePourUnBagage: 3000,
    description: 'Un colis fragile a expedier rapidement svp.',
  };

  it('accepte une demande valide', () => {
    expect(createDemandeSchema.safeParse(valid).success).toBe(true);
  });

  it('rejette une date limite dans le passe', () => {
    expect(createDemandeSchema.safeParse({ ...valid, dateLimite: isoDateInDays(-1) }).success).toBe(false);
  });

  it('rejette une date limite invalide (chaine non parsable)', () => {
    expect(createDemandeSchema.safeParse({ ...valid, dateLimite: 'pas-une-date' }).success).toBe(false);
  });

  it('rejette si la ville de depart et la ville d\'arrivee sont identiques', () => {
    expect(createDemandeSchema.safeParse({ ...valid, villeDepart: 'Douala', villeArrivee: 'douala' }).success).toBe(false);
  });

  it('rejette un poids estime hors bornes [0.1, 50]', () => {
    expect(createDemandeSchema.safeParse({ ...valid, poidsEstime: 0 }).success).toBe(false);
    expect(createDemandeSchema.safeParse({ ...valid, poidsEstime: 51 }).success).toBe(false);
  });

  it('rejette une description trop courte (moins de 10 caracteres)', () => {
    expect(createDemandeSchema.safeParse({ ...valid, description: 'trop bref' }).success).toBe(false);
  });

  it('rejette une description manquante', () => {
    const { description: _description, ...withoutDescription } = valid;
    void _description;
    expect(createDemandeSchema.safeParse(withoutDescription).success).toBe(false);
  });

  it('rejette un prix par kilo ou une commission non positifs', () => {
    expect(createDemandeSchema.safeParse({ ...valid, prixParKilo: 0 }).success).toBe(false);
    expect(createDemandeSchema.safeParse({ ...valid, commissionProposeePourUnBagage: -1 }).success).toBe(false);
  });
});

describe('updateDemandeSchema', () => {
  it('accepte un objet vide (aucun champ a mettre a jour)', () => {
    expect(updateDemandeSchema.safeParse({}).success).toBe(true);
  });

  it('accepte une mise a jour partielle valide', () => {
    expect(updateDemandeSchema.safeParse({ poidsEstime: 10 }).success).toBe(true);
  });

  it('rejette si les deux villes fournies sont identiques', () => {
    expect(updateDemandeSchema.safeParse({ villeDepart: 'Yaounde', villeArrivee: 'yaounde' }).success).toBe(false);
  });

  it('rejette une date limite dans le passe si fournie', () => {
    expect(updateDemandeSchema.safeParse({ dateLimite: isoDateInDays(-3) }).success).toBe(false);
  });

  it('rejette une description trop courte si fournie', () => {
    expect(updateDemandeSchema.safeParse({ description: 'court' }).success).toBe(false);
  });
});

describe('demandeFiltersSchema', () => {
  it('accepte un filtre vide', () => {
    expect(demandeFiltersSchema.safeParse({}).success).toBe(true);
  });

  it('accepte un statut parmi les valeurs autorisees', () => {
    expect(demandeFiltersSchema.safeParse({ statut: 'en_recherche' }).success).toBe(true);
  });

  it('rejette un statut hors enumeration', () => {
    expect(demandeFiltersSchema.safeParse({ statut: 'inconnu' }).success).toBe(false);
  });
});
