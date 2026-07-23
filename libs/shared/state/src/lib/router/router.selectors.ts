import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Router } from './router.types';

export const selectRouter = createFeatureSelector<Router>('router');

export const selectQueryParams = createSelector(
  selectRouter,
  (router) => router?.state?.root?.queryParams,
);

export const selectQueryParam = (param: string) =>
  createSelector(selectQueryParams, (queryParams) => queryParams?.[param]);
