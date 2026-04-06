import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ViewConfig } from './view-config.types';

export const selectViewConfig = createFeatureSelector<ViewConfig>('viewConfig');

export const selectIsSandbox = createSelector(selectViewConfig, (state) =>
  state?.config?.['system-configuration']?.hostLB.includes('-psb.')
);

export const selectViewId = createSelector(
  selectViewConfig,
  (state) => state.config.vid
);
