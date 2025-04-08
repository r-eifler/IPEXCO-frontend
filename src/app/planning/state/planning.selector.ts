import { createSelector } from "@ngrx/store";
import { planningFeature } from "./planning.feature";
import { Encoding, ServiceType } from "src/app/global_specification/domain/services";

const selectState = planningFeature.selectPlanningFeatureState

export const selectProject = createSelector(selectState, (state) => state.project?.data)

export const selectProjectSettings = createSelector(selectState, (state) => state.project.data?.settings)
export const selectProjectPlanningTask = createSelector(selectState, (state) => state.project.data?.baseTask)


// domain spec

export const selectDomainSpecification = createSelector(selectState, (state) => state.domainSpecification.data)


// plans

export const selectPlans = createSelector(selectState, (state) => state.plans.data);

export const selectSelectedPlan = createSelector(selectState, (state) => 
    state.planId === null || state?.plans.data === undefined ? null : state?.plans.data.find(p => p._id === state.planId));

export const selectReferencePlan = createSelector(selectState, (state) => 
    state.referencePlanId === null || state?.plans.data === undefined ? null : state?.plans.data.find(p => p._id === state.referencePlanId));
export const selectComparisonPlan = createSelector(selectState, (state) => 
    state.comparisonPlanId === null || state?.plans.data === undefined ? null : state?.plans.data.find(p => p._id === state.comparisonPlanId));


// services

export const selectAllPlanners = createSelector(selectState, (state) => 
        state.services.data === undefined ? [] : state.services.data.filter(s => s.type === ServiceType.PLANNER));

export const selectSupportedPlanners = createSelector(selectState, (state) => 
    state.services.data === undefined || state.domainSpecification.data === undefined ? [] : 
    state.services.data.filter(s => s.type === ServiceType.PLANNER).filter(
        p => (state.domainSpecification.data?.encoding === p.encoding) && 
        (state.domainSpecification.data?.encoding !== Encoding.DOMAIN_DEPENDENT || p.domainId === state.domainSpecification.data._id)
    ));
