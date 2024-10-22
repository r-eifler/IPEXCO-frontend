import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { sendMessageToLLM, sendMessageToLLMExplanationTranslator, sendMessageToLLMGoalTranslator } from 'src/app/LLM/state/llm.actions';

import { selectIsLoading, selectMessages } from './llm-chat-component.component.selector';
import { selectThreadIdGT, selectThreadIdQT } from 'src/app/LLM/state/llm.selector';
import { take, filter, map, mergeMap } from 'rxjs/operators';
import { selectIterativePlanningProject } from 'src/app/iterative_planning/state/iterative-planning.selector';
import { eraseLLMHistory } from 'src/app/LLM/state/llm.actions';
@Component({
  selector: 'app-llm-et-chat',
  templateUrl: './llm-chat-component.component.html',
  styleUrl: './llm-chat-component.component.scss',
})
export class LlmEtChatComponent {
  private store = inject(Store);

  messages$ = this.store.select(selectMessages);
  isLoading$ = this.store.select(selectIsLoading);
  threadIdQT$ = this.store.select(selectThreadIdQT);
  project$ = this.store.select(selectIterativePlanningProject);

  onUserMessage(request: string) {
    this.threadIdQT$.pipe(take(1)).subscribe(threadId => {
      this.store.dispatch(sendMessageToLLMExplanationTranslator({request, threadId}));
    });
  }

  onEraseHistory() {
    this.store.dispatch(eraseLLMHistory());
  }
}
