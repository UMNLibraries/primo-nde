import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CollectionDiscoveryFacade } from './collection-discovery.facade';
import * as CollectionDiscoverySelectors from './collection-discovery.selectors';
import * as CollectionDiscoveryActions from './collection-discovery.actions';

describe('CollectionDiscoveryFacade', () => {
  let facade: CollectionDiscoveryFacade;
  let store: MockStore;

  // just need a dummy object to verify it gets passed through.
  const dummyCollections = [
    { library: { value: 'TWILS' } }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CollectionDiscoveryFacade,
        provideMockStore(), 
      ],
    });

    facade = TestBed.inject(CollectionDiscoveryFacade);
    store = TestBed.inject(MockStore);

    vi.spyOn(store, 'dispatch');
  });

  it('should dispatch the filtered collections back to the store', () => {
    store.overrideSelector(
      CollectionDiscoverySelectors.selectCollectionsTreeForView,
      dummyCollections
    );

    facade.filterCollectionsForView();

    expect(store.dispatch).toHaveBeenCalledWith(
      CollectionDiscoveryActions.getCollectionsTreeSuccessAction({
        collections: dummyCollections
      })
    );
  });
});
