import { createReducer, on } from "@ngrx/store";
import { LoadingState } from "src/app/shared/common/loadable.interface";
import { Message } from "../domain/message";
import { sendMessageToLLM, sendMessageToLLMSuccess } from "./llm.actions";
import { ExplanationTranslationRequest, GoalTranslationRequest, QuestionTranslationRequest } from "../translators_interfaces";

export interface LLMChatState {
    loadingState: LoadingState;
    messages: Message[]; // actually displayed messages.
    qt_history: QuestionTranslationRequest[]; 
    gt_history: GoalTranslationRequest[];
    et_history: ExplanationTranslationRequest[];        
}

export const LLMChatFeature = 'llm';

const initialState: LLMChatState = {
    loadingState: LoadingState.Initial,
    messages: [],
    qt_history: [],
    gt_history: [],
    et_history: []
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
