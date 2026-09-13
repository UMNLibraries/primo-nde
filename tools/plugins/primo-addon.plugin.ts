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
                  command:
                    'wrangler pages deploy dist/{projectRoot} --project-name=primo-nde-{projectName}',
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
