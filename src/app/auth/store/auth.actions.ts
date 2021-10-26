import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const LOGIN = '[Auth] Login';
export const LOGIN_FAIL = '[Auth] Login Fail';
export const SIGNUP_START = '[Auth] Signup Start';
export const SIGNUP = '[Auth] Signup';
export const SIGNUP_FAIL = '[Auth] Signup Fail';
export const LOGOUT = '[Auth] Logout';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auth Login';

export class LoginAction implements Action {
  readonly type = LOGIN;
  constructor(
    public payload: {
      email: string;
      id: string;
      token: string;
      expiresIn: Date;
    }
  ) {}
}

export class LoginStartAction implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string; password: string }) {}
}
export class LoginFailAction implements Action {
  readonly type = LOGIN_FAIL;
  constructor(public payload: string) {}
}
export class SignupStartAction implements Action {
  readonly type = SIGNUP_START;
  constructor(public payload: { email: string; password: string }) {}
}
export class SignupFailAction implements Action {
  readonly type = SIGNUP_FAIL;
  constructor(public payload: string) {}
}
export class SignupAction implements Action {
  readonly type = SIGNUP;
}
export class LogoutAction implements Action {
  readonly type = LOGOUT;
}
export class ClearErrorAction implements Action {
  readonly type = CLEAR_ERROR;
}
export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AllActions =
  | LoginAction
  | LogoutAction
  | LoginStartAction
  | LoginFailAction
  | SignupAction
  | SignupStartAction
  | SignupFailAction
  | ClearErrorAction
  | AutoLogin;
