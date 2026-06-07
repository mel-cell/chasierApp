import js from '@eslint/js';
import globals from 'globals';
import ReactPlugin from 'eslint-plugin-react';
import ReactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
    js.configs.recommended,
    {
        files: ['resources/js/**/*.{js,jsx}'],
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
        files: ['resources/js/**/*.{js,jsx}'],
        plugins: {
            react: ReactPlugin,
            'react-hooks': ReactHooksPlugin,
        },
        rules: {
            ...ReactPlugin.configs.recommended.rules,
            ...ReactPlugin.configs['jsx-runtime'].rules,
            ...ReactHooksPlugin.configs.recommended.rules,
            'react/prop-types': 'off',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
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
