module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    'react-native/react-native': true,
  },
  extends: [
    '@react-native-community',
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-native'],
  rules: {
    'no-console': 'warn', // Default: 'off'

    // TODO: The rules below should ideally be reclassified as "error"
    'react/prop-types': 'warn', // Default: 'error'
    'react-native/no-color-literals': 'warn', // Default: undefined, see https://github.com/Intellicode/eslint-plugin-react-native#configuration
    'react-native/no-unused-styles': 'warn', // Default: undefined, see https://github.com/Intellicode/eslint-plugin-react-native#configuration
  },
};
