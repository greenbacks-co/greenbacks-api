module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  overrides: [{
    files: 'tests/**/*',
    rules: {
      'class-methods-use-this': 'off',
      'no-new': 'off',
    },
  }],
  plugins: ['jest'],
  rules: {
    'import/no-named-as-default': 'off',
    'max-classes-per-file': 'off',
    'no-console': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-use-before-define': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
};
