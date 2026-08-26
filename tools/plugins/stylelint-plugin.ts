import { createNodesFromFiles, CreateNodesV2 } from '@nx/devkit';
import { dirname } from 'node:path';

export const createNodesV2: CreateNodesV2 = [
  '{apps,libs}/**/project.json',
  (configFiles, options, context) =>
    createNodesFromFiles(
      (projectConfigFile) => {
        const projectRoot = dirname(projectConfigFile);

        if (projectRoot.startsWith('libs/vendor')) {
          return {};
        }

        return {
          projects: {
            [projectRoot]: {
              targets: {
                stylelint: {
                  executor: 'nx:run-commands',
                  options: {
                    command: `npx stylelint "${projectRoot}/**/*.scss"`,
                    parallel: false,
                  },
                  inputs: [
                    'default',
                    '{workspaceRoot}/.stylelintrc.ts',
                    // forces nx to invalidate the cache when the theme is changed
                    '{workspaceRoot}/libs/base-view/src/styles/theme/_customized-theme.scss',
                  ],
                  cache: true,
                },
              },
            },
          },
        };
      },
      configFiles,
      options,
      context,
    ),
];
