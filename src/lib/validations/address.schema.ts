import { z } from 'zod';

/**
 * Schéma de validation pour la mise à jour d'adresse
 * Soumis à la contrainte des 6 mois
 */
export const updateAddressSchema = z
  .object({
    pays: z
      .string()
      .min(1, 'Le pays est requis')
      .min(2, 'Le pays doit contenir au moins 2 caractères')
      .max(100, 'Le pays ne peut pas dépasser 100 caractères'),
    
    ville: z
      .string()
      .min(1, 'La ville est requise')
      .min(2, 'La ville doit contenir au moins 2 caractères')
      .max(100, 'La ville ne peut pas dépasser 100 caractères'),
    
    // Champs conditionnels
    quartier: z.string().optional().or(z.literal('')),
    adresseLigne1: z.string().optional().or(z.literal('')),
    adresseLigne2: z.string().optional().or(z.literal('')),
    codePostal: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      // Au moins un format d'adresse doit être rempli
      const hasQuartier = data.quartier && data.quartier.trim().length > 0;
      const hasDiasporaAddress = 
        data.adresseLigne1 && 
        data.adresseLigne1.trim().length > 0 && 
        data.codePostal && 
        data.codePostal.trim().length > 0;
      
      return hasQuartier || hasDiasporaAddress;
    },
    {
      message: 'Vous devez fournir soit un quartier (format Afrique), soit une adresse complète avec code postal (format Diaspora)',
      path: ['quartier'],
    }
  );

export type UpdateAddressFormData = z.infer<typeof updateAddressSchema>;