module.exports = {
  testEnvironment: "node", // 'jsdom' or 'node'

  testRegex: "\\.(test|integration|unit|spec|e2e)\\.ts",

  moduleNameMapper: {
    // Mock css and svg imports
    // "\\.css$": "<rootDir>/src/__tests__/mock.ts",
    // "\\.svg$": "<rootDir>/src/__tests__/mock.ts",

    // For import aliasing
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // collectCoverageFrom: ["**/src/**/*.ts"],

  // Set coverage target thresholds to meet
  // coverageThreshold: {
  //   global: {
  //     statements: 35,
  //     branches: 20,
  //     functions: 35,
  //     lines: 35,
  //   },
  // },
};
