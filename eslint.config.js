import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      // Browser-context exporters run by hand with a local Chromium; they use DOM
      // globals and print to stdout by design, and CI never executes them.
      'scripts/export-launch-assets.mjs',
      'scripts/export-carousel-pdf.mjs',
      'scripts/measure-ink-coverage.mjs',
      'scripts/render-pixel-truth.mjs',

      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      'previews/**',
      'release/**',
      'apps/figma-plugin/dist/**',
      // Vendored verbatim from the August 2026 audit; kept unmodified for provenance.
      'scripts/ingest/source/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      eqeqeq: ['error', 'smart'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'object-shorthand': ['error', 'properties'],
    },
  },

  {
    files: ['packages/react/**/*.tsx', 'apps/web/**/*.tsx'],
    ...reactHooks.configs.flat['recommended-latest'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },

  {
    files: ['apps/web/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  {
    // The plugin's UI thread is a browser document; its main thread is Figma's
    // sandbox. Neither has Node globals.
    files: ['apps/figma-plugin/src/**/*.ts'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },

  {
    // Generated code is verified by `npm run verify:generated`, not by lint.
    files: [
      'packages/*/src/generated/**',
      'packages/react/src/icons/**',
      'apps/figma-plugin/src/generated/**',
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  {
    files: ['scripts/**/*.ts'],
    rules: {
      // Scripts are CLIs; stdout is their product.
      'no-console': 'off',
    },
  },
);
