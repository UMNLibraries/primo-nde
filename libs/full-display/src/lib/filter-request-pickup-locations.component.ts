import { Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';

interface AlmaRequestInfo {
  'services-arr'?: {
    services?: [
      {
        requestType?: [{ key: string; value: string }];
        'groups-list-map'?: [
          {
            pickupLocation?: [
              {
                key: string;
                value: string;
                category: string;
                userAffiliatedCampus: boolean;
              },
            ];
          },
        ];
      },
    ];
  };
}

interface RequestsService {
  getRequestServiceData(requestType: string): Observable<AlmaRequestInfo>;
}

const REQUEST_TYPES_TO_OVERRIDE = new Set([
  'AlmaRequest',
  'AlmaItemRequest',
  'RapidoPhysicalRequest',
]);

const LOCATIONS_TO_REMOVE = new Set([
  '2307115588020001701', // TC_RES_SHARE
  '2307115640810001701', // RES_SHARE3
  '2234939915490001701', // RES_SHARE2
  '12900830000231', // RES_SHARE
]);

/**
 * Monkey patch the NDE RequestService in order to remove invalid pickup
 * locations from the request from.
 */
@Component({
  standalone: true,
  template: '',
})
export class FilterRequestPickupLocationsComponent implements OnInit {
  @Input() hostComponent!: { requestsService: RequestsService };

  ngOnInit() {
    console.assert(
      !!this?.hostComponent?.requestsService?.getRequestServiceData,
      'requestsService.getRequestServiceData missing from hostComponent',
      this.hostComponent,
    );
    monkeyPatchRequestsService(this.hostComponent.requestsService);
  }
}

function monkeyPatchRequestsService(requestsService: RequestsService) {
  const orig = requestsService.getRequestServiceData;
  requestsService.getRequestServiceData = function (requestType: string) {
    //console.debug('getRequestServiceData called for: ', requestType);
    if (REQUEST_TYPES_TO_OVERRIDE.has(requestType)) {
      return orig
        .apply(this, [requestType])
        .pipe(map(removeInvalidPickupLocations));
    }
    return orig.apply(this, [requestType]);
  };
}

function removeInvalidPickupLocations(almaRequestInfo: AlmaRequestInfo) {
  const groupsListMap =
    almaRequestInfo['services-arr']?.services?.[0]?.['groups-list-map'];

  for (const group of groupsListMap ?? []) {
    const origPickupLocation = group.pickupLocation;
    if (origPickupLocation && origPickupLocation.length > 0) {
      const updatedPickupLocation = origPickupLocation.filter(
        (location) =>
          // the location codes are sometimes suffixed with $$LIBRARY
          !LOCATIONS_TO_REMOVE.has(location.key.replace(/\$\$LIBRARY$/, '')),
      );
      // @ts-expect-error: Normally, any of properties in this path could be
      // undefined, but they're guaranteed to be non-null in this block.
      group.pickupLocation = updatedPickupLocation;
    }
  }

  return almaRequestInfo;
}
