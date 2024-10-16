import { createAction, props } from "@ngrx/store";
import { BackendLLMRequest, BackendLLMResponse } from "../interfaces/translators_interfaces";
export const sendMessageToLLM = createAction('[llm] send message', props<{request: string}>());
export const sendMessageToLLMSuccess = createAction('[llm] send message success',  props<{response: string}>());
export const sendMessageToLLMFailure = createAction('[llm] send message failure');

export const eraseLLMHistory = createAction('[llm] erase history');

export const sendMessageToLLMQuestionTranslator = createAction('[llm] send message to question translator', props<BackendLLMRequest>());
export const sendMessageToLLMQuestionTranslatorSuccess = createAction('[llm] send message to question translator success', props<BackendLLMResponse>());
export const sendMessageToLLMQuestionTranslatorFailure = createAction('[llm] send message to question translator failure');

export const sendMessageToLLMGoalTranslator = createAction('[llm] send message to goal translator', props<BackendLLMRequest>());
export const sendMessageToLLMGoalTranslatorSuccess = createAction('[llm] send message to goal translator success', props<BackendLLMResponse>());
export const sendMessageToLLMGoalTranslatorFailure = createAction('[llm] send message to goal translator failure');

export const sendMessageToLLMExplanationTranslator = createAction('[llm] send message to explanation translator', props<BackendLLMRequest>());
export const sendMessageToLLMExplanationTranslatorSuccess = createAction('[llm] send message to explanation translator success', props<BackendLLMResponse>());
export const sendMessageToLLMExplanationTranslatorFailure = createAction('[llm] send message to explanation translator failure');

export const addContextToThread = createAction('[llm] add context to thread', props<{ threadId: string, context: string }>());
export const addContextToThreadSuccess = createAction('[llm] add context to thread success', props<{ threadId: string, context: string }>());
export const addContextToThreadFailure = createAction('[llm] add context to thread failure');