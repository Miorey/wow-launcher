module.exports = {
  env: {
    browser: true,
    es2021: true, // Updated to ES2021
    amd: true,
    node: true
  },
  extends: [
    `eslint:recommended`,
    `plugin:vue/vue3-essential`, // Updated for Vue 3, if you're using Vue 3
    `plugin:@typescript-eslint/recommended`, // If you're using TypeScript
  ],
  globals: {
    Atomics: `readonly`,
    SharedArrayBuffer: `readonly`
  },
  parser: `vue-eslint-parser`,
  parserOptions: {
    ecmaVersion: 2021, // Updated to ECMA 2021
    sourceType: `module`,
    parser: `@typescript-eslint/parser`, // If you're using TypeScript
  },
  plugins: [
    `vue`,
    `@typescript-eslint`, // If you're using TypeScript
  ],
  rules: {
    indent: [
      `error`,
      2 // Changed to 2 spaces for indentation, change as needed
    ],
    'linebreak-style': [
      `error`,
      `unix` // Changed to Unix style linebreaks, change as needed
    ],
    semi: [`error`, `always`],
    'quote-props': [`error`, `as-needed`],
    quotes: [
      `error`,
      `backtick`
    ],
    // 'no-console': `warn`,
    'no-unused-vars': `warn`,
    'no-var': `error`,
    'prefer-const': `error`,

    'vue/no-deprecated-filter': `off`
  },
};
