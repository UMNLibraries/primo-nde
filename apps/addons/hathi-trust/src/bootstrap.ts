import './app/component-mappings';
import { provideSampledHostLogger } from '@umn-nde/analytics';
import { bootstrapRemoteApp as originalBootstrap } from '@vendor/custom-module';
import { provideHttpClient } from '@angular/common/http';
import type { NgModule } from '@angular/core';
import type { Router } from '@angular/router';

interface BootstrapOptions {
  providers: NgModule['providers'];
  shellRouter: Router;
}

const customProviders = [
  provideHttpClient(),
  provideSampledHostLogger({
    sampleRate: 0.05,
    endpointPath: '/api/host',
    shouldLog: (remoteHostname) =>
      remoteHostname.endsWith('primo-nde-hathi-trust-addon.pages.dev'),
  }),
];

export const bootstrapRemoteApp = (bootstrapOptions: BootstrapOptions) => {
  const customOptions = {
    ...bootstrapOptions,
    providers: [...(bootstrapOptions.providers || []), ...customProviders],
  };

  return originalBootstrap(customOptions);
};
