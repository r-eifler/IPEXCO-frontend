import { createAction, props } from "@ngrx/store";
import { User } from "../domain/user";

export const loadTokenLocalStorage = createAction('[user] load token local storage');
export const loadTokenLocalStorageSuccess = createAction('[user] load token local storage success', props<{token: string}>());
export const loadTokenLocalStorageFailure = createAction('[user] load token local storage failure');
export const storeTokenLocalStorage = createAction('[user] store token local storage', props<{token: string}>());

export const checkLoggedIn = createAction('[user] checkLoggedIn');
export const LoggedIn = createAction('[user] logged in');
export const LoggedOut = createAction('[user] logged out');

export const loadUser = createAction('[user] load user');
export const loadUserSuccess = createAction('[user] load user success', props<{user: User}>());
export const loadUserFailure = createAction('[user] load user failure');


export const registerUser = createAction('[user] register user', props<{name: string, password: string}>());
export const registerUserSuccess = createAction('[user] register user success', props<{user: User, token: string}>());
export const registerUserFailure = createAction('[user] register user failure');


export const login = createAction('[user] login', props<{name: string, password: string}>());
export const loginSuccess = createAction('[user] login success', props<{user: User, token: string}>());
export const loginFailure = createAction('[user] login failure');


export const logout = createAction('[user] logout');
export const logoutSuccess = createAction('[user] logout success');
export const logoutFailure = createAction('[user] logout failure');
