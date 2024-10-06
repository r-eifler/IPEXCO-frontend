import { createReducer, on } from "@ngrx/store";
import { LoadingState } from "src/app/shared/common/loadable.interface";
import { Message } from "../domain/message";
import { sendMessageToLLM, sendMessageToLLMSuccess } from "./llm.actions";

export interface LLMChatState {
    loadingState: LoadingState;
    messages: Message[];
}

export const LLMChatFeature = 'llm';

const initialState: LLMChatState = {
    loadingState: LoadingState.Initial,
    messages: [],
}


export const llmChatReducer = createReducer(
    initialState,
    on(sendMessageToLLM, (state, {request}): LLMChatState => ({
        ...state,
        loadingState: LoadingState.Loading,
        messages: [... state.messages, {role: 'user', content: request}]
    })),
    on(sendMessageToLLMSuccess, (state, {response}): LLMChatState => ({
        ...state,
        loadingState: LoadingState.Done,
        messages: [... state.messages, {role: 'assistant', content: response}]
    })),
);
