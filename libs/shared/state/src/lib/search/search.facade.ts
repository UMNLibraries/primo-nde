import { Injectable, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectSearchScope,
  selectPcAvailabilityToggleValue,
} from './search.selectors';

@Injectable({ providedIn: 'root' })
export class SearchFacade {
  private store = inject(Store);

  searchScope = this.store.selectSignal(selectSearchScope);
  pcAvailability = computed(
    this.store.selectSignal(selectPcAvailabilityToggleValue(this.searchScope()))
  );
}
