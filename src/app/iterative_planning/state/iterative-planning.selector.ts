import { createFeatureSelector, createSelector } from "@ngrx/store";
import { filter, map, memoizeWith } from "ramda";
import { LoadingState } from "src/app/shared/common/loadable.interface";
import { ExplanationMessage } from "../domain/interface/explanation-message";
import { IterativePlanningState, iterativePlanningFeature } from "./iterative-planning.reducer";


const selectIterativePlanningFeature = createFeatureSelector<IterativePlanningState>(iterativePlanningFeature);

export const selectIterativePlanningProject = createSelector(selectIterativePlanningFeature,
    (state) => state.project?.data)
export const selectIterativePlanningPropertyTemplates = createSelector(selectIterativePlanningFeature,
    (state) => state.project?.data?.domainSpecification?.planPropertyTemplates)
export const selectIterativePlanningTask = createSelector(selectIterativePlanningFeature,
        (state) => state.project?.data?.baseTask)

export const selectIterativePlanningProjectCreationInterfaceType = createSelector(selectIterativePlanningFeature,
    (state) => state.project?.data.settings?.propertyCreationInterfaceType)

export const selectIterativePlanningProperties = createSelector(selectIterativePlanningFeature,
    (state) => state.planProperties?.data)
export const selectIterativePlanningPropertiesList = createSelector(selectIterativePlanningFeature,
    (state) => state.planProperties.state == LoadingState.Done ? Object.values(state.planProperties?.data) : null)



export const selectIterativePlanningIterationSteps = createSelector(selectIterativePlanningFeature,
    (state) => state.iterationSteps.data)
export const selectIterativePlanningIterationStepsLoadingState = createSelector(selectIterativePlanningFeature,
    (state) => state.iterationSteps.state)

export const selectIterativePlanningNewStep = createSelector(selectIterativePlanningFeature,
    (state) => state.newStep)

export const selectIterativePlanningSelectedStepId = createSelector(selectIterativePlanningFeature,
    (state) => state.selectedIterationStepId)
export const selectIterativePlanningSelectedStep = createSelector(selectIterativePlanningFeature,
    (state) => state.iterationSteps.data?.filter(s => s._id == state.selectedIterationStepId)[0])

export const selectIterativePlanningNumStep = createSelector(selectIterativePlanningFeature,
    (state) => state.iterationSteps?.data.length)

const selectAllMessages = createSelector(selectIterativePlanningFeature, ({messages}) => messages);
export const selectMessages = memoizeWith(
  (stepId: string, propertyId?: string) => stepId + propertyId,
  (stepId: string, propertyId?: string) => createSelector(selectAllMessages, filter<ExplanationMessage>(
    ({iterationStepId, planPropertyId}) => iterationStepId === stepId && propertyId === planPropertyId,
  )),
);
export const selectMessageTypes = memoizeWith(
  (stepId: string, propertyId?: string) => stepId + propertyId,
  (stepId: string, propertyId?: string) => createSelector(selectMessages(stepId, propertyId), map(({questionType}) => questionType)),
)

export const selectStepAvailableQuestions = createSelector(selectIterativePlanningFeature, ({stepAvailableQuestionTypes}) => stepAvailableQuestionTypes);
export const selectPropertyAvailableQuestions = createSelector(selectIterativePlanningFeature, ({propertyAvailableQuestionTypes}) => propertyAvailableQuestionTypes);
