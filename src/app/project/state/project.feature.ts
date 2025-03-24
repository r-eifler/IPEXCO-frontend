import { createFeature } from "@ngrx/store";
import { projectReducer } from "./project.reducer";


export const projectFeature = createFeature({
    name: 'projectFeature',
    reducer: projectReducer
});

export const {
    name,
    reducer,
    selectProjectFeatureState,
    selectDemoCreation,
    selectDemoProperties,
    selectDemos,
    selectDomainSpecification,
    selectServices,
    selectOutputSchemas,
    selectPlanProperties,
    selectProject,
    selectPrompts,
  } = projectFeature;