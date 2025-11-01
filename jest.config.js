module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/main.js',
    '!src/preload.js',
    '!src/renderer.jsx'
  ]
};