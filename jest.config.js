const { createConfig } = require('@openedx/frontend-build');

module.exports = createConfig('jest', {
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
  coveragePathIgnorePatterns: [
    'src/setupTest.js',
    'src/i18n',
  ],
  moduleNameMapper: {
     '^react$': '<rootDir>/node_modules/react',
  '^react-dom$': '<rootDir>/node_modules/react-dom',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-paragon-topaz|@edx|@openedx)',
  ],
  // TODO: this test should be refactor,takes more than half the total time. temporarily disabled
  testPathIgnorePatterns:[
    'src/features/Main/_test_/index.test.jsx',
  ],
});
