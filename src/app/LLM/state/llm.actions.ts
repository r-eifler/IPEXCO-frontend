import { createAction, props } from "@ngrx/store";

export const sendMessageToLLM = createAction('[llm] send message', props<{request: string}>());
export const sendMessageToLLMSuccess = createAction('[llm] send message success', 
    props<{response: string}>());
export const sendMessageToLLMFailure = createAction('[llm] send message failure');
