import { createReducer, on } from "@ngrx/store";
import { LoadingState } from "src/app/shared/common/loadable.interface";
import { Message } from "../domain/message";
import { sendMessageToLLM, sendMessageToLLMSuccess, sendMessageToLLMQuestionTranslator, sendMessageToLLMGoalTranslator, sendMessageToLLMExplanationTranslator, sendMessageToLLMQuestionTranslatorSuccess, sendMessageToLLMGoalTranslatorSuccess, sendMessageToLLMExplanationTranslatorSuccess } from "./llm.actions";
import { ExplanationTranslationRequest, ExplanationTranslatorHistory, GoalTranslationRequest, GoalTranslatorHistory, QuestionTranslationRequest, QuestionTranslatorHistory } from "../translators_interfaces";

export interface LLMChatState {
    loadingState: LoadingState;
    messages: Message[]; // actually displayed messages.
    qt_history: QuestionTranslatorHistory;
    gt_history: GoalTranslatorHistory;
    et_history: ExplanationTranslatorHistory;
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
    on(sendMessageToLLMQuestionTranslator, (state, action): LLMChatState => ({
        ...state,
        qt_history: [...state.qt_history, { input: action, output: null }]
    })),
    on(sendMessageToLLMQuestionTranslatorSuccess, (state, action): LLMChatState => ({
        ...state,
        qt_history: [...state.qt_history.slice(0, -1), { input: state.qt_history[state.qt_history.length - 1].input, output: action.response }]
    })),
    on(sendMessageToLLMGoalTranslator, (state, action): LLMChatState => ({
        ...state,
        gt_history: [...state.gt_history, { input: action, output: null }]
    })),
    on(sendMessageToLLMGoalTranslatorSuccess, (state, action): LLMChatState => ({
        ...state,
        gt_history: [...state.gt_history.slice(0, -1), { input: state.gt_history[state.gt_history.length - 1].input, output: action.response }]
    })),
    on(sendMessageToLLMExplanationTranslator, (state, action): LLMChatState => ({
        ...state,
        et_history: [...state.et_history, { input: action, output: null }]
    })),
    on(sendMessageToLLMExplanationTranslatorSuccess, (state, action): LLMChatState => ({
        ...state,
        et_history: [...state.et_history.slice(0, -1), { input: state.et_history[state.et_history.length - 1].input, output: action.response }]
    })),
);