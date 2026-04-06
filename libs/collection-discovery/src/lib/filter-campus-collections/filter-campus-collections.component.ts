import { Component, inject } from '@angular/core';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import {
  UmnView,
  UmnViewCode,
  ViewConfigFacade,
} from '@umn-nde/shared-state/view-config';

interface Collection {
  library: { value: string };
}
interface CollectionDiscovery {
  collectionsTree: Collection[];
}

const selectCollectionDiscovery = createFeatureSelector<CollectionDiscovery>(
  'collectionDiscovery'
);
const selectCollectionsTree = createSelector(
  selectCollectionDiscovery,
  (state) => state.collectionsTree
);

function collectionFilterFor(view: UmnViewCode) {
  switch (view) {
    case UmnView.CROOKSTON:
      return (collection: Collection) =>
        collection.library.value.startsWith('C');
    case UmnView.DULUTH:
      return (collection: Collection) =>
        collection.library.value.startsWith('D');
    case UmnView.MORRIS:
      return (collection: Collection) =>
        collection.library.value.startsWith('M');
    default: // assume Twin Cites by default
      return (collection: Collection) =>
        collection.library.value.startsWith('T');
  }
}

/**
 * Remove collections from the store that are not associated with the current
 * campus view.
 */
@Component({
  template: '',
})
export class FilterCampusCollectionsComponent {
  private store = inject(Store);
  private viewConfigFacade = inject(ViewConfigFacade);

  constructor() {
    const vid = this.viewConfigFacade.vid;
    const collections = this.store.selectSignal(selectCollectionsTree);
    const filterFn = collectionFilterFor(vid() as UmnViewCode);

    this.store.dispatch({
      type: '[Collection Discovery] Get Collections Tree Success',
      collections: collections().filter(filterFn),
    });

    /**
     * Note: Dispatching this action just once seems sufficient for now, but it
     * might turn out that we need to do something more robust, e.g.:
     * const collections$ = this.store.select(selectCollectionsTree);
     * collections$.pipe(takeUntilDestroyed(), pairwise(), filter(([prev, curr]) => ...))
     */
  }
}
