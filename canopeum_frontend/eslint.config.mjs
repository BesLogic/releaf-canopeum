import beslogicExtraStrict from 'eslint-config-beslogic/extra-strict.mjs'
import beslogicReact from 'eslint-config-beslogic/react.mjs'
import beslogicTypeScript from 'eslint-config-beslogic/typescript.mjs'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  beslogicReact,
  beslogicTypeScript,
  beslogicExtraStrict,
  {
    ignores: [
      // Not found by the project service. Isn't included in any TSConfig
      'index.html',
      // Auto-generated
      'src/services/api.ts',
    ],
  },
  {
    plugins: { 'react-refresh': reactRefresh },
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
            // Things that start with a letter (or digit or underscore), or `@` followed by a letter
            ['^@?\\w'],
            // Absolute imports and other imports such as Vue-style `@/foo`.
            // Anything not matched in another group.
            ['^'],
            // Relative imports.
            // Anything that starts with a dot or src/
            [
              // KEEP IN SYNC WITH
              // canopeum_frontend/tsconfig.json & canopeum_frontend/vite.config.ts
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
      // Extremely slow rule
      'etc/no-commented-out-code': 'off',
    },
  },
  {
    files: ['src/locale/**/*.ts'],
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
)
