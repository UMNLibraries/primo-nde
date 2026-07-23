import { CreateNodesV2, createNodesFromFiles } from '@nx/devkit';
import { dirname, basename, join } from 'path';

export const createNodes: CreateNodesV2 = [
  'apps/views/*/project.json',
  async (configFiles, options, context) => {
    return await createNodesFromFiles(
      (projectConfigFile) => {
        const projectRoot = dirname(projectConfigFile);
        const viewName = basename(projectRoot);
        const outputPath = join('dist', projectRoot);
        const zipFilePath = join('dist', 'packages', `${viewName}.zip`);

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
                package: {
                  executor: 'nx:run-commands',
                  dependsOn: ['build'],
                  options: {
                    command: `node tools/scripts/zip-dist.mjs "${outputPath}" "${zipFilePath}"`,
                    parallel: false,
                  },
                  outputs: [`{workspaceRoot}/${zipFilePath}`],
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
