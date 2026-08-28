import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { User } from './user.types';

const selectUser = createFeatureSelector<User>('user');

export const selectUserJwt = createSelector(selectUser, (state) => state?.jwt);
