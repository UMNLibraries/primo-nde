import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectQueryParam as selectRouterQueryParam } from '../router/router.selectors';
import {
  selectPcScopeIds,
  selectPcScopeIdsWithNoFullText,
  selectPrimoViewScopeIds,
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
  selectPcScopeIds,
  selectPcScopeIdsWithNoFullText,
  (scope, pcScopeIds, pcScopeIdsWithNoFullText) => {
    if (!scope || !pcScopeIds.includes(scope)) return undefined;
    if (pcScopeIdsWithNoFullText?.includes(scope)) return true;
    return false;
  },
);
