import { createSelector } from "@ngrx/store";
import { PolicyTestingFeature } from "./policy-testing.feature";
import { memoizeWith } from "ramda";


const selectState = PolicyTestingFeature.selectPolicyTestingFeatureState

// Project/Task

export const selectProject = createSelector(selectState, 
    (state) => state.project.data
);

export const selectProjectId = createSelector(selectProject, 
    (project) => project?._id
);

export const selectTestCollections= createSelector(selectState, 
    (state) => state.testCollections.data
);

export const selectSelectedTestSuiteId= createSelector(selectState, 
    (state) => state.selectedTestSuiteId
);

export const selectSelectedTestSuite = createSelector(selectSelectedTestSuiteId, selectTestCollections, 
    (id, testCollections) => id !== null && testCollections !== undefined ? testCollections.find(e => e._id === id) : undefined
);

export const selectSelectedTestCaseID = createSelector(selectState, 
    (state) => state.selectedTestCaseID
);

export const selectSelectedTestCase = createSelector(selectSelectedTestCaseID, selectSelectedTestSuite, 
    (testID, suite) => testID !== null && suite !== undefined ? suite.testCases.find(t => t.testID == testID): undefined
);


// Tree

export const selectTree = createSelector(selectState, 
    (state) => (state.tree.data));
    
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

export const selectBranchNames = createSelector(selectTree, 
    (tree) => tree?.branches.map(b => b.name));

export const selectBranchIndex = createSelector(selectTree, 
    (tree) => (tree?.selectedBranch));

export const selectTreeHead = createSelector(selectTree, 
    (tree) => (tree?.selectedSectionId));

    

export const selectBranchSections = memoizeWith(
    (index: number) => index.toString(),
    (index: number) => createSelector(selectTree, selectSections,
        (tree, sections) => {
            let sectionId = tree?.branches[index].sectionIdHead;
            if(tree === undefined || sections === undefined || sectionId === undefined){
                return undefined;
            }   
            let branchSections = [sections[sectionId]];
            while(branchSections[0].predecessorId !== null && branchSections[0].predecessorId !== undefined){
                sectionId = branchSections[0].predecessorId;
                if(sectionId !== undefined){
                    branchSections = [sections[sectionId], ...branchSections]
                }             
            }
            return branchSections;
    })
);


export const selectSection = memoizeWith(
    (id: string) => id,
    (id: string) => createSelector(selectSections,
        (sections) => sections?.[id] ?? undefined)
);