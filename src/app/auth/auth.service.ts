import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthResponseData } from '../shared/interfaces/authResponseData.interface';
import { User } from './user.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubject is the same as Subject only it gives you access to the previous value
  // so you can see the value even if you missed the subscription time
  userChanged: BehaviorSubject<User> = new BehaviorSubject(null);
  private logoutTimer: any;
  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          environment.firebaseAPIKey,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(catchError(this.manipulateErrorResponse));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.firebaseAPIKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.manipulateErrorResponse),
        tap((resData) => {
          this.handleUserLogin(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const localSdata = localStorage.getItem('userData');
    console.log(localSdata);
    // console.log(JSON.parse(localStorage.getItem('userData')));
    const userData: {
      email: string;
      id: string;
      _token: string;
      _expirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    } else {
      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._expirationDate)
      );
      if (loadedUser.token) {
        this.userChanged.next(loadedUser);
        const expirationTime =
          new Date(userData._expirationDate).getTime() - new Date().getTime();
        this.autoLogout(expirationTime);
      }
    }
  }

  autoLogout(expirationTimeRemaining: number) {
    console.log(expirationTimeRemaining);
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, expirationTimeRemaining);
  }

  private handleUserLogin(
    email: string,
    id: string,
    token: string,
    expiresIn: number
  ) {
    console.log('expires In :' + expiresIn);
    const expirationDate: Date = new Date(
      new Date().getTime() + expiresIn * 1000
    );
    console.log(expirationDate);
    const user: User = new User(email, id, token, expirationDate);
    this.userChanged.next(user);
    localStorage.setItem('userData', JSON.stringify(user));

    this.autoLogout(expiresIn * 1000);
  }

  private manipulateErrorResponse(errorRes) {
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
    return throwError(errorMessage);
  }

  logout() {
    console.log('reached logout');
    this.userChanged.next(null);
    localStorage.removeItem('userData');
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.logoutTimer = null;
    this.router.navigate(['/auth']);
  }
}
