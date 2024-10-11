import { createReducer, on } from "@ngrx/store";
import { LoadingState } from "src/app/shared/common/loadable.interface";
import { Message } from "../domain/message";
import { sendMessageToLLM, sendMessageToLLMSuccess, sendMessageToLLMQuestionTranslator, sendMessageToLLMGoalTranslator, sendMessageToLLMExplanationTranslator, sendMessageToLLMQuestionTranslatorSuccess, sendMessageToLLMGoalTranslatorSuccess, sendMessageToLLMExplanationTranslatorSuccess, eraseLLMHistory } from "./llm.actions";

export interface LLMChatState {
    loadingState: LoadingState;
    messages: Message[]; // actually displayed messages.
    threadIdQT: string,
    threadIdGT: string,
    threadIdET: string
}

export const LLMChatFeature = 'llm';

const initialState: LLMChatState = {
    loadingState: LoadingState.Initial,
    messages: [],
    threadIdQT: '',
    threadIdGT: '',
    threadIdET: ''
}

export const llmChatReducer = createReducer(
    initialState,
    on(sendMessageToLLM, (state, { request }): LLMChatState => ({
        ...state,
        loadingState: LoadingState.Loading,
        messages: [...state.messages, { role: 'user', content: request }]
    })),
    on(sendMessageToLLMSuccess, (state, { response }): LLMChatState => ({
        ...state,
        loadingState: LoadingState.Done,
        messages: [...state.messages, { role: 'assistant', content: response }]
    })),
    on(eraseLLMHistory, (state): LLMChatState => ({
        ...state,
        loadingState: LoadingState.Initial,
        messages: [],
        threadIdQT: '',
        threadIdGT: '',
        threadIdET: ''
    })),
    on(sendMessageToLLMQuestionTranslator, (state, action): LLMChatState => ({
        ...state,
        loadingState: LoadingState.Loading,
    })),
    on(sendMessageToLLMQuestionTranslatorSuccess, (state, action): LLMChatState => ({
        ...state,
        loadingState: LoadingState.Done,
        threadIdQT: action.threadId
    })),
    on(sendMessageToLLMGoalTranslator, (state, action): LLMChatState => ({
        ...state,
        loadingState: LoadingState.Loading,
        messages: [...state.messages, {role: 'user', content: action.request}]
    })),
    on(sendMessageToLLMGoalTranslatorSuccess, (state, action): LLMChatState => ({
        ...state,
        loadingState: LoadingState.Done,
        threadIdGT: action.threadId,
        messages: [...state.messages, {role: 'assistant', content: action.response}]
    })),
    on(sendMessageToLLMExplanationTranslator, (state, action): LLMChatState => ({
        ...state,
        loadingState: LoadingState.Loading,
    })),
    on(sendMessageToLLMExplanationTranslatorSuccess, (state, action): LLMChatState => ({
        ...state,
        threadIdET: action.threadId
    })),
);