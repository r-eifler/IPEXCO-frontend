import { createFeatureSelector, createSelector } from "@ngrx/store";
import { KeyValuePair, filter, find, map, memoizeWith, pipe, zip } from "ramda";
import { LoadingState } from "src/app/shared/common/loadable.interface";
import { explanationHash } from "../domain/explanation/explanation-hash";
import { ExplanationRunStatus } from "../domain/explanation/explanations";
import { IterativePlanningState, Message, iterativePlanningFeature } from "./iterative-planning.reducer";
import { StepStatus } from "../domain/iteration_step";
import { PlanRunStatus } from "../domain/plan";

const selectIterativePlanningFeature = createFeatureSelector<IterativePlanningState>(iterativePlanningFeature);

// Project

export const selectIterativePlanningProject = createSelector(selectIterativePlanningFeature,
    (state) => state.project?.data)
export const selectIterativePlanningProjectId = createSelector(selectIterativePlanningFeature,
  (state) => state.project?.data._id)
export const selectIterativePlanningPropertyTemplates = createSelector(selectIterativePlanningFeature,
    (state) => state.project?.data?.domainSpecification?.planPropertyTemplates)
export const selectIterativePlanningTask = createSelector(selectIterativePlanningFeature,
        (state) => state.project?.data?.baseTask)
export const selectIterativePlanningIsDemo = createSelector(selectIterativePlanningFeature,
    (state) => state.project?.data?.itemType === 'demo-project')


// Settings

export const selectIterativePlanningProjectCreationInterfaceType = createSelector(selectIterativePlanningFeature,
    (state) => state.project?.data?.settings?.propertyCreationInterfaceType)

export const selectIterativePlanningProjectExplanationInterfaceType = createSelector(selectIterativePlanningFeature,
  (state) => state.project?.data?.settings?.explanationInterfaceType)

// Plan Properties

export const selectIterativePlanningProperties = createSelector(selectIterativePlanningFeature,
    (state) => state.planProperties?.data)
export const selectIterativePlanningPropertiesList = createSelector(selectIterativePlanningFeature,
    (state) => state.planProperties.state === LoadingState.Done ? Object.values(state.planProperties?.data) : null)

// Iterative Planning Steps

export const selectIterativePlanningIterationSteps = createSelector(selectIterativePlanningFeature,
    (state) => state.iterationSteps.data)
export const selectIterationStepIds = createSelector(selectIterativePlanningIterationSteps, map(({ _id }) => _id));

export const selectIterationStepById = memoizeWith(
  (stepId: string) => stepId,
  (stepId: string) => createSelector(selectIterativePlanningIterationSteps, find(({_id}) => _id === stepId)
));
export const selectIterativePlanningIterationStepsLoadingState = createSelector(selectIterativePlanningFeature,
    (state) => state.iterationSteps.state)

export const selectIterativePlanningNewStep = createSelector(selectIterativePlanningFeature,
    (state) => state.newStep)

export const selectIterativePlanningSelectedStepId = createSelector(selectIterativePlanningFeature,
    (state) => state.selectedIterationStepId)
export const selectIterativePlanningSelectedStep = createSelector(selectIterativePlanningFeature,
    (state) => state.iterationSteps.data?.filter(s => s._id == state.selectedIterationStepId)[0])

export const selectIterativePlanningNumberOfSteps = createSelector(selectIterativePlanningFeature,
    (state) => state.iterationSteps?.data?.length)


export const selectIterativePlanningIterationStepComputationRunning = createSelector(selectIterativePlanningFeature,
  (state) => state.iterationSteps.data?.filter(s => s.status == StepStatus.unknown && s.plan?.status !== PlanRunStatus.canceled).length > 0)


// Messages    

const selectAllMessages = createSelector(selectIterativePlanningFeature, ({messages}) => messages);
export const selectMessages = memoizeWith(
  (stepId: string, propertyId?: string) => stepId + propertyId,
  (stepId: string, planPropertyId?: string) => createSelector(selectAllMessages, filter<Message>(
    ({iterationStepId, propertyId}) => iterationStepId === stepId && propertyId === planPropertyId,
  )),
);
export const selectMessageTypes = memoizeWith(
  (stepId: string, propertyId?: string) => stepId + propertyId,
  (stepId: string, propertyId?: string) => createSelector(selectMessages(stepId, propertyId), map(({questionType}) => questionType)),
)

// Questions

export const selectStepAvailableQuestions = createSelector(selectIterativePlanningFeature, ({stepAvailableQuestionTypes}) => stepAvailableQuestionTypes);
export const selectPropertyAvailableQuestions = createSelector(selectIterativePlanningFeature, ({propertyAvailableQuestionTypes}) => propertyAvailableQuestionTypes);


// Explanations

const selectAllExplanations = createSelector(selectIterativePlanningFeature, ({explanations}) => explanations);
export const selectExplanation = memoizeWith(
  (explanationHash: string) => explanationHash,
  (explanationHash: string) => createSelector(selectAllExplanations, explanations => explanations[explanationHash]),
);

export const selectIsExplanationLoading = memoizeWith(
  (explanationHash: string) => explanationHash,
  (explanationHash: string) => createSelector(selectExplanation(explanationHash), (explanation) => explanation?.status === ExplanationRunStatus.pending || explanation?.status === ExplanationRunStatus.running),
);

export const selectIterationStepIdsWithoutExplanations = createSelector(selectIterativePlanningIterationSteps, selectAllExplanations, (iterationSteps, allExplanations) => {
  iterationSteps = iterationSteps ?? [];
  const hashes = map(explanationHash, iterationSteps);

  const explanations = map(iterationHash => allExplanations[iterationHash], hashes);
  const isExplanationMissing = map((explanation) => !explanation, explanations);

  const iterationStepIds = map(({_id}) => _id, iterationSteps);

  const stepToMissingExplanationMap = zip(iterationStepIds, isExplanationMissing);
  const stepExplanationMissing = pipe(
    filter<KeyValuePair<string,boolean>>(([_, isMissing]) => isMissing),
    map(([stepId]) => stepId),
  )(stepToMissingExplanationMap);

  return stepExplanationMissing;
})

// LLM

export const selectLLMChatMessages = createSelector(selectIterativePlanningFeature, (state) => state.LLMContext.visibleMessages)
export const selectLLMChatLoadingState = createSelector(selectIterativePlanningFeature, ({ LLMChatLoadingState }) => LLMChatLoadingState);
export const selectIsLLMChatLoading = createSelector(selectLLMChatLoadingState, (state) => state === LoadingState.Loading);
export const selectExplanationLoadingState = createSelector(selectIterativePlanningFeature, ({ ExplanationLoadingState }) => ExplanationLoadingState);
export const selectIsExplanationChatLoading = createSelector(selectExplanationLoadingState, (state) => state === LoadingState.Loading);
export const selectVisibleMessagesbyId = (id: string) => createSelector(selectLLMChatMessages, (messages) => messages?.filter(m => m.iterationStepId == id));
export const selectLLMThreadIdQT = createSelector(selectIterativePlanningFeature, ({ LLMContext }) => LLMContext.threadIdQT);
export const selectLLMThreadIdGT = createSelector(selectIterativePlanningFeature, ({ LLMContext }) => LLMContext.threadIdGT);
export const selectLLMThreadIdET = createSelector(selectIterativePlanningFeature, ({ LLMContext }) => LLMContext.threadIdET);
export const selectVisiblePPCreationMessages = createSelector(selectIterativePlanningFeature, (state) => state.LLMContext.visiblePPCreationMessages);
