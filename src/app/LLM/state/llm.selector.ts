import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LLMChatFeature, LLMChatState } from "./llm.reducer";


const selectLLMChatFeature = createFeatureSelector<LLMChatState>(LLMChatFeature);

export const selectMessages = createSelector(selectLLMChatFeature, (state) => state.messages)
