import { FilterRequestPickupLocationsComponent } from '@umn-nde/full-display';
import { FilterCampusCollectionsComponent } from '@umn-nde/collection-discovery';
import { HathiTrustComponent } from '@umn-nde/search';

// Define component mappings that are common to all views
export const selectorComponentMap = new Map<string, unknown>([
  [
    'nde-collection-discovery-container-before',
    FilterCampusCollectionsComponent,
  ],
  ['nde-requests-after', FilterRequestPickupLocationsComponent],
  ['nde-online-availability-before', HathiTrustComponent],
]);
