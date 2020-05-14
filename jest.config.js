// jest.config.js
const {defaults} = require('jest-config');
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-navigation|@react-navigation/.*|rn-placeholder|@expo)',
  ],
  // ...
};
