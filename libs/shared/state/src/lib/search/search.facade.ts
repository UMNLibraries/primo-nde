import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { pcAvailabilityToggleChanged } from './search.actions';
import {
  selectDefaultPcAvailability,
  selectPcAvailability,
  selectSearchScope,
} from './search.selectors';

@Injectable({ providedIn: 'root' })
export class SearchFacade {
  private store = inject(Store);
  readonly searchScope = this.store.selectSignal(selectSearchScope);
  readonly pcAvailability = this.store.selectSignal(selectPcAvailability);
  readonly defaultPcAvailability = this.store.selectSignal(
    selectDefaultPcAvailability,
  );

  togglePcAvailability(value: boolean) {
    this.store.dispatch(
      pcAvailabilityToggleChanged({
        pcAvailabilityToggleValue: value,
      }),
    );
  }
}
