/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  plugins: ['react-refresh'],
  extends: [
    'beslogic/react',
    'beslogic/typescript',
    'beslogic/dprint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // Experimental, but causes pre-commit to actually find the project and avoids OOM
    EXPERIMENTAL_useProjectService: true,
  },
  ignorePatterns: [
    // Isn't included in any TSConfig
    '.eslintrc.cjs',
    'vite.config.ts',
    // Auto-generated
    'src/services/api.ts',
  ],
  rules: {
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
          // KEEP IN SYNC WITH canopeum_frontend/tsconfig.json AND canopeum_frontend/vite.config.ts
          [
            '^(\\.'
            + '|src/'
            + '|@assets'
            + '|@components'
            + '|@config'
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
    // There is currently a bug with this rule causing the linter to crash
    // Until this is fixed or solved, we'll turn this one off to prevent blocking
    // in PR with the exception
    // https://github.com/cartant/eslint-plugin-etc/issues/63
    'etc/no-implicit-any-catch': 'off',
  },
  overrides: [
    {
      files: 'src/locale/**/*.ts',
      rules: {
        // We prefer avoiding line-breaks in translation files
        'max-len': 'off',
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
