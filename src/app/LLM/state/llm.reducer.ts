import { createReducer, on } from "@ngrx/store";
import { LoadingState } from "src/app/shared/common/loadable.interface";
import { Message } from "../domain/message";
import { sendMessageToLLM, sendMessageToLLMSuccess, sendMessageToLLMQuestionTranslator, sendMessageToLLMGoalTranslator, sendMessageToLLMExplanationTranslator, sendMessageToLLMQuestionTranslatorSuccess, sendMessageToLLMGoalTranslatorSuccess, sendMessageToLLMExplanationTranslatorSuccess, eraseLLMHistory, sendMessageToLLMAllTranslators, sendMessageToLLMAllTranslatorsSuccess } from "./llm.actions";
import { addContextToThread, addContextToThreadSuccess, addContextToThreadFailure } from "./llm.actions";
export interface LLMChatState {
    loadingState: LoadingState;
    messages: Message[]; // actually displayed messages.
    threadIdQT: string,
    threadIdGT: string,
    threadIdET: string
}

export const LLMChatFeature = 'llm';
export const LLMQTFeature = 'llm-qt';
export const LLMGTFeature = 'llm-gt';
export const LLMETFeature = 'llm-et';

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
        threadIdET: action.threadId
    })),
    on(sendMessageToLLMExplanationTranslatorSuccess, (state, action): LLMChatState => ({
        ...state,
        threadIdET: action.threadId,
        loadingState: LoadingState.Done
    })),
    on(sendMessageToLLMAllTranslators, (state, action): LLMChatState => ({
        ...state,
        loadingState: LoadingState.Loading,
        messages: [...state.messages, {role: 'user', content: action.request}]
    })),
    on(sendMessageToLLMAllTranslatorsSuccess, (state, action): LLMChatState => ({
        ...state,
        loadingState: LoadingState.Done,
        threadIdQT: action.threadIdQt,
        threadIdGT: action.threadIdGt,
        threadIdET: action.threadIdEt,
        messages: [...state.messages, {role: 'assistant', content: action.explanationTranslation}]
    })),

);
