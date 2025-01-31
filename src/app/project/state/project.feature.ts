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
    selectDemo,
    selectDemoCreation,
    selectDemoProperties,
    selectDemos,
    selectDomainSpecification,
    selectExplainer,
    selectOutputSchemas,
    selectPlanProperties,
    selectPlanners,
    selectProject,
    selectPrompts,
  } = projectFeature;