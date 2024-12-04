import { createFeatureSelector, createSelector } from "@ngrx/store";
import { projectFeature, ProjectState } from "./project.reducer";
import { CreationState } from "src/app/shared/common/creatable.interface";
import { Demo, DemoRunStatus } from "src/app/demo/domain/demo";


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


function demoFinished(demo: Demo): boolean {
    return demo.status != DemoRunStatus.pending && demo.status != DemoRunStatus.running;
}