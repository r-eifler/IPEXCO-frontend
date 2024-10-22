import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { sendMessageToLLM, sendMessageToLLMGoalTranslator } from 'src/app/LLM/state/llm.actions';
import { selectIsLoading, selectMessages } from './llm-chat-component.component.selector';
import { selectThreadIdGT } from 'src/app/LLM/state/llm.selector';
import { take } from 'rxjs/operators';
import { selectIterativePlanningProject } from 'src/app/iterative_planning/state/iterative-planning.selector';
import { eraseLLMHistory } from 'src/app/LLM/state/llm.actions';
@Component({
  selector: 'app-llm-gt-chat',
  templateUrl: './llm-chat-component.component.html',
  styleUrl: './llm-chat-component.component.scss',
})
export class LlmGtChatComponent {
  private store = inject(Store);

  messages$ = this.store.select(selectMessages);
  isLoading$ = this.store.select(selectIsLoading);
  threadIdGT$ = this.store.select(selectThreadIdGT);
  project$ = this.store.select(selectIterativePlanningProject);

  // onUserMessage(request: string) {
  //   this.store.dispatch(sendMessageToLLM({ request }))
  // }

  onUserMessage(request: string) {
    this.threadIdGT$.pipe(take(1)).subscribe(threadId => {
      this.store.dispatch(sendMessageToLLMGoalTranslator({request, threadId}));
    });
  }

  onEraseHistory() {
    this.store.dispatch(eraseLLMHistory());
  }
}
