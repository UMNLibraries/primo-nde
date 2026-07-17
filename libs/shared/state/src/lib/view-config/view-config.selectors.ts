import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ViewConfig } from './view-config.types';

export const selectViewConfig = createFeatureSelector<ViewConfig>('viewConfig');

export const selectPrimoView = createSelector(
  selectViewConfig,
  (state) => state?.config?.['primo-view'],
);

export const selectPrimoViewScopesMap = createSelector(
  selectPrimoView,
  (primoView) => primoView?.scopes,
);

export const selectPrimoViewPcAvailabilityTabScopesMap = createSelector(
  selectPrimoView,
  (primoView) => primoView?.['pc-availability-tab-scopes-map'],
);

export const selectPrimoViewScopeIds = createSelector(
  selectPrimoView,
  (primoView) => primoView?.scopes.map((scope) => scope['scope-id']),
);

export const selectDefaultScope = createSelector(
  selectPrimoViewScopeIds,
  (scopes) => scopes?.[0],
);

export const selectPcScopeIds = createSelector(
  selectPrimoViewScopesMap,
  (scopes) =>
    scopes
      ?.filter((scope) => scope['contains-central-index-scope'] === true)
      .map((scope) => scope['scope-id']),
);

export const selectPcScopeIdsWithNoFullText = createSelector(
  selectPrimoViewPcAvailabilityTabScopesMap,
  (pcAvailabilityTabScopesMap) => {
    if (!pcAvailabilityTabScopesMap) return [];
    return Object.values(pcAvailabilityTabScopesMap)
      .flatMap((scopeAvailability) => Object.entries(scopeAvailability))
      .filter(([, availability]) => availability === 'INCLUDE_NO_FULL_TEXT')
      .map(([scopeId]) => scopeId);
  },
);

export const selectSystemConfiguration = createSelector(
  selectViewConfig,
  (state) => state?.config?.['system-configuration'],
);

export const selectSystemConfigurationValue = <
  K extends keyof ViewConfig['config']['system-configuration'],
>(
  key: K,
) =>
  createSelector(
    selectSystemConfiguration,
    (systemConfiguration) => systemConfiguration?.[key],
  );

export const selectIsSandbox = createSelector(
  selectSystemConfigurationValue('hostLB'),
  (hostLB) => hostLB.includes('-psb.'),
);

export const selectViewId = createSelector(
  selectViewConfig,
  (state) => state.config.vid,
);

// TODO: there's a good chance that these Rapido selectors will not be needed.

export const selectHideRapidoExpandLinkMap = createSelector(
  selectSystemConfigurationValue('hide_rapido_expand_link_map'),
  (hideRapidoExpandLinkMap) => hideRapidoExpandLinkMap,
);

export const selectHideRapidoExpandLinkEnabled = (key: string) =>
  createSelector(
    selectHideRapidoExpandLinkMap,
    (hideRapidoExpandLinkMap) => hideRapidoExpandLinkMap?.[key] ?? false,
  );
