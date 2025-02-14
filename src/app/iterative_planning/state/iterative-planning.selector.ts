import { createSelector } from "@ngrx/store";
import { filter, KeyValuePair, map, memoizeWith, pipe, zip } from "ramda";
import { LoadingState } from "src/app/shared/common/loadable.interface";
import { explanationHash } from "../domain/explanation/explanation-hash";
import { ExplanationRunStatus } from "../domain/explanation/explanations";
import { computeCurrentMaxUtility } from "../domain/iteration_step";
import { PlanRunStatus } from "../domain/plan";
import { iterativePlanningFeature } from "./iterative-planning.feature";
import { Message } from "./iterative-planning.reducer";
import { computeMaxPossibleUtility, Demo } from "src/app/shared/domain/demo";

const selectState = iterativePlanningFeature.selectIterativePlanningFeatureState;

// Project

export const selectIterativePlanningProject = createSelector(selectState,
    (state) => state.project?.data)
export const selectIterativePlanningProjectId = createSelector(selectState,
  (state) => state.project?.data?._id)
export const selectIterativePlanningTask = createSelector(selectState,
        (state) => state.project?.data?.baseTask)
export const selectIterativePlanningIsDemo = createSelector(selectState,
    (state) => state.project?.data?.itemType === 'demo-project')
export const selectIterativePlanningIsIntroTask = createSelector(selectState,
  (state) => state.project?.data?.settings?.userStudy.introTask)

// Domain Spec

export const selectIterativePlanningPropertyTemplates = createSelector(selectState,
  (state) => state.domainSpecification?.data?.planPropertyTemplates)

// Settings

export const selectIterativePlanningProjectCreationInterfaceType = createSelector(selectState,
    (state) => state.project?.data?.settings?.interfaces.propertyCreationInterfaceType)

export const selectIterativePlanningProjectExplanationInterfaceType = createSelector(selectState,
  (state) => state.project?.data?.settings?.interfaces.explanationInterfaceType)

// Plan Properties

export const selectIterativePlanningProperties = createSelector(selectState,
    (state) => state.planProperties?.data)
export const selectIterativePlanningPropertiesList = createSelector(selectState,
    (state) => state.planProperties.state === LoadingState.Done && state.planProperties?.data !== undefined? 
    Object.values(state.planProperties?.data) 
    : null
  )


// Create new step

export const selectIterativePlanningCreateStepInterfaceOpen= createSelector(selectState,
  (state) => state.createStepInterfaceOpen)

export const selectIterativePlanningNewStepBase = createSelector(selectState,
  (state) => state.newStepBase && state.iterationSteps.data ? state.iterationSteps.data.find(({_id}) => _id === state.newStepBase): undefined)

export const selectIterativePlanningCreatedStepId = createSelector(selectState,
  (state) => state.createdStep)

export const selectIterativePlanningLoadingFinished = createSelector(selectState,
  (state) => state.project.state == LoadingState.Done && state.iterationSteps.state == LoadingState.Done && state.planProperties.state == LoadingState.Done)


// Iterative Planning Steps

export const selectIterativePlanningIterationSteps = createSelector(selectState,
    (state) => state.iterationSteps.data ?? [])
export const selectIterationStepIds = createSelector(selectIterativePlanningIterationSteps, map(({ _id }) => _id));

export const selectIterationStepById = memoizeWith(
  (stepId: string) => stepId,
  (stepId: string) => createSelector(selectIterativePlanningIterationSteps, 
    (steps) => steps ? steps.find(({_id}) => _id === stepId) : null
));
export const selectIterativePlanningIterationStepsLoadingState = createSelector(selectState,
    (state) => state.iterationSteps.state)

export const selectIterativePlanningSelectedStepId = createSelector(selectState,
    (state) => state.selectedIterationStepId)
export const selectIterativePlanningSelectedStep = createSelector(selectState,
    (state) => state.iterationSteps.data?.filter(s => s._id == state.selectedIterationStepId)[0])

export const selectIterativePlanningNumberOfSteps = createSelector(selectState,
    (state) => state.iterationSteps?.data?.length)


export const selectIterativePlanningIterationStepComputationRunning = createSelector(selectState,
  (state) => {
    const iterationSteps =  state.iterationSteps.data;
    if(iterationSteps === undefined){
      return false;
    }
    return iterationSteps.filter(s => s.plan && (s.plan?.status == PlanRunStatus.running || s.plan.status == PlanRunStatus.pending)).length > 0
});

export const selectIterativePlanningCurrentMaxUtility = createSelector(selectState, (state) => {
    let cmu = undefined;
    if(!state.iterationSteps.data || state.iterationSteps.data.length === 0 || state.planProperties.data == undefined){
      return 0;
    } 
    cmu = computeCurrentMaxUtility(state.iterationSteps.data, state.planProperties.data);
    return cmu;
});

export const selectIterativePlanningMaxPossibleUtility = createSelector(selectState, (state) => {
  let maxOverallUtility = undefined;
  if(state.project?.data?.itemType === 'demo-project' && state.planProperties.data !== undefined){
    maxOverallUtility = computeMaxPossibleUtility(state.project.data as Demo, Object.values(state.planProperties.data))
  }

  return maxOverallUtility;
});


// Messages    

const selectAllMessages = createSelector(selectState, ({messages}) => messages);
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

export const selectStepAvailableQuestions = createSelector(selectState, ({stepAvailableQuestionTypes}) => stepAvailableQuestionTypes);
export const selectPropertyAvailableQuestions = createSelector(selectState, ({propertyAvailableQuestionTypes}) => propertyAvailableQuestionTypes);


// Explanations

const selectAllExplanations = createSelector(selectState, ({explanations}) => explanations);
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

export const selectLLMChatMessages = createSelector(selectState, (state) => state.LLMContext.visibleMessages)
export const selectLLMChatLoadingState = createSelector(selectState, ({ LLMChatLoadingState }) => LLMChatLoadingState);
export const selectIsLLMChatLoading = createSelector(selectLLMChatLoadingState, (state) => state === LoadingState.Loading);
export const selectExplanationLoadingState = createSelector(selectState, ({ ExplanationLoadingState }) => ExplanationLoadingState);
export const selectIsExplanationChatLoading = createSelector(selectExplanationLoadingState, (state) => state === LoadingState.Loading);
export const selectVisibleMessagesbyId = (id: string) => createSelector(selectLLMChatMessages, (messages) => messages?.filter(m => m.iterationStepId == id));
export const selectLLMThreadIdQT = createSelector(selectState, ({ LLMContext }) => LLMContext.threadIdQT);
export const selectLLMThreadIdGT = createSelector(selectState, ({ LLMContext }) => LLMContext.threadIdGT);
export const selectLLMThreadIdET = createSelector(selectState, ({ LLMContext }) => LLMContext.threadIdET);
export const selectVisiblePPCreationMessages = createSelector(selectState, (state) => state.LLMContext.visiblePPCreationMessages);
