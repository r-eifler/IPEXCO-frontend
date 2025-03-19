import { createFeature } from "@ngrx/store";
import { iterativePlanningReducer } from "./iterative-planning.reducer";

export const iterativePlanningFeature = createFeature({
    name: 'iterativePlanningFeature',
    reducer: iterativePlanningReducer
});


export const {
    name,
    reducer,
    selectIterativePlanningFeatureState,
    selectCreateStepInterfaceOpen,
    selectCreatedStep,
    selectDomainSpecification,
    selectExplanationLoadingState,
    selectExplanations,
    selectIterationSteps,
    selectLLMChatLoadingState,
    selectLLMContext,
    selectMessages,
    selectNewStepBase,
    selectPlanProperties,
    selectProject,
    selectPropertyAvailableQuestionTypes,
    selectSelectedIterationStepId,
    selectStepAvailableQuestionTypes
} = iterativePlanningFeature;