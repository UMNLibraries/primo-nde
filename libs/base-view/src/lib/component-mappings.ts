import { FilterRequestPickupLocationsComponent } from '@umn-nde/full-display';
import { FilterCampusCollectionsComponent } from '@umn-nde/collection-discovery';

// Define component mappings that are common to all views
export const selectorComponentMap = new Map<string, unknown>([
  [
    'nde-collection-discovery-container-before',
    FilterCampusCollectionsComponent,
  ],
  ['nde-requests-after', FilterRequestPickupLocationsComponent],
]);
