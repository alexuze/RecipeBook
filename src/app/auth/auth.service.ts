import { Injectable } from '@angular/core';

import * as fromApp from '../store/app.reducer';
import * as authActions from './store/auth.actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubject is the same as Subject only it gives you access to the previous value
  // so you can see the value even if you missed the subscription time
  // userChanged: BehaviorSubject<User> = new BehaviorSubject(null);
  private logoutTimer: any;
  constructor(private store: Store<fromApp.AppState>) {}

  setLogoutTimer(expirationTimeRemaining: number) {
    console.log(expirationTimeRemaining);
    this.logoutTimer = setTimeout(() => {
      this.store.dispatch(new authActions.LogoutAction());
    }, expirationTimeRemaining);
  }

  clearLogoutTimer() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }
}
