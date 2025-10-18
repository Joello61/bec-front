/**
 * Option pour Select (format standard)
 */
export interface GeoOption {
  value: string;
  label: string;
}

/**
 * Pays (données depuis l'API)
 */
export interface Country extends GeoOption {
  continent?: string; // Code continent (ex: "AF", "EU", "AS", "NA", "SA", "OC", "AN")
}

/**
 * Ville (données depuis l'API)
 */
export interface City extends GeoOption {
  population?: number;  // Population (pour tri par pertinence)
  admin1Name?: string;  // Région/État (ex: "Île-de-France", "Centre")
}

/**
 * Ville globale (inclut infos pays)
 */
export interface CityGlobal extends GeoOption {
  country: string;        // Nom français du pays (ex: "France")
  countryCode: string;    // Code ISO (ex: "FR")
  population?: number;    // Population
  admin1Name?: string;    // Région/État
}


/**
 * Réponse API erreur géographique
 */
export interface GeoApiError {
  error: string;
  message?: string;
}