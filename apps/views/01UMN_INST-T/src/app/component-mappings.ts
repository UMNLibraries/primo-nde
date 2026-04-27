import { selectorComponentMap as baseSelectorComponentMap } from '@umn-nde/base-view';
import { TwinCitiesProblemReportLinkComponent } from './tc-problem-report-link.component';
import {
  IllRequestsComponent,
  DigitalDeliveryComponent,
} from '@umn-nde/account';

/**
 * Map custom components to Primo NDE components here.
 *
 * *IMPORTANT NOTE*
 * Webpack dynamically injects this module when the vendor AppModule imports:
 * `{selectorComponentMap} from "./custom1-module/customComponentMappings";`
 */
export const selectorComponentMap: typeof baseSelectorComponentMap = new Map([
  ...baseSelectorComponentMap,
  ['nde-requests-overview-after', IllRequestsComponent],
  ['nde-loans-overview-after', DigitalDeliveryComponent],
  ['nde-view-it-after', TwinCitiesProblemReportLinkComponent],
]);
