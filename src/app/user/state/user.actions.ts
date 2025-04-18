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
export const loadUserFailure = createAction('[user] load user failure', props<{err: any}>());


export const registerUser = createAction('[user] register user', props<{name: string, password: string}>());
export const registerUserSuccess = createAction('[user] register user success', props<{user: User, token: string}>());
export const registerUserFailure = createAction('[user] register user failure', props<{err: any}>());


export const login = createAction('[user] login', props<{name: string, password: string}>());
export const loginSuccess = createAction('[user] login success', props<{user: User, token: string}>());
export const loginFailure = createAction('[user] login failure', props<{err: any}>());


export const logout = createAction('[user] logout');
export const logoutSuccess = createAction('[user] logout success');
export const logoutFailure = createAction('[user] logout failure', props<{err: any}>());

// Languages
export const changeLanguage = createAction('[user] change language', props<{code: string}>());
export const changeLanguageSuccess = createAction('[user] change language success', props<{code: string}>());
export const changeLanguageFailure = createAction('[user] change language failure', props<{err: any}>());