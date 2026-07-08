import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectHideRapidoExpandLinkEnabled,
  selectIsSandbox,
  selectViewId,
} from './view-config.selectors';

@Injectable({ providedIn: 'root' })
export class ViewConfigFacade {
  private store = inject(Store);
  readonly isSandbox = this.store.selectSignal(selectIsSandbox);
  readonly vid = this.store.selectSignal(selectViewId);

  isExpandedByDefault(searchSlot: string): boolean {
    return this.store.selectSignal(
      selectHideRapidoExpandLinkEnabled(searchSlot)
    )();
  }
}
