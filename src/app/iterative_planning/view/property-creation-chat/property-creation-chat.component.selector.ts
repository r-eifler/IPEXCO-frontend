import { createSelector } from "@ngrx/store";
import { Message } from "src/app/LLM/domain/message";
import { selectLLMChatMessages as selectLlmMessages, selectLLMChatLoadingState } from "src/app/iterative_planning/state/iterative-planning.selector";
import { LoadingState } from "src/app/shared/common/loadable.interface";
import { Role } from "src/app/shared/components/chat/chat-message/chat-message.component";

type ChatMessage = Omit<Message, 'role'> & { role: Role };

export const selectMessages = createSelector(selectLlmMessages, (messages) => messages?.map((message): ChatMessage => ({
  ...message,
  role: message.role
})));

export const selectIsLoading = createSelector(selectLLMChatLoadingState, (state) => state === LoadingState.Loading);
