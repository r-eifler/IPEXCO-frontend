import { createFeatureSelector, createSelector } from "@ngrx/store";
import { globalSpecificationFeature, GlobalSpecificationState } from "./globalSpec.reducer";


const selectSpecFeature = createFeatureSelector<GlobalSpecificationState>(globalSpecificationFeature);

export const selectDomainSpecifications = createSelector(selectSpecFeature, (state) => state.domainSpecifications.data)
export const selectPrompts = createSelector(selectSpecFeature, (state) => state.prompts.data)
export const selectPlanners= createSelector(selectSpecFeature, (state) => state.planner.data)
export const selectExplainers= createSelector(selectSpecFeature, (state) => state.explainer.data)


export const selectDomainName = (id: string) => createSelector(selectSpecFeature, (state) => 
    state.domainSpecifications.data ? state.domainSpecifications.data.filter(e => e._id == id) : null
)


