import { createAction, props } from "@ngrx/store";
import { TranslatorRequest } from "../translators_interfaces";

export const sendMessageToLLM = createAction('[llm] send message', props<TranslatorRequest>());
export const sendMessageToLLMSuccess = createAction('[llm] send message success', 
    props<{response: string}>());
export const sendMessageToLLMFailure = createAction('[llm] send message failure');
