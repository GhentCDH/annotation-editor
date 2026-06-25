import importPlugin from 'eslint-plugin-import-x';
import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/playwright-report/**',
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/docs/components/**',
      '**/docs/api/**',
      '**/dist',
      '**/out-tsc',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
      '**/vite.config.mts',
      '**/vitest.config.mts',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            // util: only depends on other util — no ui, backend, or cli
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            // backend (NestJS): only util — no Vue
            {
              sourceTag: 'type:backend',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            // ui (Vue): util + other ui — no NestJS
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:util', 'type:ui'],
            },
            // e2e: can use util + ui
            {
              sourceTag: 'type:e2e',
              onlyDependOnLibsWithTags: ['type:util', 'type:ui', 'type:e2e'],
            },
            // feature isolation: editor and preview cannot depend on each other
            {
              sourceTag: 'feature:editor',
              notDependOnLibsWithTags: ['feature:preview'],
            },
            {
              sourceTag: 'feature:preview',
              notDependOnLibsWithTags: ['feature:editor'],
            },
          ],
        },
      ],
    },
  },
  importPlugin.flatConfigs.recommended,
  {
    files: ['**/*.{js,vue,ts,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      quotes: ['error', 'single'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'import-x/default': 'off',
      'import-x/named': 'off',
      'import-x/no-unresolved': 'off',
      'import-x/order': [
        1,
        {
          groups: [
            'external',
            'builtin',
            'internal',
            'sibling',
            'parent',
            'index',
          ],
        },
      ],
    },
  },
];
