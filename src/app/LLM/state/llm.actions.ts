import { createAction, props } from "@ngrx/store";
import { QuestionTranslationRequest, GoalTranslationRequest, ExplanationTranslationRequest } from "../translators_interfaces";

export const sendMessageToLLM = createAction('[llm] send message', props<{request: string}>());
export const sendMessageToLLMSuccess = createAction('[llm] send message success',  props<{response: string}>());
export const sendMessageToLLMFailure = createAction('[llm] send message failure');

export const eraseLLMHistory = createAction('[llm] erase history');

export const sendMessageToLLMQuestionTranslator = createAction('[llm] send message to question translator', props<QuestionTranslationRequest>());
export const sendMessageToLLMGoalTranslator = createAction('[llm] send message to goal translator', props<GoalTranslationRequest>());
export const sendMessageToLLMExplanationTranslator = createAction('[llm] send message to explanation translator', props<ExplanationTranslationRequest>());
