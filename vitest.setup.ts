import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom n'implemente pas ResizeObserver - necessaire depuis l'introduction de recharts
// (ResponsiveContainer, Lot 5 monetisation) pour eviter un crash au montage de tout
// composant utilisant un graphique dans les tests.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverStub;

// RTL n'enregistre son cleanup automatique que si `afterEach` est un global
// (voir doc officielle) - ce projet n'active pas `test.globals` dans
// vitest.config.mts, donc chaque fichier de test de composant accumulerait
// les rendus precedents dans le DOM sans cet appel explicite.
afterEach(() => {
  cleanup();
});
