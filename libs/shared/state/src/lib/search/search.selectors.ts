import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectQueryParam as selectRouterQueryParam } from '../router/router.selectors';
import {
  selectPrimoViewPcAvailabilityTabScopesMap,
  selectPrimoViewScopeIds,
  selectPrimoViewScopesMap,
} from '../view-config/view-config.selectors';
import { Search } from './search.types';

export const selectSearch = createFeatureSelector<Search>('Search');

export const selectSearchParams = createSelector(
  selectSearch,
  (state) => state?.searchParams,
);

export const selectScopeFromSearchParams = createSelector(
  selectSearchParams,
  (searchParams) => searchParams?.scope,
);

export const selectSearchScope = createSelector(
  selectScopeFromSearchParams,
  selectRouterQueryParam('search_scope'),
  selectPrimoViewScopeIds,
  (scopeFromSearchParams, scopeFromRouterQueryParams, allScopes) =>
    scopeFromSearchParams ?? scopeFromRouterQueryParams ?? allScopes?.[0],
);

export const selectPcAvailability = createSelector(
  selectSearchParams,
  selectRouterQueryParam('pcAvailability'),
  (searchParams, pcAvailabilityFromRouterQueryParams) =>
    (searchParams?.pcAvailability ??
    pcAvailabilityFromRouterQueryParams === undefined)
      ? undefined
      : pcAvailabilityFromRouterQueryParams === 'true',
);

export const selectDefaultPcAvailability = createSelector(
  selectSearchScope,
  selectPrimoViewScopesMap,
  selectPrimoViewPcAvailabilityTabScopesMap,
  (scope, scopesMap, pcAvailabilityTabScopesMap) => {
    const isPcScope = scopesMap?.find(
      (scopeObj) => scopeObj['scope-id'] === scope,
    )?.['contains-central-index-scope'];
    if (!isPcScope) {
      return undefined;
    }
    return pcAvailabilityTabScopesMap
      ? Object.values(pcAvailabilityTabScopesMap).some(
          (tab) => tab[scope] === 'INCLUDE_NO_FULL_TEXT',
        )
      : false;
  },
);
