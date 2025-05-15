/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  plugins: ['react-refresh'],
  extends: [
    'beslogic/react',
    'beslogic/typescript',
    'beslogic/extra-strict',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    projectService: {
      allowDefaultProject: ['*/*/*.js', '.eslintrc.cjs', 'apiSchemaGenerator.js'],
    },
    // Still needed for plugins that haven't updated to typescript-eslint@8 yet
    // Namely: eslint-plugin-sonarjs
    EXPERIMENTAL_useProjectService: true,
    // eslint-disable-next-line no-undef -- false-positive
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    // Not found by the project service. Isn't included in any TSConfig
    'index.html',
    // Auto-generated
    'src/services/api.ts',
  ],
  rules: {
    // TODO: Remove this config after updating to eslint-config-beslogic@4.2.1
    'react/jsx-props-no-spreading': [
      'error',
      {
        explicitSpread: 'ignore',
        custom: 'ignore',
        // Very often needed for custom inputs and validation using Higher Order Components
        exceptions: ['input'],
      },
    ],
    '@typescript-eslint/no-floating-promises': ['error', {
      // Don't even ignore voided promises. Force a comment explaining.
      ignoreVoid: false, // TODO: This could be added to Beslogic's extra-strict preset
      allowForKnownSafeCalls: [ // TODO: This could be added to Beslogic's presets
        // Doesn't throw and already console.warn itself
        { from: 'package', package: 'i18next', name: 'changeLanguage' },
      ],
    }],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }, // Works fine in Vite
    ],

    /*
     * Beslogic presets overrides
     */
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // Node.js builtins prefixed with `node:`.
          ['^node:'],
          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          ['^@?\\w'],
          // Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything not matched in another group.
          ['^'],
          // Relative imports.
          // Anything that starts with a dot or src/
          [
            // KEEP IN SYNC WITH canopeum_frontend/tsconfig.json & canopeum_frontend/vite.config.ts
            '^(\\.'
            + '|src/'
            + '|@assets'
            + '|@components'
            + '|@constants'
            + '|@hooks'
            + '|@models'
            + '|@pages'
            + '|@services'
            + '|@store'
            + '|@utils'
            + ')',
          ],
        ],
      },
    ],
    // Using Bootraps directly without a React wrapper
    // will cause us to have to add classes to React Components
    'react/forbid-component-props': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    // Extremely slow rule
    'etc/no-commented-out-code': 'off',
  },
  overrides: [
    {
      files: 'src/locale/**/*.ts',
      rules: {
        // These are not credentials
        'sonarjs/no-hardcoded-credentials': 'off',
        // We prefer avoiding line-breaks in translation files
        '@stylistic/max-len': 'off',
        // Imports across languages to use the "satisfies" keyword on object literals
        // We need to apply it directly on object literals to check for excess properties
        // https://www.typescriptlang.org/docs/handbook/2/objects.html#excess-property-checks
        'no-autofix/no-relative-import-paths/no-relative-import-paths': 'off',
        // i18next uses snake_case for special handling
        // https://www.i18next.com/translation-function/plurals#singular-plural
        camelcase: 'off',
      },
    },
  ],
}
