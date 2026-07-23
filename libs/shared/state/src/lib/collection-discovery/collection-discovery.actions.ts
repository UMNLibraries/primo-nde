import { createAction, props } from '@ngrx/store';
import { Collection } from './collection-discovery.types';

export const getCollectionsTreeSuccessAction = createAction(
  '[Collection Discovery] Get Collections Tree Success',
  props<{ collections: Collection[] }>(),
);
