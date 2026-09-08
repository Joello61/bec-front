import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
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
