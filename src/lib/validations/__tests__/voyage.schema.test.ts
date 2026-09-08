import { describe, expect, it } from 'vitest';
import { createVoyageSchema, updateVoyageSchema, voyageFiltersSchema } from '../voyage.schema';

function isoDateInDays(days: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

describe('createVoyageSchema', () => {
  const valid = {
    villeDepart: 'Douala',
    villeArrivee: 'Paris',
    dateDepart: isoDateInDays(1),
    dateArrivee: isoDateInDays(2),
    poidsDisponible: 20,
    prixParKilo: 15,
    commissionProposeePourUnBagage: 5000,
  };

  it('accepte un voyage valide', () => {
    expect(createVoyageSchema.safeParse(valid).success).toBe(true);
  });

  it('rejette une date de depart dans le passe', () => {
    const result = createVoyageSchema.safeParse({ ...valid, dateDepart: isoDateInDays(-1) });
    expect(result.success).toBe(false);
  });

  it('rejette une date d\'arrivee anterieure ou egale a la date de depart', () => {
    const sameDay = createVoyageSchema.safeParse({ ...valid, dateDepart: isoDateInDays(3), dateArrivee: isoDateInDays(3) });
    expect(sameDay.success).toBe(false);

    const before = createVoyageSchema.safeParse({ ...valid, dateDepart: isoDateInDays(3), dateArrivee: isoDateInDays(1) });
    expect(before.success).toBe(false);
  });

  it('rejette si la ville de depart et la ville d\'arrivee sont identiques (insensible a la casse/espaces)', () => {
    const result = createVoyageSchema.safeParse({ ...valid, villeDepart: ' Douala ', villeArrivee: 'douala' });
    expect(result.success).toBe(false);
  });

  it('rejette un poids disponible hors bornes [1, 100]', () => {
    expect(createVoyageSchema.safeParse({ ...valid, poidsDisponible: 0 }).success).toBe(false);
    expect(createVoyageSchema.safeParse({ ...valid, poidsDisponible: 101 }).success).toBe(false);
  });

  it('rejette un prix par kilo negatif ou nul', () => {
    expect(createVoyageSchema.safeParse({ ...valid, prixParKilo: 0 }).success).toBe(false);
    expect(createVoyageSchema.safeParse({ ...valid, prixParKilo: -5 }).success).toBe(false);
  });

  it('rejette une commission negative ou nulle', () => {
    expect(createVoyageSchema.safeParse({ ...valid, commissionProposeePourUnBagage: 0 }).success).toBe(false);
  });

  it('rejette une description de plus de 500 caracteres', () => {
    expect(createVoyageSchema.safeParse({ ...valid, description: 'x'.repeat(501) }).success).toBe(false);
  });

  it('accepte l\'absence de description (optionnelle)', () => {
    expect('description' in valid).toBe(false);
    expect(createVoyageSchema.safeParse(valid).success).toBe(true);
  });
});

describe('updateVoyageSchema', () => {
  it('accepte une mise a jour partielle (un seul champ)', () => {
    expect(updateVoyageSchema.safeParse({ poidsDisponible: 30 }).success).toBe(true);
  });

  it('accepte un objet vide (aucun champ a mettre a jour)', () => {
    expect(updateVoyageSchema.safeParse({}).success).toBe(true);
  });

  it('rejette si les deux villes fournies sont identiques', () => {
    const result = updateVoyageSchema.safeParse({ villeDepart: 'Yaounde', villeArrivee: 'yaounde' });
    expect(result.success).toBe(false);
  });

  it('n\'exige pas que les deux villes soient fournies ensemble', () => {
    expect(updateVoyageSchema.safeParse({ villeDepart: 'Yaounde' }).success).toBe(true);
  });

  it('rejette une date de depart dans le passe si fournie', () => {
    expect(updateVoyageSchema.safeParse({ dateDepart: isoDateInDays(-2) }).success).toBe(false);
  });
});

describe('voyageFiltersSchema', () => {
  it('accepte un filtre vide (tous les champs optionnels)', () => {
    expect(voyageFiltersSchema.safeParse({}).success).toBe(true);
  });

  it('accepte un statut parmi les valeurs autorisees', () => {
    expect(voyageFiltersSchema.safeParse({ statut: 'actif' }).success).toBe(true);
  });

  it('rejette un statut hors enumeration', () => {
    expect(voyageFiltersSchema.safeParse({ statut: 'inconnu' }).success).toBe(false);
  });
});
