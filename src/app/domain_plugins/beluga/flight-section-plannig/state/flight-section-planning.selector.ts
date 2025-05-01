import { createSelector } from "@ngrx/store";
import { LoadingState } from "src/app/shared/common/loadable.interface";
import { FlightSectionPlanningFeature } from "./flight-section-planning.feature";


const selectState = FlightSectionPlanningFeature.selectFlightSectionPlanningState


// Project

export const selectProject = createSelector(selectState, (state) => state.project.data)

// Model general

export const selectTask = createSelector(selectState, 
    (state) => (state.task.data)
);

export const selectFlights = createSelector(selectTask, 
    (task) => task?.flights)

export const selectNumFlightsFlights = createSelector(selectTask, 
    (task) => task?.flights?.length ?? 0)


// Tree

export const selectTree = createSelector(selectState, 
    (state) => (state.tree.data));

export const selectHasTree = createSelector(selectState, 
    (state) => (state.tree.state == LoadingState.Done && state.tree.data !== null));
    
export const selectSections = createSelector(selectState, 
    (state) => (state.sections.data))

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

export const selectBranches = createSelector(selectTree, 
    (tree) => (tree?.branches));


export const selectBranchIndex = createSelector(selectTree, 
    (tree) => (tree?.selectedBranch));


export const selectTreeHead= createSelector(selectTree, 
    (tree) => (tree?.selectedSectionId));