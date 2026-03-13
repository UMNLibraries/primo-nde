const {
  share,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');
const path = require('path');
const { merge } = require('webpack-merge');

const mfConfig = withModuleFederationPlugin({
  name: 'customModule',
  filename: 'remoteEntry.js',
  exposes: {
    './custom-module': path.join(__dirname, './src/bootstrap.ts'),
  },
  shared: share({
    '@angular/core': { requiredVersion: 'auto' },
    '@angular/common': { requiredVersion: 'auto' },
    '@angular/router': { requiredVersion: 'auto' },
    '@angular/common/http': { requiredVersion: 'auto' },
    '@angular/platform-browser': { requiredVersion: 'auto' },
    '@ngx-translate/core': { singleton: true },
    '@ngrx/store': { singleton: true },
    'rxjs': { requiredVersion: 'auto' },
  }),
});

module.exports = (config, context) => {
  // can set/override custom config here (context is the nx ExecutorContext)
  const finalConfig = merge(config, mfConfig);
  //console.dir(finalConfig, { depth: null });
  return finalConfig;
};
