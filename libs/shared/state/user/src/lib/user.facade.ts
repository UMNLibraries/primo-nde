import { inject, Injectable } from '@angular/core';
import { selectUserJwt } from './user.selector';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  private store = inject(Store);
  readonly jwt = this.store.selectSignal(selectUserJwt);
}
