import { createFeature } from "@ngrx/store";
import { demoReducer } from "./demo.reducer";


export const demosFeature = createFeature({
    name: 'demosFeature',
    reducer: demoReducer
});

export const {
    name,
    reducer,
    selectDemosFeatureState,
    selectDemos,
    selectDemoProperties,
    selectDemo,
    selectPrompts,
    selectOutputSchemas
  } = demosFeature;