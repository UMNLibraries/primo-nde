import { Component, inject, Signal } from '@angular/core';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { View, ViewCode } from '../view-code';

interface ViewConfig {
  config: { vid: string };
}
interface Collection {
  library: { value: string };
}
interface CollectionDiscovery {
  collectionsTree: Collection[];
}

const selectViewConfig = createFeatureSelector<ViewConfig>('viewConfig');
const selectViewId = createSelector(
  selectViewConfig,
  (state) => state.config.vid
);
const selectCollectionDiscovery = createFeatureSelector<CollectionDiscovery>(
  'collectionDiscovery'
);
const selectCollectionsTree = createSelector(
  selectCollectionDiscovery,
  (state) => state.collectionsTree
);

function collectionFilterFor(view: ViewCode) {
  switch (view) {
    case View.CROOKSTON:
      return (collection: Collection) =>
        collection.library.value.startsWith('C');
    case View.DULUTH:
      return (collection: Collection) =>
        collection.library.value.startsWith('D');
    case View.MORRIS:
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
export class FilteredCollectionDiscoveryContainer {
  private store = inject(Store);

  constructor() {
    const vid = this.store.selectSignal(selectViewId);
    const collections = this.store.selectSignal(selectCollectionsTree);
    const filterFn = collectionFilterFor(vid() as ViewCode);

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
