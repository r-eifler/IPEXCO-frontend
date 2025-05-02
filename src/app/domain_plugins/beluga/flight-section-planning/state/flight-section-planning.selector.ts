import { createSelector } from "@ngrx/store";
import { LoadingState } from "src/app/shared/common/loadable.interface";
import { FlightSectionPlanningFeature } from "./flight-section-planning.feature";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { BelugaAction } from "../../shared/domain/beluga_plan";
import { Encoding, ServiceType } from "src/app/global_specification/domain/services";


const selectState = FlightSectionPlanningFeature.selectFlightSectionPlanningState


// Project

export const selectProject = createSelector(selectState, (state) => state.project.data)

export const selectDomainSpecification = createSelector(selectState, (state) => state.domainSpecification.data)


// Task general

export const selectTask = createSelector(selectState, 
    (state) => (state.task.data)
);

export const selectInitialState = createSelector(selectState, 
    (state) => (state.initialState.data)
);

export const selectFlights = createSelector(selectTask, 
    (task) => task?.flights)

export const selectNumFlights = createSelector(selectTask, 
    (task) => task?.flights?.length ?? 0)

export const selectNumRacks = createSelector(selectTask, 
    (task) => task?.racks?.length ?? 0)

export const selectNumJigs= createSelector(selectTask, 
    (task) => task?.jigs !== undefined ? Object.keys(task?.jigs).length : undefined)

// Services

export const selectAllPlanners = createSelector(selectState,  (state) => 
        state.services.data === undefined ? [] : state.services.data.filter(s => s.type === ServiceType.PLANNER));

export const selectSupportedPlanners = createSelector(selectAllPlanners, selectDomainSpecification, (planners, domainSpec) => 
    planners.filter(p => (domainSpec?.encoding === p.encoding) && (domainSpec?.encoding !== Encoding.DOMAIN_DEPENDENT || p.domainId === domainSpec._id))
);


// Tree

export const selectTree = createSelector(selectState, 
    (state) => (state.tree.data));

export const selectHasTree = createSelector(selectState, 
    (state) => (state.tree.state == LoadingState.Done && state.tree.data !== null));
    
export const selectSections = createSelector(selectState, 
    (state) => (state.sections.data))

export const selectSelectedSectionId = createSelector(selectState, 
    (state) => (state.selectedSectionId))

export const selectSelectedSection = createSelector(selectSections, selectSelectedSectionId,  
    (sections, id) => id !== null ? sections?.[id] : undefined);

export const selectActiveBranchSections = createSelector(selectTree, selectSections,
    (tree, sections) => {
        let sectionId = tree?.branches[tree.selectedBranch].sectionIdHead;
        if(sectionId === undefined || sections === undefined){
            return undefined;
        }
        let branchSections = [sections[sectionId]];
        while(branchSections[0].predecessorId !== null){
            sectionId = branchSections[0].predecessorId;
            branchSections = [sections[sectionId], ...branchSections]
        }
        return branchSections;
    }
);

export const selectActiveBranchActions= createSelector(selectActiveBranchSections, 
    (sections) => sections?.reduce((actions, s) => s.status == PlanRunStatus.SOLVED ? [...actions,...s.actions] : actions, [] as BelugaAction[]));

export const selectActiveBranchNumberFinishedFlights= createSelector(selectActiveBranchSections, 
    (sections) => sections?.filter(s => s.status == PlanRunStatus.SOLVED).length);

export const selectActiveBranchLastSectionFinished= createSelector(selectActiveBranchSections, 
    (sections) => sections?.[sections?.length - 1].status == PlanRunStatus.SOLVED);

export const selectBranches = createSelector(selectTree, 
    (tree) => (tree?.branches));

export const selectBranchIndex = createSelector(selectTree, 
    (tree) => (tree?.selectedBranch));

export const selectTreeHead = createSelector(selectTree, 
    (tree) => (tree?.selectedSectionId));

export const selectRemainingNumberFlights = createSelector(selectActiveBranchNumberFinishedFlights, selectNumFlights,
    (numFinishedFlights, numFLights) => numFLights - (numFinishedFlights ?? 0)
)

