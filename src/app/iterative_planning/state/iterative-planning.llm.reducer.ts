import { LoadingState } from "src/app/shared/common/loadable.interface";
import { eraseLLMHistory, sendMessageToLLMGoalTranslator, sendMessageToLLMGoalTranslatorSuccess, sendMessageToLLMExplanationTranslator, sendMessageToLLMExplanationTranslatorSuccess, sendMessageToLLMExplanationTranslatorFailure, sendMessageToLLMQuestionTranslator, sendMessageToLLMQuestionTranslatorSuccess, sendMessageToLLMQuestionTranslatorFailure, loadLLMContextSuccess, createLLMContext, createLLMContextSuccess, directResponseQT, showReverseTranslationGT, showReverseTranslationQT } from "./iterative-planning.actions";
import { IterativePlanningState } from "./iterative-planning.reducer";
import { ActionCreator, on, ReducerTypes } from "@ngrx/store";

export const llmStateChangeFunctions: ReducerTypes<IterativePlanningState,ActionCreator[]>[] = [
    //   // LLM STUFF TO BE UPDATED
  on(eraseLLMHistory, (state): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Initial,
    LLMContext: {
      ...state.LLMContext,
      visiblePPCreationMessages: [],
      visibleMessages: [],
      threadIdGT: '',
      threadIdQT: '',
      threadIdET: ''
    }
})),

on(sendMessageToLLMGoalTranslator, (state, action): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Loading,
    LLMContext: {
      ...state.LLMContext,
      visiblePPCreationMessages: [...state.LLMContext.visiblePPCreationMessages, {role: 'receiver', content: action.goalDescription, iterationStepId: state.selectedIterationStepId}]
    }
})),
on(sendMessageToLLMGoalTranslatorSuccess, (state, action): IterativePlanningState => ({
  ...state,
  LLMChatLoadingState: LoadingState.Done,
    LLMContext: {
      ...state.LLMContext,
      threadIdGT: action.threadId,
      visiblePPCreationMessages: [...state.LLMContext.visiblePPCreationMessages, { role: 'sender', content: `${action.response.formula} ; ${action.response.shortName}`, iterationStepId: state.selectedIterationStepId }]
      
    }
})),
on(sendMessageToLLMExplanationTranslator, (state, action): IterativePlanningState => ({
    ...state,
  LLMChatLoadingState: LoadingState.Loading,
  ExplanationLoadingState: LoadingState.Loading
})),
on(sendMessageToLLMExplanationTranslatorSuccess, (state, action): IterativePlanningState => ({
    ...state,
    LLMContext: {
      ...state.LLMContext,
      threadIdET: action.threadId,
      visibleMessages: [...state.LLMContext.visibleMessages, {role: 'sender', content: action.response, iterationStepId: state.selectedIterationStepId}]
    },
    LLMChatLoadingState: LoadingState.Done,
    ExplanationLoadingState: LoadingState.Done
})),
on(sendMessageToLLMExplanationTranslatorFailure, (state): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Done,
    ExplanationLoadingState: LoadingState.Done,
    LLMContext: {
      ...state.LLMContext,
      visibleMessages: [...state.LLMContext.visibleMessages, {role: 'sender', content: "Something went wrong. Please try again.", iterationStepId: state.selectedIterationStepId}]
    }
})),
// on(sendMessageToLLMQTthenGTTranslators, (state, action): IterativePlanningState => ({
//     ...state,
//   LLMChatLoadingState: LoadingState.Loading,
//   ExplanationLoadingState: LoadingState.Loading,
//     LLMContext: {
//       ...state.LLMContext,
//       visibleMessages: [...state.LLMContext.visibleMessages, {role: 'receiver', content: action.question, iterationStepId: state.selectedIterationStepId}]
//     }
// })),
// on(sendMessageToLLMQTthenGTTranslatorsSuccess, (state, action): IterativePlanningState => ({
//     ...state,
//     LLMChatLoadingState: LoadingState.Done,
//     LLMContext: {
//       ...state.LLMContext,
//       threadIdQT: action.threadIdQt,
//       threadIdGT: action.threadIdGt,
//     }
// })),
// on(sendMessageToLLMQTthenGTTranslatorsFailure, (state): IterativePlanningState => ({
//     ...state,
//     LLMChatLoadingState: LoadingState.Done,
//     ExplanationLoadingState: LoadingState.Done
  // })),
  on(sendMessageToLLMQuestionTranslator, (state, action): IterativePlanningState => ({
    ...state,
  LLMChatLoadingState: LoadingState.Loading,
  ExplanationLoadingState: LoadingState.Loading,
    LLMContext: {
      ...state.LLMContext,
      visibleMessages: [...state.LLMContext.visibleMessages, {role: 'receiver', content: action.question, iterationStepId: state.selectedIterationStepId}]
    }
})),
on(sendMessageToLLMQuestionTranslatorSuccess, (state, action): IterativePlanningState => ({
    ...state,
    LLMChatLoadingState: LoadingState.Done,
    LLMContext: {
      ...state.LLMContext,
      threadIdQT: action.threadId,
    }
})),
on(sendMessageToLLMQuestionTranslatorFailure, (state): IterativePlanningState => ({
  ...state,
    LLMChatLoadingState: LoadingState.Done,
    ExplanationLoadingState: LoadingState.Done,
    LLMContext: {
      ...state.LLMContext,
      visibleMessages: [...state.LLMContext.visibleMessages, {role: 'sender', content: "Something went wrong. Please try again.", iterationStepId: state.selectedIterationStepId}]
    }
})),
on(loadLLMContextSuccess, (state,action): IterativePlanningState=> ({
  ...state,
  LLMContext : action.LLMContext
})),
on(createLLMContext, (state, action): IterativePlanningState => ({
  ...state,
})),
on(createLLMContextSuccess, (state, action): IterativePlanningState => ({
  ...state,
  LLMContext: action.LLMContext
})),
on(directResponseQT, (state, action): IterativePlanningState => ({
  ...state,
  LLMChatLoadingState: LoadingState.Done,
  ExplanationLoadingState: LoadingState.Done,
  LLMContext: {
    ...state.LLMContext,
    visibleMessages: [...state.LLMContext.visibleMessages, {role: 'sender', content: action.directResponse, iterationStepId: state.selectedIterationStepId}]
  }
})),
on(showReverseTranslationGT, (state, action): IterativePlanningState => ({ //TODO make it possible to disable it
  ...state,
  LLMContext: {
    ...state.LLMContext,
    visibleMessages: [...state.LLMContext.visibleMessages, {role: 'sender', content: "I understood the goal you described as : " + action.reverseTranslation, iterationStepId: state.selectedIterationStepId}]
  }
})),
on(showReverseTranslationQT, (state, action): IterativePlanningState => ({ //TODO make it possible to disable it
  ...state,
  LLMContext: {
    ...state.LLMContext,
    visibleMessages: [...state.LLMContext.visibleMessages, {role: 'sender', content: "I understood your question as : " + action.reverseTranslation, iterationStepId: state.selectedIterationStepId}]
  }
}))
]