import { createSelector } from "@ngrx/store";
import { globalSpecFeature } from "./globalSpec.feature";


export const selectDomainSpecifications = createSelector(globalSpecFeature.selectGlobalSpecFeatureState, (state) => state.domainSpecifications?.data)
export const selectDomainSpecification = createSelector(globalSpecFeature.selectGlobalSpecFeatureState, (state) => state.domainSpecification?.data)
export const selectPrompts = createSelector(globalSpecFeature.selectGlobalSpecFeatureState, (state) => state.prompts?.data)
export const selectPrompt = createSelector(globalSpecFeature.selectGlobalSpecFeatureState, (state) => state.prompt?.data)
export const selectOutputSchemas = createSelector(globalSpecFeature.selectGlobalSpecFeatureState, (state) => state.outputSchemas?.data)
export const selectOutputSchema = createSelector(globalSpecFeature.selectGlobalSpecFeatureState, (state) => state.outputSchema?.data)
export const selectPlanners= createSelector(globalSpecFeature.selectGlobalSpecFeatureState, (state) => state.planner?.data)
export const selectExplainers= createSelector(globalSpecFeature.selectGlobalSpecFeatureState, (state) => state.explainer?.data)


export const selectDomainName = (id: string) => createSelector(globalSpecFeature.selectGlobalSpecFeatureState, (state) => 
    state.domainSpecifications.data ? state.domainSpecifications.data.filter(e => e._id == id) : null
)


