import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthResponseData } from 'src/app/shared/interfaces/authResponseData.interface';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import * as authActions from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  // this pipe will be used only for this type of action
  // here we can use ASYNC code as oppose to the reducer where we can't
  authLoginStart = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.LOGIN_START),
      switchMap((authData: authActions.LoginStartAction) => {
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
              environment.firebaseAPIKey,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map((resData) => {
              const expirationDate: Date = new Date(
                new Date().getTime() + +resData.expiresIn * 1000
              );
              const user: User = new User(
                resData.email,
                resData.localId,
                resData.idToken,
                expirationDate
              );
              localStorage.setItem('userData', JSON.stringify(user));
              const payload = {
                email: resData.email,
                id: resData.localId,
                token: resData.idToken,
                expiresIn: expirationDate,
              };
              return new authActions.LoginAction(payload);
            }),
            catchError((error) => {
              //... error handling code
              // of returns a non error observable
              // it needs to be non error to keep the actions$ observable stream alive , it should never die!!!
              return this.manipulateErrorResponse(error, true);
            })
          );
      })
    )
  );
  authLoginSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.LOGIN, authActions.SIGNUP),
        tap(() => {
          console.log('arrived in tap');
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  authSignupStart = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.SIGNUP_START),
      switchMap((authData: authActions.SignupStartAction) => {
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
              environment.firebaseAPIKey,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((resData) => {
              return new authActions.SignupAction();
            }),
            catchError((errorRes) => {
              return this.manipulateErrorResponse(errorRes, false);
            })
          );
      })
    )
  );

  @Effect() autoLogin = this.actions$.pipe(
    ofType(authActions.AUTO_LOGIN),
    map(() => {
      const localStorageData = localStorage.getItem('userData');
      console.log(localStorageData);

      const userData: {
        email: string;
        id: string;
        _token: string;
        _expirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));

      if (!userData) {
        return { type: 'DUMMY' };
      } else {
        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._expirationDate)
        );
        if (loadedUser.token) {
          // this.userChanged.next(loadedUser);
          const expirationTime =
            new Date(userData._expirationDate).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationTime);
          return new authActions.LoginAction({
            email: loadedUser.email,
            id: loadedUser.id,
            token: loadedUser.token,
            expiresIn: new Date(userData._expirationDate),
          });
        }
        return { type: 'DUMMY' };
      }
    })
  );

  @Effect({ dispatch: false }) logout = this.actions$.pipe(
    ofType(authActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  private manipulateErrorResponse(errorRes, isLogin: boolean) {
    let errorMessage = 'an unknown error occurred!';
    if (errorRes.error && errorRes.error.error) {
      switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage =
            'The email address is already in use by another account.';
          break;
        case 'OPERATION_NOT_ALLOWED':
          errorMessage = 'Password sign-in is disabled for this project.';
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          errorMessage =
            'We have blocked all requests from this device due to unusual activity. Try again later.';
        case 'EMAIL_NOT_FOUND':
          errorMessage =
            'There is no user record corresponding to this identifier. The user may have been deleted.';
          break;
        case 'INVALID_PASSWORD':
          errorMessage =
            'The password is invalid or the user does not have a password.';
          break;
        case 'USER_DISABLED':
          errorMessage =
            'The user account has been disabled by an administrator.';
          break;
      }
    }
    console.log('before throwError');
    if (isLogin) {
      return of(new authActions.LoginFailAction(errorMessage));
    }
    return of(new authActions.SignupFailAction(errorMessage));
  }
}
