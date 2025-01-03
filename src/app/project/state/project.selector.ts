import { createFeatureSelector, createSelector } from "@ngrx/store";
import { projectFeature, ProjectState } from "./project.reducer";
import { CreationState } from "src/app/shared/common/creatable.interface";
import { Demo, DemoRunStatus } from "src/app/project/domain/demo";
import { map, memoizeWith } from "ramda";


const selectProjectFeature = createFeatureSelector<ProjectState>(projectFeature);

export const selectProject = createSelector(selectProjectFeature, (state) => state.project.data)

export const selectProjectSettings = createSelector(selectProjectFeature, (state) => state.project.data?.settings)
export const selectProjectPlanningTask = createSelector(selectProjectFeature, (state) => state.project.data?.baseTask)

export const selectProjectPlanPropertyCreationInterfaceType = createSelector(selectProjectFeature,
    (state) => state.project?.data?.settings?.propertyCreationInterfaceType)
export const selectProjectPlanPropertyTemplates = createSelector(selectProjectFeature,
    (state) => state.project?.data?.domainSpecification?.planPropertyTemplates)

export const selectProjectProperties = createSelector(selectProjectFeature, (state) => state.planProperties.data)


export const selectProjectAllDemos = createSelector(selectProjectFeature, (state) => state.demos.data)
export const selectProjectFinishedDemos = createSelector(selectProjectFeature, (state) => state.demos.data?.filter(d => demoFinished(d)))
export const selectProjectRunningDemos = createSelector(selectProjectFeature, (state) => state.demos.data?.filter(d => !demoFinished(d)))
export const selectProjectDemoComputationPending = createSelector(selectProjectFeature, (state) => state.demoCreation.state == CreationState.Pending)
export const selectHasRunningDemoComputations = createSelector(selectProjectRunningDemos, (demos) => demos?.length > 0 )

export const selectProjectDemoProperties = createSelector(selectProjectFeature, (state) => state.demoProperties)
export const selectProjectDemoIds = createSelector(selectProjectAllDemos, map(({ _id }) => _id));

export const selectProjectDemo = createSelector(selectProjectFeature, (state) => state.demo?.data)
export const selectPlanPropertiesOfDemo = createSelector(selectProjectFeature, (state) => state.demoProperties[state.demo?.data?._id]?.reduce((acc, cv) => ({...acc,[cv._id]: cv}), {}));
export const selectPlanPropertiesOfDemoById = memoizeWith(
    (demoId: string) => demoId,
    (demoId: string) => createSelector(selectProjectDemoProperties, (planProperties) => planProperties[demoId]?.reduce((acc, cv) => ({...acc,[cv._id]: cv}), {}), 
  ));

function demoFinished(demo: Demo): boolean {
    return demo.status != DemoRunStatus.pending && demo.status != DemoRunStatus.running;
}