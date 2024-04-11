/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'beslogic/react',
    'beslogic/typescript',
    'beslogic/dprint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig?(.*).json'],
  },
  ignorePatterns: [
    '.eslintrc.cjs',
    // Auto-generated
    'src/services/api.ts',
  ],
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    /*
     * Beslogic presets overrides
     */
    // For now, we're fine using relative paths instead of ts-paths in this project
    'no-autofix/no-relative-import-paths/no-relative-import-paths': 'off',
    // Using Bootraps directly without a React wrapper will cause us to have to add classes to React Components
    'react/forbid-component-props': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    // There is currently a bug with this rule causing the linter to crash with
    // Until this is fixed or solved, we'll turn this one off to prevent blocking
    // in PR with the exception
    'etc/no-implicit-any-catch': 'off',
  }
}
