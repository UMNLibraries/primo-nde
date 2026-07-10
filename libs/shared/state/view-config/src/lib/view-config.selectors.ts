import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ViewConfig } from './view-config.types';

export const selectViewConfig = createFeatureSelector<ViewConfig>('viewConfig');

export const selectPrimoView = createSelector(
  selectViewConfig,
  (state) => state?.config?.['primo-view']
);

export const selectPrimoViewPcAvailabilityTabScopesMap = createSelector(
  selectPrimoView,
  (primoView) => primoView?.['pc-availability-tab-scopes-map']
);

export const selectPrimoViewScopeIds = createSelector(
  selectPrimoView,
  (primoView) => primoView?.scopes.map((scope) => scope['scope-id'])
);

export const selectDefaultScope = createSelector(
  selectPrimoViewScopeIds,
  (scopes) => scopes?.[0]
);

export const selectShowPcAvailability = (scope: string) =>
  createSelector(
    selectPrimoViewPcAvailabilityTabScopesMap,
    (pcAvailabilityTabScopesMap) => {
      return pcAvailabilityTabScopesMap
        ? Object.values(pcAvailabilityTabScopesMap).some(
            (tab) => tab[scope] === 'AVAILABLE_ONLY'
          )
        : false;
    }
  );

export const selectSystemConfiguration = createSelector(
  selectViewConfig,
  (state) => state?.config?.['system-configuration']
);

export const selectSystemConfigurationValue = <
  K extends keyof ViewConfig['config']['system-configuration']
>(
  key: K
) =>
  createSelector(
    selectSystemConfiguration,
    (systemConfiguration) => systemConfiguration?.[key]
  );

export const selectIsSandbox = createSelector(
  selectSystemConfigurationValue('hostLB'),
  (hostLB) => hostLB.includes('-psb.')
);

export const selectViewId = createSelector(
  selectViewConfig,
  (state) => state.config.vid
);

export const selectHideRapidoExpandLinkMap = createSelector(
  selectSystemConfigurationValue('hide_rapido_expand_link_map'),
  (hideRapidoExpandLinkMap) => hideRapidoExpandLinkMap
);

export const selectHideRapidoExpandLinkEnabled = (key: string) =>
  createSelector(
    selectHideRapidoExpandLinkMap,
    (hideRapidoExpandLinkMap) => hideRapidoExpandLinkMap?.[key] ?? false
  );
