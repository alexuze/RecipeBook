import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(

    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    stage: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.store.select('auth').pipe(
      take(1),
      map((authData) => {
        return authData.user;
      }),
      map((user) => {
        const isAuth = !!user;
        console.log(isAuth);
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/auth']);
      })
      // this approach works but can cause race conditions so the upper approach is better
      // tap((isAuth) => {
      //   if (!isAuth) {
      //     this.router.navigate['/auth'];
      //   }
      // })
    );
  }
}
