module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.worktrees/'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  transform: {
    '^.+\\.(es|js)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'es', 'json'],
  moduleNameMapper: {
    // poi provides react at runtime; tests only need a stub for view imports
    '^react$': '<rootDir>/tests/stubs/react.js',
  },
}
