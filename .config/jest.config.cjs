/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  moduleFileExtensions: ["js", "ts", "d.ts"],
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "..",
  reporters: [
    "default",
    ["./node_modules/jest-html-reporter", {
      pageTitle: "Test Report",
      includeFailureMsg: true,
      sort: "status"
    }]
  ]
};