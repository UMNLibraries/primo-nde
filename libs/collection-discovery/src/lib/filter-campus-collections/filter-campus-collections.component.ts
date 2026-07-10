import { Component, inject } from '@angular/core';
import { CollectionDiscoveryFacade } from '@umn-nde/shared-state';

/**
 * Remove collections from the store that are not associated with the current
 * campus view.
 */
@Component({
  template: '',
})
export class FilterCampusCollectionsComponent {
  private collectionDiscoveryFacade = inject(CollectionDiscoveryFacade);

  constructor() {
    this.collectionDiscoveryFacade.filterCollectionsForView();
  }
}
