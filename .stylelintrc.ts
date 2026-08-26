import type { Config } from 'stylelint';

export default {
  extends: ['stylelint-config-standard-scss'],
  allowEmptyInput: true,
  ignoreFiles: ['**/_m3-theme.scss'],
  referenceFiles: {
    files: ['libs/base-view/src/styles/theme/_customized-theme.scss'],
    customSyntax: 'postcss-scss',
  },
  rules: {
    'color-hex-length': 'long',
    'no-unknown-custom-properties': true,
    // Allow both kebab-case and camelCase for custom properties.
    // The former should be preferred, but the latter is used in
    // some parts of the Primo NDE host app.
    'custom-property-pattern':
      '^(?:[a-z]+(?:[A-Z][a-z]*)*|[a-z]+(?:-[a-z]+)*)$',
  },
} satisfies Config;
