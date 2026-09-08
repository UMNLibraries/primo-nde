import type { Type } from '@angular/core';
import { FilterRequestPickupLocationsComponent } from '@umn-nde/filter-pickup-locations';
import { FilterCampusCollectionsComponent } from '@umn-nde/filter-campus-collections';
import { ExcludeBeyondComponent } from '@umn-nde/exclude-beyond-filter';
import { HathiTrustComponent } from '@umn-nde/hathi-truse';

type NdeSelector = `nde-${string}`;

// Define component mappings that are common to all views
export const selectorComponentMap = new Map<NdeSelector, Type<object>>([
  [
    'nde-collection-discovery-container-before',
    FilterCampusCollectionsComponent,
  ],
  ['nde-requests-after', FilterRequestPickupLocationsComponent],
  ['nde-online-availability-before', HathiTrustComponent],
  ['nde-search-filters-side-nav-top', ExcludeBeyondComponent],
]);
