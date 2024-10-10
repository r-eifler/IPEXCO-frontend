import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LLMChatFeature, LLMChatState } from "./llm.reducer";
import { IterativePlanningState } from "src/app/iterative_planning/state/iterative-planning.reducer";

export const IterativePlanningFeature = 'it_planning';
const selectLLMChatFeature = createFeatureSelector<LLMChatState>(LLMChatFeature);
const selectIterativePlanningFeature = createFeatureSelector<IterativePlanningState>(IterativePlanningFeature);

export const selectMessages = createSelector(selectLLMChatFeature, (state) => state.messages)
export const selectLoadingState = createSelector(selectLLMChatFeature, ({ loadingState }) => loadingState);

export const selectThreadIdQT = createSelector(selectLLMChatFeature, ({ threadIdQT }) => threadIdQT);
export const selectThreadIdGT = createSelector(selectLLMChatFeature, ({ threadIdGT }) => threadIdGT);
export const selectThreadIdET = createSelector(selectLLMChatFeature, ({ threadIdET }) => threadIdET);