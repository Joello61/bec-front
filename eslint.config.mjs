import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      // Seuil calibre sur le fichier le plus long actuel du repo (411 lignes) :
      // avertissement, pas erreur - la decomposition des composants trop longs
      // est le sujet de la Phase 8 du plan de correction, pas de cette phase.
      'max-lines': ['warn', { max: 400, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    // e2e/ contient des tests Playwright, pas du code React : la fixture officielle
    // Playwright expose un parametre nomme "use" (test.extend), que react-hooks
    // confond avec un Hook React a cause de la convention de nommage "use*".
    files: ['e2e/**/*.ts'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  globalIgnores([
    // Ignores par defaut d'eslint-config-next :
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
