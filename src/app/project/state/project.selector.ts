import { createSelector } from "@ngrx/store";
import { map, memoizeWith } from "ramda";
import { ServiceType } from "src/app/global_specification/domain/services";
import { CreationState } from "src/app/shared/common/creatable.interface";
import { projectFeature } from "./project.feature";
import { Demo, DemoRunStatus } from "src/app/shared/domain/demo";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";

const selectState = projectFeature.selectProjectFeatureState;

export const selectProject = createSelector(selectState, (state) => state.project.data)

export const selectProjectSettings = createSelector(selectState, (state) => state.project.data?.settings)
export const selectProjectPlanningTask = createSelector(selectState, (state) => state.project.data?.baseTask)

export const selectProjectPlanPropertyTemplates = createSelector(selectState, (state) => state.domainSpecification?.data?.planPropertyTemplates)

export const selectProjectPlanPropertyCreationInterfaceType = createSelector(selectState,
    (state) => state.project?.data?.settings?.interfaces.propertyCreationInterfaceType)

export const selectServices = createSelector(selectState, (state) => state.services.data);
export const selectPlanners = createSelector(selectState, (state) => state.services.data?.filter(s => s.type === ServiceType.PLANNER));
export const selectExplainer = createSelector(selectState, (state) => state.services.data?.filter(s => s.type === ServiceType.EXPLAINER));
export const selectPrompts = createSelector(selectState, (state) => state.prompts.data);
export const selectOutputSchemas = createSelector(selectState, (state) => state.outputSchemas.data);

export const selectProjectProperties = createSelector(selectState, (state) => state.planProperties.data);


export const selectProjectAllDemos = createSelector(selectState, (state) => state.demos.data ?? [])
export const selectProjectFinishedDemos = createSelector(selectState, (state) => state.demos.data?.filter(d => demoFinished(d)))
export const selectProjectRunningDemos = createSelector(selectState, (state) => state.demos.data?.filter(d => !demoFinished(d)))
export const selectProjectDemoComputationPending = createSelector(selectState, (state) => state.demoCreation.state == CreationState.Pending)
export const selectHasRunningDemoComputations = createSelector(selectProjectRunningDemos, (demos) => demos ? demos?.length > 0 : false)

export const selectProjectDemoProperties = createSelector(selectState, (state) => state.demoProperties)
export const selectProjectDemoIds = createSelector(selectProjectAllDemos, map(({ _id }) => _id));

export const selectSelectedProjectDemo = createSelector(selectState, (state) => 
    state.demoId !== null ? state.demos?.data?.find(d => d._id == state.demoId) : null)
export const selectPlanPropertiesOfDemo = createSelector(selectState, 
    (state) => {
        if(state.demoId == null){
            return undefined
        }
        const properties = state.demoProperties[state.demoId];
        if(properties === null || properties === undefined){
            return undefined;
        }
        return properties.reduce((acc, cv) => ({...acc,[cv._id]: cv}), {}) as Record<string, PlanProperty>;
    });
    
export const selectPlanPropertiesOfDemoById = memoizeWith(
    (demoId: string) => demoId,
    (demoId: string) => createSelector(selectProjectDemoProperties, (planProperties) => planProperties[demoId]?.reduce((acc, cv) => ({...acc,[cv._id]: cv}), {}), 
  ));

function demoFinished(demo: Demo): boolean {
    return demo.status != DemoRunStatus.pending && demo.status != DemoRunStatus.running;
}