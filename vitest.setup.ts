import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// RTL n'enregistre son cleanup automatique que si `afterEach` est un global
// (voir doc officielle) - ce projet n'active pas `test.globals` dans
// vitest.config.mts, donc chaque fichier de test de composant accumulerait
// les rendus precedents dans le DOM sans cet appel explicite.
afterEach(() => {
  cleanup();
});
