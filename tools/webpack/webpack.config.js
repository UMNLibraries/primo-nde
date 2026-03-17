const {
  share,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');

module.exports = (config, context) => {
  // can set/override custom config here (context is the nx ExecutorContext)
  //console.dir(config, { depth: null });
  //console.dir(context, { depth: null });

  const projectRoot = path.dirname(context.tsConfig);

  const mfConfig = withModuleFederationPlugin({
    name: 'customModule',
    filename: 'remoteEntry.js',
    exposes: {
      './custom-module': `${projectRoot}/src/bootstrap.ts`,
    },
    shared: share({
      '@angular/core': { requiredVersion: 'auto' },
      '@angular/common': { requiredVersion: 'auto' },
      '@angular/router': { requiredVersion: 'auto' },
      '@angular/common/http': { requiredVersion: 'auto' },
      '@angular/platform-browser': { requiredVersion: 'auto' },
      '@ngx-translate/core': { singleton: true },
      '@ngrx/store': { singleton: true },
      rxjs: { requiredVersion: 'auto' },
    }),
  });

  // replace vendor component mappings with local mappings module
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /custom1-module\/customComponentMappings/,
      `${projectRoot}/src/component-mappings.ts`
    )
  );

  return merge(config, mfConfig);
};
