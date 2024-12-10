import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserDataFeature, UserState } from "./user.reducer";
import { LoadingState } from "src/app/shared/common/loadable.interface";


const selectUserDataFeature = createFeatureSelector<UserState>(UserDataFeature);

export const selectUser = createSelector(selectUserDataFeature, (state) => state.user.data)
export const selectToken = createSelector(selectUserDataFeature, (state) => state.token.data)

export const selectLoggedIn = createSelector(selectUserDataFeature, (state) =>
    state.token.state == LoadingState.Done && state.token.data != undefined)
export const selectLoggedOut = createSelector(selectUserDataFeature, (state) =>
  state.token.state !== LoadingState.Done || state.token.data === undefined)
export const selectUserError = createSelector(selectUserDataFeature, (state) =>
    state.user.state == LoadingState.Error)

export const selectUserRole = createSelector(selectUserDataFeature, (state) => state.user.data?.role)
export const selectUserName = createSelector(selectUserDataFeature, (state) => state.user.data?.name)
