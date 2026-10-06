import type { Provider } from '@angular/core';
import { ENVIRONMENT_INITIALIZER } from '@angular/core';
import { getRemoteModuleUrl } from './remote-url.util';

export interface SampledHostLoggerOptions {
  /** Relative endpoint path on the remote (e.g. '/api/log-host') */
  endpointPath?: string;
  /** Sampling rate between 0.0 and 1.0 */
  sampleRate?: number;
  /** Predicate function to gate logging based on remote module domain. */
  shouldLog?: (remoteHostname: string) => boolean;
}

export function provideSampledHostLogger({
  endpointPath = '/api/host',
  sampleRate = 0.05,
  shouldLog = (remoteHostname) => remoteHostname.endsWith('pages.dev'),
}: SampledHostLoggerOptions = {}): Provider[] {
  return [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        if (
          typeof window === 'undefined' ||
          typeof navigator === 'undefined' ||
          typeof navigator.sendBeacon !== 'function'
        ) {
          return;
        }

        const targetUrl = getRemoteModuleUrl(endpointPath);
        if (!shouldLog(targetUrl.hostname)) return;

        if (Math.random() > sampleRate) return;

        navigator.sendBeacon(targetUrl);
      },
    },
  ];
}
