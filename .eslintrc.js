module.exports = {
    env: {
        es6: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    globals: {
        Atomics: 'readonly',
        Plot: 'readonly',
        SharedArrayBuffer: 'readonly',
        Spock: 'readonly'
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
        'brace-style': ['error', '1tbs'],
        curly: ['error', 'multi-or-nest', 'consistent'],
        'dot-notation': ['error', { allowKeywords: true }],
        'eol-last': 'error',
        indent: ['error', 2],
        'no-mixed-spaces-and-tabs': 'error',
        'no-multi-spaces': 'error',
        'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
        'no-shadow': 'warn',
        'no-trailing-spaces': 'error',
        'no-var': 'error',
        'padded-blocks': ['error', 'never'],
        'prefer-const': 'error',
        'quote-props': ['error', 'as-needed'],
        quotes: ['error', 'single', {avoidEscape: true}],
        semi: 'error',
    }
};
