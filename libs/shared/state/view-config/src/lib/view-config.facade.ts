import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsSandbox, selectViewId } from './view-config.selector';

@Injectable({ providedIn: 'root' })
export class ViewConfigFacade {
  private store = inject(Store);
  readonly isSandbox = this.store.selectSignal(selectIsSandbox);
  readonly vid = this.store.selectSignal(selectViewId);
}
