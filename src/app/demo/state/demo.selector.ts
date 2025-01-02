import { createFeatureSelector, createSelector } from "@ngrx/store";
import { demoFeature, DemoState } from "./demo.reducer";
import { map } from "ramda";


const selectDemoFeature = createFeatureSelector<DemoState>(demoFeature);

export const selectAllDemos = createSelector(selectDemoFeature, (state) => state.demos.data)
export const selectAllDemosIds = createSelector(selectAllDemos, map(({ _id }) => _id))

export const selectDemoProperties = createSelector(selectDemoFeature, (state) => state.demoProperties)
export const selectPlanPropertiesListOfDemo = createSelector(selectDemoFeature, (state) => state.demoProperties[state.demo?.data?._id]);
export const selectPlanPropertiesOfDemo = createSelector(selectDemoFeature, (state) => state.demoProperties[state.demo?.data?._id]?.reduce((acc, cv) => ({...acc,[cv._id]: cv}), {}));

export const selectDemo = createSelector(selectDemoFeature, (state) => state.demo.data)


