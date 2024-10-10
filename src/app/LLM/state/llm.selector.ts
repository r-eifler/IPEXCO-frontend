import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LLMChatFeature, LLMChatState } from "./llm.reducer";
import { IterativePlanningState } from "src/app/iterative_planning/state/iterative-planning.reducer";

export const IterativePlanningFeature = 'it_planning';
const selectLLMChatFeature = createFeatureSelector<LLMChatState>(LLMChatFeature);
const selectIterativePlanningFeature = createFeatureSelector<IterativePlanningState>(IterativePlanningFeature);

export const selectMessages = createSelector(selectLLMChatFeature, (state) => state.messages)
export const selectLoadingState = createSelector(selectLLMChatFeature, ({ loadingState }) => loadingState );
