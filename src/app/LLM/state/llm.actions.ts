import { createAction, props } from "@ngrx/store";
import { QuestionTranslationRequest, GoalTranslationRequest, ExplanationTranslationRequest, GoalTranslationResponse, QuestionTranslationResponse, ExplanationTranslationResponse } from "../translators_interfaces";

export const sendMessageToLLM = createAction('[llm] send message', props<{request: string}>());
export const sendMessageToLLMSuccess = createAction('[llm] send message success',  props<{response: string}>());
export const sendMessageToLLMFailure = createAction('[llm] send message failure');

export const eraseLLMHistory = createAction('[llm] erase history');

export const sendMessageToLLMQuestionTranslator = createAction('[llm] send message to question translator', props<QuestionTranslationRequest>());
export const sendMessageToLLMQuestionTranslatorSuccess = createAction('[llm] send message to question translator success', props<{response: QuestionTranslationResponse}>());
export const sendMessageToLLMQuestionTranslatorFailure = createAction('[llm] send message to question translator failure');

export const sendMessageToLLMGoalTranslator = createAction('[llm] send message to goal translator', props<GoalTranslationRequest>());
export const sendMessageToLLMGoalTranslatorSuccess = createAction('[llm] send message to goal translator success', props<{response: GoalTranslationResponse}>());
export const sendMessageToLLMGoalTranslatorFailure = createAction('[llm] send message to goal translator failure');

export const sendMessageToLLMExplanationTranslator = createAction('[llm] send message to explanation translator', props<ExplanationTranslationRequest>());
export const sendMessageToLLMExplanationTranslatorSuccess = createAction('[llm] send message to explanation translator success', props<{response: ExplanationTranslationResponse}>());
export const sendMessageToLLMExplanationTranslatorFailure = createAction('[llm] send message to explanation translator failure');
