import { createProjectGraphAsync } from '@nx/devkit';
import fs from 'node:fs';
import path from 'node:path';
import {
  collectManifestFromDirectory,
  createMergedAssetManifest,
  getAssetRelativePath,
} from '../../libs/vendor/custom-module/proxy/proxy-utils.mjs';

const projectAssetEntries = await getAssetEntries();

/**
 * Returns an array of asset entries for the current nx project, including both
 * build assets and distribution assets.
 *
 * assetEntries is an array of objects with the following structure:
 * {
 *   root: string; // the absolute path to the asset directory
 *   type: 'source' | 'dist';
 *   manifestBase: string; // the base path for the asset in the manifest
 * }
 */
async function getAssetEntries(
  workspaceRoot = process.env.NX_WORKSPACE_ROOT,
  projectName = process.env.NX_TASK_TARGET_PROJECT,
) {
  if (!workspaceRoot)
    throw new Error('NX_WORKSPACE_ROOT environment variable is not set.');

  if (!projectName)
    throw new Error('NX_TASK_TARGET_PROJECT environment variable is not set.');

  const projectConfig = await createProjectGraphAsync().then(
    (projectGraph) => projectGraph.nodes[projectName],
  );
  const sourceAssetPaths = (
    projectConfig.data.targets?.build?.options?.assets?.map((asset) =>
      path.join(workspaceRoot, asset.input),
    ) ?? []
  ).toReversed(); // prioritize the last assets first
  const distPath = path.join(
    workspaceRoot,
    projectConfig.data.targets?.build?.options?.outputPath,
  );
  const assetEntries = [
    ...sourceAssetPaths.map((assetPath) => ({
      root: assetPath,
      type: 'source',
      manifestBase: 'assets',
    })),
    { root: distPath, type: 'dist', manifestBase: '' },
  ];

  return assetEntries;
}

const assetContentTypes = {
  '.css': 'text/css',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

export function getAssetContentType(filePath) {
  return (
    assetContentTypes[path.extname(filePath).toLowerCase()] ||
    'application/octet-stream'
  );
}

function toSafePath(assetRelativePath) {
  return assetRelativePath
    .split('/')
    .filter((segment) => segment && segment !== '.' && segment !== '..')
    .join(path.sep);
}

/**
 * Override vendor implementation
 */
export function resolveLocalAssetFilePath(
  requestPath,
  entries = projectAssetEntries,
) {
  const relativePath = getAssetRelativePath(requestPath);
  if (!relativePath) return null;

  const safeRelativePath = toSafePath(relativePath);
  if (!safeRelativePath) return null;

  const candidates = entries.map((entry) =>
    path.join(entry.root, safeRelativePath),
  );

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

/**
 * Override vendor implementation
 */
export function createLocalAssetManifest(entries = projectAssetEntries) {
  const manifests = [];

  console.debug('Creating local asset manifest from entries:', entries);

  for (const entry of entries) {
    if (!fs.existsSync(entry.root) || !fs.statSync(entry.root).isDirectory()) {
      continue;
    }

    manifests.push(
      collectManifestFromDirectory(entry.root, entry.manifestBase),
    );
  }

  return createMergedAssetManifest(manifests);
}
