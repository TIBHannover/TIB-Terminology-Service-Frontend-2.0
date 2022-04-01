module.exports = {
    env: {
      browser: true,
      es2021: true,
      jest: true
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    extends: [
      'standard',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:jsx-a11y/recommended'
  
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      },
      ecmaVersion: 12,
      sourceType: 'module'
    },
    plugins: [
      'react',
      '@typescript-eslint',
      'react-hooks',
      'jsx-a11y',
      'jest'
    ],
    ignorePatterns: ['src/components/search/parser/simpleQueryDSL*.ts'],
    rules: {
      'no-use-before-define': 'off', // we don't use that rule, we use TS.
      '@typescript-eslint/no-use-before-define': 'warn', // @TODO: change to error
      'no-multi-str': 'off', // we allow multi line stins
      'react/prop-types': 'off', // we don't use prop-types
      'react/jsx-uses-react': 'off', // disable rule
      'react/jsx-uses-vars': 'off', // disable rule
      'react/react-in-jsx-scope': 'off', // disable rule
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }], // limit file suffix with jsx code
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/display-name': 'off', // #TODO: enable all rules below...
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/explsicit-module-boundary-types': 'off',
      'node/handle-callback-err': 'off',
      'no-useless-escape': 'off',
      camelcase: 'off',
      'prefer-const': 'warn',
      'no-undef': 'off'
    }
  }
  