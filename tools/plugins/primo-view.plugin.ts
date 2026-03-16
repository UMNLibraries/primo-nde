import { CreateNodesV2, createNodesFromFiles } from '@nx/devkit';
import { dirname } from 'path';

export const createNodes: CreateNodesV2 = [
  'views/*/project.json',
  async (configFiles, options, context) => {
    return await createNodesFromFiles(
      (projectConfigFile) => {
        const projectRoot = dirname(projectConfigFile);

        return {
          projects: {
            [projectRoot]: {
              implicitDependencies: ['base-view'],
              targets: {
                build: {
                  options: {
                    customWebpackConfig: {
                      path: 'tools/webpack/webpack.config.js',
                    },
                    assets: [
                      // views inherit assets from the base-view
                      {
                        glob: '**/*',
                        input: 'libs/base-view/src/assets',
                        output: 'assets',
                      },
                      {
                        glob: '**/*',
                        input: `${projectRoot}/src/assets`,
                        output: 'assets',
                      },
                    ],
                  },
                },
              },
            },
          },
        };
      },
      configFiles,
      options,
      context
    );
  },
];
