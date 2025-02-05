import { createSelector } from "@ngrx/store";
import { DemoRunStatus } from "src/app/project/domain/demo";
import { map } from "ramda";
import { demosFeature } from "./demo.feature";



export const selectAllDemos = createSelector(demosFeature.selectDemos, (demos) => demos.data)

export const selectAllFinishedDemos = createSelector(selectAllDemos, (demos) => demos?.filter(demo => demo.status === DemoRunStatus.finished));
export const selectAllDemosIds = createSelector(selectAllDemos, map(({ _id }) => _id))

export const selectPlanPropertiesListOfDemo = createSelector(demosFeature.selectDemosFeatureState, (state) => state.demoProperties[state.demo?.data?._id]);
export const selectPlanPropertiesOfDemo = createSelector(demosFeature.selectDemosFeatureState, (state) => state.demoProperties[state.demo?.data?._id]?.reduce((acc, cv) => ({...acc,[cv._id]: cv}), {}));

export const selectDemo = createSelector(demosFeature.selectDemo, (demo) => demo.data)

export const selectPlanners = createSelector(demosFeature.selectDemosFeatureState, (state) => state.planners.data);
export const selectExplainer = createSelector(demosFeature.selectDemosFeatureState, (state) => state.explainer.data);
export const selectPrompts = createSelector(demosFeature.selectDemosFeatureState, (state) => state.prompts.data);
export const selectOutputSchemas = createSelector(demosFeature.selectDemosFeatureState, (state) => state.outputSchemas.data);
