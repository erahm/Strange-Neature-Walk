module.exports = {
  testEnvironment: 'node',
  // Use native ESM handling for node and avoid transpilation by disabling transforms
  // Turn off transforms so Jest doesn't try to transpile ESM files with CJS transforms
  // This allows native ESM import syntax in tests to work.
    // Use babel-jest to transform ESM (.mjs) files so jest can parse 'import' syntax
    transform: {
      '^.+\\.[tj]s$': ['babel-jest', { configFile: './babel.config.json' }],
      '^.+\\.mjs$': ['babel-jest', { configFile: './babel.config.json' }],
    },
  // Only pick up ESM-style test files (.mjs) to avoid CJS parsing of .js files
  testMatch: ['**/__tests__/**/*.mjs', '**/?(*.)+(spec|test).mjs'],
};
