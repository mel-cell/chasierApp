import js from '@eslint/js';
import globals from 'globals';
import ReactPlugin from 'eslint-plugin-react';
import ReactHooksPlugin from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
    js.configs.recommended,
    {
        files: ['resources/js/**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
    },
    {
        files: ['resources/js/**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
    {
        files: ['resources/js/**/*.{jsx,tsx}'],
        plugins: {
            react: ReactPlugin,
            'react-hooks': ReactHooksPlugin,
        },
        rules: {
            ...ReactPlugin.configs.recommended.rules,
            ...ReactPlugin.configs['jsx-runtime'].rules,
            ...ReactHooksPlugin.configs.recommended.rules,
            'react/prop-types': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        ignores: [
            'public/build/**',
            'vendor/**',
            'node_modules/**',
            'bootstrap/cache/**',
            'storage/**',
        ],
    },
];
