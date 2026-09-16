const {
  share,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const JSON5 = require('json5');

// Libs that must NOT be auto-shared (each remote gets its own copy).
const EXCLUDED_FROM_SHARING = new Set([
  '@vendor/custom-module', // avoids issues with component-mappings replacement
]);

// Normally the withModuleFederationPlugin() helper will auto-share all libs in
// the workspace, but we want to exclude some libs (see EXCLUDED_FROM_SHARING).
// This is a workaround for an issue with the NormalModuleReplacementPlugin.
function getWorkspaceSharedMappings() {
  const tsconfigPath = path.resolve(__dirname, '../../tsconfig.base.json');
  const tsconfig = JSON5.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
  const paths = tsconfig.compilerOptions?.paths ?? {};
  return Object.keys(paths).filter(
    (key) => !key.includes('*') && !EXCLUDED_FROM_SHARING.has(key),
  );
}

module.exports = (config, context) => {
  // can set/override custom config here (context is the nx ExecutorContext)

  const projectRoot = path.dirname(context.tsConfig);
  const mfName = process.env.ADDON_NAME ?? 'customModule';
  const mfExposesKey = `./${process.env.ADDON_NAME ?? 'custom-module'}`;

  const mfConfig = withModuleFederationPlugin({
    name: mfName,
    filename: 'remoteEntry.js',
    exposes: {
      [mfExposesKey]: `${projectRoot}/src/bootstrap.ts`,
    },
    sharedMappings: getWorkspaceSharedMappings(),
    shared: share({
      rxjs: { requiredVersion: 'auto' },
      '@angular/core': { requiredVersion: 'auto' },
      '@angular/common': { requiredVersion: 'auto' },
      '@angular/router': { requiredVersion: 'auto' },
      '@angular/common/http': { requiredVersion: 'auto' },
      '@angular/platform-browser': { requiredVersion: 'auto' },
      '@ngx-translate/core': { singleton: true },
      '@ngrx/store': { singleton: true },
    }),
  });

  // Replace vendor component mappings with local mappings module.
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /custom1-module\/customComponentMappings/,
      `${projectRoot}/src/app/component-mappings.ts`,
    ),
  );

  // Declare shared-state lib as side-effect free (tree shaking optimization)
  config.module.rules.push({
    include: [/libs\/shared\/state/],
    sideEffects: false,
  });

  // console.dir(config, { depth: null });
  // console.dir(context, { depth: null });

  return merge(config, mfConfig);
};
