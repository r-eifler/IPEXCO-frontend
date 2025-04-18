import { createFeature } from "@ngrx/store";
import { HomeReducer } from "./home.reducer";


export const HomeFeature = createFeature({
    name: 'homeFeature',
    reducer: HomeReducer
});

export const {
    name,
    reducer,
    selectHomeFeatureState,
    selectCreatedProject,
  } = HomeFeature;