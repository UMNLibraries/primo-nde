import { selectorComponentMap as baseSelectorComponentMap } from '@umn-nde/base-view';

/**
 * Map custom components to Primo NDE components here like so:
 * [["nde-component-name", MyComponent], ...]
 *
 * Webpack dynamically injects this module when the vendor AppModule imports:
 * `{selectorComponentMap} from "./custom1-module/customComponentMappings";`
 */
export const selectorComponentMap = new Map<string, unknown>([
  ...baseSelectorComponentMap,
]);
