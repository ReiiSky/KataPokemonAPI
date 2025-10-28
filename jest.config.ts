import { Config } from 'jest';

const config: Config = {
  roots: ['./'],
  modulePaths: ['./'],
  moduleDirectories: ['node_modules', 'source'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!variables/.*)'],
  testPathIgnorePatterns: ['build'],
};

// biome-ignore lint/style/noDefaultExport: default format from jest
export default config;
