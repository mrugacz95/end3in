/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  "testEnvironment": "jsdom",
  "setupFiles": [
    "jest-canvas-mock"
  ]
};