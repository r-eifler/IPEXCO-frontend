import { createFeature } from "@ngrx/store";
import { globalSpecificationReducer } from "./globalSpec.reducer";

export const globalSpecFeature = createFeature({
    name: 'globalSpecFeature',
    reducer: globalSpecificationReducer
});


export const {
    name,
    reducer,
    selectGlobalSpecFeatureState,
    selectDomainSpecification,
    selectDomainSpecifications,
    selectExplainer,
    selectOutputSchema,
    selectOutputSchemas,
    selectPlanner,
    selectPrompt,
    selectPrompts
  } = globalSpecFeature;