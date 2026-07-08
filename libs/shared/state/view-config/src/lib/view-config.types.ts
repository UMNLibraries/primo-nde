export interface ViewConfig {
  config: {
    vid: string;
    'system-configuration': {
      hostLB: string;
      hide_rapido_expand_link_map: Record<string, boolean>;
    };
  };
}
