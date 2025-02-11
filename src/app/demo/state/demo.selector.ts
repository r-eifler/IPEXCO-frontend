import { createSelector } from "@ngrx/store";
import { DemoRunStatus } from "src/app/project/domain/demo";
import { map } from "ramda";
import { demosFeature } from "./demo.feature";
import { ServiceType } from "src/app/global_specification/domain/services";



export const selectAllDemos = createSelector(demosFeature.selectDemos, (demos) => demos.data)

export const selectAllFinishedDemos = createSelector(selectAllDemos, (demos) => demos?.filter(demo => demo.status === DemoRunStatus.finished));
export const selectAllDemosIds = createSelector(selectAllDemos, map(({ _id }) => _id))

export const selectPlanPropertiesListOfDemo = createSelector(demosFeature.selectDemosFeatureState, (state) => state.demoProperties[state.demo?.data?._id]);
export const selectPlanPropertiesOfDemo = createSelector(demosFeature.selectDemosFeatureState, (state) => state.demoProperties[state.demo?.data?._id]?.reduce((acc, cv) => ({...acc,[cv._id]: cv}), {}));

export const selectDemo = createSelector(demosFeature.selectDemo, (demo) => demo.data)

export const selectServices = createSelector(demosFeature.selectDemosFeatureState, (state) => state.services.data);
export const selectPlanners = createSelector(demosFeature.selectDemosFeatureState, (state) => state.services.data?.
    filter(s => s.type === ServiceType.PLANNER ));
export const selectExplainer = createSelector(demosFeature.selectDemosFeatureState, (state) => state.services.data?.
    filter(s => s.type === ServiceType.EXPLAINER));
export const selectPrompts = createSelector(demosFeature.selectDemosFeatureState, (state) => state.prompts.data);
export const selectOutputSchemas = createSelector(demosFeature.selectDemosFeatureState, (state) => state.outputSchemas.data);
