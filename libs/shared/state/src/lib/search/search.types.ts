export interface Search {
  searchParams: SearchParams;
  pcAvailabilityToggleValue: boolean;
}

export interface SearchParams {
  q: string;
  tab: string;
  scope: string;
  pcAvailability?: boolean;
}
