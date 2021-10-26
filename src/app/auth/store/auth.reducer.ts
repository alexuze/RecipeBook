import { Statement } from '@angular/compiler';
import { User } from '../user.model';
import * as authActions from './auth.actions';
export interface State {
  user: User;
  authError: string;
  isLoading: boolean;
  isLoginMode: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  isLoading: false,
  isLoginMode: true,
};

export function authReducer(
  state = initialState,
  action: authActions.AllActions
) {
  switch (action.type) {
    case authActions.LOGIN:
      return login(state, action.payload);
    case authActions.LOGOUT:
      return logout(state);
    case authActions.LOGIN_START:
      return {
        ...state,
        authError: null,
        isLoading: true,
        isLoginMode: true,
      };
    case authActions.LOGIN_FAIL:
      return {
        ...state,
        authError: action.payload,
        isLoading: false,
        isLoginMode: true,
      };
    case authActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        isLoading: true,
        isLoginMode: false,
      };
    case authActions.SIGNUP:
      return {
        ...state,
        authError: null,
        isLoading: false,
        isLoginMode: true,
      };
    case authActions.SIGNUP_FAIL:
      return {
        ...state,
        authError: action.payload,
        isLoading: false,
        isLoginMode: false,
      };
    case authActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null,
      };
    default:
      return state;
  }
}

const login: (
  state: State,
  payload: {
    email: string;
    id: string;
    token: string;
    expiresIn: Date;
  }
) => State = (state, payload) => {
  const user: User = new User(
    payload.email,
    payload.id,
    payload.token,
    payload.expiresIn
  );
  return {
    ...state,
    user: user,
    authError: null,
    isLoading: false,
    isLoginMode: true,
  };
};

const logout: (state: State) => State = (state) => {
  return {
    ...state,
    user: null,
    authError: null,
    isLoading: false,
    isLoginMode: true,
  };
};
