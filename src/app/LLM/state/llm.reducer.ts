import { createReducer, on } from "@ngrx/store";
import { Message } from "../domain/message";
import { sendMessageToLLM, sendMessageToLLMSuccess } from "./llm.actions";

export interface LLMChatState {
    messages: Message[];
}

export const LLMChatFeature = 'llm';

const initialState: LLMChatState = {
    messages: [],
}


export const llmChatReducer = createReducer(
    initialState,
    on(sendMessageToLLM, (state, {request}): LLMChatState => ({
        ...state,
        messages: [... state.messages, {role: 'user', content: request}]
    })),
    on(sendMessageToLLMSuccess, (state, {response}): LLMChatState => ({
        ...state,
        messages: [... state.messages, {role: 'assistant', content: response}]
    })),
);