import { createNodesFromFiles, CreateNodesV2 } from '@nx/devkit';
import { dirname } from 'path';

export const createNodes: CreateNodesV2 = [
  '**/*-e2e/project.json',
  async (configFiles, options, context) => {
    return await createNodesFromFiles(
      (projectConfigFile) => {
        const projectRoot = dirname(projectConfigFile);

        return {
          projects: {
            [projectRoot]: {
              targets: {
                build: {
                  executor: 'nx:run-commands',
                  options: {
                    command: `mkdir -p dist/${projectRoot} && echo "Dummy e2e build complete."`,
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
