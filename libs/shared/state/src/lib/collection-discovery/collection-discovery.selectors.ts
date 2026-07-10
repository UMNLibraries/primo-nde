import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectionDiscovery } from './collection-discovery.types';
import { selectViewId } from '../view-config/view-config.selectors';
import { UmnView } from '../view-config/umn-view.types';


export const selectCollectionDiscovery =
  createFeatureSelector<CollectionDiscovery>('collectionDiscovery');

export const selectCollectionsTree = createSelector(
  selectCollectionDiscovery,
  (state) => state.collectionsTree
);

export const selectCollectionsTreeForView = createSelector(
  selectCollectionsTree,
  selectViewId,
  (collections, view) => {
    switch (view) {
      case UmnView.CROOKSTON:
        return collections.filter((collection) =>
          collection.library.value.startsWith('C')
        );
      case UmnView.DULUTH:
        return collections.filter((collection) =>
          collection.library.value.startsWith('D')
        );
      case UmnView.MORRIS:
        return collections.filter((collection) =>
          collection.library.value.startsWith('M')
        );
      default: // assume Twin Cities by default
        return collections.filter((collection) =>
          collection.library.value.startsWith('T')
        );
    }
  }
);
