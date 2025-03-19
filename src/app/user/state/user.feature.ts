import { createFeature } from "@ngrx/store";
import { userReducer } from "./user.reducer";


export const userFeature = createFeature({
    name: 'userFeature',
    reducer: userReducer
});

export const {
    name,
    reducer,
    selectUserFeatureState,
    selectUser,
    selectToken
  } = userFeature;