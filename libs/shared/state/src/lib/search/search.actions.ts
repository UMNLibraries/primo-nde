import { createAction, props } from '@ngrx/store';

/**
 * Primo app side effects:
 * 1. Set the pcAvailability query param in the URL to the new value
 * 2. Trigger a new search with the new pcAvailability value
 */
export const pcAvailabilityToggleChanged = createAction(
  '[Filter Side Bar] Expand My Results toggle pressed',
  props<{ pcAvailabilityToggleValue: boolean }>(),
);
