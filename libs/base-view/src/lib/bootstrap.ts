import { bootstrapRemoteApp as originalBootstrap } from '@vendor/custom-module';
import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';

interface BootstrapOptions {
  providers: NgModule['providers'];
  shellRouter: Router;
}

const customProviders = [provideHttpClient()];

export const bootstrapRemoteApp = (bootstrapOptions: BootstrapOptions) => {
  const customOptions = {
    ...bootstrapOptions,
    providers: [...(bootstrapOptions.providers || []), ...customProviders],
  };

  return originalBootstrap(customOptions);

  /*
  to perform any custom initialization, we could do something like this:

  return originalBootstrap(enrichedOptions).then(moduleRef => {
    try {
      const someService = moduleRef.injector.get(SomeService);
      someService.init();
    } catch (e) {
      console.error('SomeService failed to initialize', e);
    }

    return moduleRef;
  });
  */
};
