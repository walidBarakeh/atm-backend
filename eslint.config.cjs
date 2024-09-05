const typescriptPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
    },
  ],
  rules: {
    'prettier/prettier': 'error', // Enforce Prettier formatting
    'no-console': 'warn', // Warn on console statements (adjust as needed)
    'no-unused-vars': 'warn', // Warn on unused variables
    'no-undef': 'error', // Error on undefined variables
    'no-magic-numbers': ['warn', { ignore: [0, 1] }], // Avoid magic numbers
    'consistent-return': 'error', // Consistent return statements
    'prefer-const': 'error', // Prefer const over let when possible
    'no-shadow': 'error', // Disallow variable declarations from shadowing variables
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Optional, controls explicit return types
    '@typescript-eslint/no-var-requires': 'off', // Optional, allows require statements
    '@typescript-eslint/ban-ts-comment': 'warn', // Warn on @ts-ignore comments
  },
};
