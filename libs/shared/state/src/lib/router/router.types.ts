import { ActivatedRouteSnapshot } from '@angular/router';

export interface Router {
  state: {
    root: {
      queryParams: ActivatedRouteSnapshot['queryParams'];
    };
    url: string;
  };
}
