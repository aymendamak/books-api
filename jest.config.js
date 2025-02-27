/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  setupFilesAfterEnv: ["<rootDir>/prisma/singleton.ts"],
  collectCoverage: true,
  coverageDirectory: "coverage/jest",
  coverageReporters: ["html", "lcov", "text-summary"],
};
