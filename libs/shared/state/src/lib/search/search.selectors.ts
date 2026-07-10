import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  selectPrimoViewScopeIds,
  selectShowPcAvailability,
} from '../view-config/view-config.selectors';
import { Search } from './search.types';
import { selectQueryParam as selectRouterQueryParam } from '../router/router.selectors';

export const selectSearch = createFeatureSelector<Search>('Search');

export const selectSearchParams = createSelector(
  selectSearch,
  (state) => state?.searchParams
);

export const selectScopeFromSearchParams = createSelector(
  selectSearchParams,
  (searchParams) => searchParams?.scope
);

export const selectSearchScope = createSelector(
  selectScopeFromSearchParams,
  selectRouterQueryParam('search_scope'),
  selectPrimoViewScopeIds,
  (scopeFromSearchParams, scopeFromRouterQueryParams, allScopes) =>
    scopeFromSearchParams ?? scopeFromRouterQueryParams ?? allScopes?.[0]
);

export const selectPcAvailabilityToggleValue = (scope: string) =>
  createSelector(
    selectSearch,
    selectShowPcAvailability(scope),
    (state, showPcAvailabilityForScope) => {
      if (!showPcAvailabilityForScope) {
        return true;
      } else {
        return state.pcAvailabilityToggleValue;
      }
    }
  );
