import { selectorComponentMap as baseSelectorComponentMap } from '@umn-nde/base-view';
import { DuluthReportBrokenLinkComponent } from './duluth-report-broken-link.component';

/**
 * Map custom components to Primo NDE components here.
 *
 * *IMPORTANT NOTE*
 * Webpack dynamically injects this module when the vendor AppModule imports:
 * `{selectorComponentMap} from "./custom1-module/customComponentMappings";`
 */
export const selectorComponentMap = new Map<string, unknown>([
  ...baseSelectorComponentMap,
  ['nde-view-it-after', DuluthReportBrokenLinkComponent],
]);
