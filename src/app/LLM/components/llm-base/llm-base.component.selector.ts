import { createSelector } from "@ngrx/store";
import { Message } from "src/app/LLM/domain/message";
import { selectMessages as selectLlmMessages, selectLoadingState } from "src/app/LLM/state/llm.selector";
import { LoadingState } from "src/app/shared/common/loadable.interface";
import { Role } from "src/app/shared/component/chat/chat-message/chat-message.component";

type ChatMessage = Omit<Message, 'role'> & { role: Role };

export const selectMessages = createSelector(selectLlmMessages, (messages) => messages?.map((message): ChatMessage => ({
  ...message,
  role: message.role === 'user' ? 'receiver' : 'sender',
})));

export const selectIsLoading = createSelector(selectLoadingState, (state) => state === LoadingState.Loading);
