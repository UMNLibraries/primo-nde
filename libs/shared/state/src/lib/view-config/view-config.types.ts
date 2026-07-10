type PcAvailability = 'AVAILABLE_ONLY' | 'INCLUDE_NO_FULL_TEXT';

export interface Scope {
  'scope-id': string;
  locations: string;
  types: string;
  tab: string;
  'tab-id-for-scope-matching': string;
  'contains-central-index-scope': boolean;
}

export interface ViewConfig {
  config: {
    vid: string;
    'primo-view': {
      scopes: Scope[];
      'pc-availability-tab-scopes-map': Record<
        string,
        Record<string, PcAvailability>
      >;
    };
    'system-configuration': {
      hostLB: string;
      hide_rapido_expand_link_map: Record<string, boolean>;
    };
  };
}
