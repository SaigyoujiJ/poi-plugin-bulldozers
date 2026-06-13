module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  transform: {
    '^.+\\.(es|js)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'es', 'json'],
}
