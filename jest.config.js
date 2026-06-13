module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.worktrees/'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  transform: {
    '^.+\\.(es|js)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'es', 'json'],
}
