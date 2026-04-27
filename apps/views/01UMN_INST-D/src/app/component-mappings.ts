import { selectorComponentMap as baseSelectorComponentMap } from '@umn-nde/base-view';
import { DuluthProblemReportLinkComponent } from './duluth-problem-report-link.component';

/**
 * Map custom components to Primo NDE components here.
 *
 * *IMPORTANT NOTE*
 * Webpack dynamically injects this module when the vendor AppModule imports:
 * `{selectorComponentMap} from "./custom1-module/customComponentMappings";`
 */
export const selectorComponentMap: typeof baseSelectorComponentMap = new Map([
  ...baseSelectorComponentMap,
  ['nde-view-it-after', DuluthProblemReportLinkComponent],
]);
