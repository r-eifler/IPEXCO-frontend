import { createFeature } from "@ngrx/store";
import { projectMetaDataReducer } from "./project-meta.reducer";


export const projectMetaFeature = createFeature({
    name: 'projectMetaFeature',
    reducer: projectMetaDataReducer
});

export const {
    name,
    reducer,
    selectProjectMetaFeatureState,
    selectCreatedProject,
    selectDomainSpecifications
  } = projectMetaFeature;