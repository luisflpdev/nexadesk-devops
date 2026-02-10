/* eslint-env node */

module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all']
  },
  ignorePatterns: [
    'dist/',
    'node_modules/'
  ]
};