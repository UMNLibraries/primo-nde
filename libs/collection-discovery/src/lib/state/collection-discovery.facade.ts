import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { selectCollectionsTreeForView } from './collection-discovery.selectors';
import { getCollectionsTreeSuccessAction } from './collection-discovery.actions';

@Injectable({
  providedIn: 'root',
})
export class CollectionDiscoveryFacade {
  private store = inject(Store);

  /**
   * Updates the collection tree state, removing any collections that to not
   * belong to the current campus view. This is an ugly workaround to cope
   * multi-campus limitations in Primo VE.
   *
   * Note: Dispatching this action just once seems sufficient for now, but it
   * might turn out that we need to do something more robust, e.g.:
   * const collections$ = this.store.select(selectCollectionsTree);
   * collections$.pipe(takeUntilDestroyed(), pairwise(), filter(([prev, curr]) => ...))
   */
  filterCollectionsForView() {
    this.store
      .select(selectCollectionsTreeForView)
      .pipe(take(1))
      .subscribe((collections) =>
        this.store.dispatch(getCollectionsTreeSuccessAction({ collections }))
      );
  }
}
