import { CreateNodesV2, createNodesFromFiles } from '@nx/devkit';
import { dirname } from 'path';

export const createNodes: CreateNodesV2 = [
  'apps/addons/*/project.json',
  async (configFiles, options, context) => {
    return await createNodesFromFiles(
      (projectConfigFile) => {
        const projectRoot = dirname(projectConfigFile);

        return {
          projects: {
            [projectRoot]: {
              targets: {
                build: {
                  dependsOn: ['typegen'],
                  options: {
                    customWebpackConfig: {
                      path: 'tools/webpack/webpack.config.js',
                    },
                    assets: [
                      {
                        glob: '**/*',
                        input: `${projectRoot}/src/assets`,
                        output: 'assets',
                      },
                      {
                        glob: '**/*',
                        input: `${projectRoot}/public`,
                      },
                    ],
                  },
                },
                deploy: {
                  dependsOn: ['build'],
                  executor: 'nx:run-commands',
                  options: {
                    command: 'wrangler pages deploy --cwd={projectRoot}',
                  },
                },
                typegen: {
                  executor: 'nx:run-commands',
                  options: {
                    cwd: '{projectRoot}',
                    command: 'wrangler types --env-interface Env',
                  },
                },
              },
            },
          },
        };
      },
      configFiles,
      options,
      context,
    );
  },
];
