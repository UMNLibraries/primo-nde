import fs from 'node:fs';
import { PROXY_TARGET } from '../../libs/vendor/custom-module/proxy/proxy.const.mjs';
import {
  deepMerge,
  proxyAgent,
} from '../../libs/vendor/custom-module/proxy/proxy-utils.mjs';
import vendorProxyRules from '../../libs/vendor/custom-module/proxy/proxy.conf.mjs';
import {
  createLocalAssetManifest,
  getAssetContentType,
  resolveLocalAssetFilePath,
} from './assets.mjs';

function isManifestRule(rule) {
  const contexts = Array.isArray(rule.context) ? rule.context : [rule.context];
  return (
    contexts.includes('/custom/*/asset-manifest.json') ||
    contexts.includes('/nde/custom/*/asset-manifest.json')
  );
}

function isAssetRule(rule) {
  const contexts = Array.isArray(rule.context) ? rule.context : [rule.context];
  return (
    contexts.includes('/custom/*/assets') ||
    contexts.includes('/custom/*/assets/**')
  );
}

const vendorRulesWithoutOverrides = vendorProxyRules.filter(
  (rule) => !isAssetRule(rule) && !isManifestRule(rule),
);

const customProxyRules = [
  {
    // redirect external login requests
    context: ['/primaws/suprimaExtLogin'],
    target: PROXY_TARGET,
    changeOrigin: true,
    followRedirects: true,
    onProxyReq(_proxyReq, req, res) {
      res.writeHead(302, { location: PROXY_TARGET + req.url });
    },
  },
  {
    // custom version of vendor's local asset rule, adapted for this workspace
    context: [
      '/custom/*/assets',
      '/custom/*/assets/**',
      '/nde/custom/*/assets',
      '/nde/custom/*/assets/**',
    ],
    target: PROXY_TARGET,
    agent: proxyAgent,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    bypass(req, res) {
      const localFilePath = resolveLocalAssetFilePath(req.url);
      if (!localFilePath) {
        return null;
      }

      if (process.env.PROXY_TRACE) {
        console.log(`[asset-trace] ${req.url} -> LOCAL ${localFilePath}`);
      }

      res.writeHead(200, {
        'content-type': getAssetContentType(localFilePath),
        'cache-control': 'no-cache',
      });
      res.end(fs.readFileSync(localFilePath));
      return true;
    },
  },
  {
    // custom version of vendor's local asset manifest rule, adapted for this workspace
    context: [
      '/custom/*/asset-manifest.json',
      '/nde/custom/*/asset-manifest.json',
    ],
    target: PROXY_TARGET,
    agent: proxyAgent,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    selfHandleResponse: true,
    onProxyRes(proxyRes, _req, res) {
      const chunks = [];
      proxyRes.on('data', (chunk) => chunks.push(chunk));
      proxyRes.on('end', () => {
        const localManifest = createLocalAssetManifest();
        const body = Buffer.concat(chunks).toString('utf8');
        const statusCode = proxyRes.statusCode || 200;

        if (statusCode >= 200 && statusCode < 300 && body) {
          try {
            const remoteManifest = JSON.parse(body);
            const mergedManifest = deepMerge(remoteManifest, localManifest);
            if (process.env.PROXY_TRACE) {
              console.log(
                '[manifest] merged manifest payload=',
                JSON.stringify(mergedManifest, null, 2),
              );
            }
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(mergedManifest));
            return;
          } catch (error) {
            console.warn(
              `[manifest] failed to parse remote manifest: ${error.message}`,
            );
          }
        }

        if (process.env.PROXY_TRACE) {
          console.log(
            '[manifest] local manifest fallback payload=',
            JSON.stringify(localManifest, null, 2),
          );
        }
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(localManifest));
      });
    },
  },
];

export default [...customProxyRules, ...vendorRulesWithoutOverrides];
