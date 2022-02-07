import type { InitialOptionsTsJest } from 'ts-jest';
import { defaults as tsjPreset } from 'ts-jest/presets';

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  verbose: true,
  globals: {
    'ts-jest': {
      // ts-jest configuration goes here
    },
  },
  globalSetup: "<rootDir>/test/globalSetup.ts",
  globalTeardown: "<rootDir>/test/globalTeardown.ts",
  setupFilesAfterEnv: [
    "<rootDir>/test/setup.ts"
  ]
}

export default config
