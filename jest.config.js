module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '/\\.worktrees/'],
  transform: {
    '^.+\\.(es|js)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'es', 'json'],
}
