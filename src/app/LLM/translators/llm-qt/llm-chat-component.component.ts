import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { sendMessageToLLMQuestionTranslator } from 'src/app/LLM/state/llm.actions';
import { selectIsLoading, selectMessages } from './llm-chat-component.component.selector';
import { selectThreadIdQT } from 'src/app/LLM/state/llm.selector';
import { take } from 'rxjs/operators';
import { selectIterativePlanningProject } from 'src/app/iterative_planning/state/iterative-planning.selector';
import { eraseLLMHistory } from 'src/app/LLM/state/llm.actions';
@Component({
  selector: 'app-llm-qt-chat',
  templateUrl: './llm-chat-component.component.html',
  styleUrl: './llm-chat-component.component.scss',
})
export class LlmQtChatComponent {
  private store = inject(Store);

  messages$ = this.store.select(selectMessages);
  isLoading$ = this.store.select(selectIsLoading);
  threadIdQT$ = this.store.select(selectThreadIdQT);
  project$ = this.store.select(selectIterativePlanningProject);

  // onUserMessage(request: string) {
  //   this.store.dispatch(sendMessageToLLM({ request }))
  // }

  onUserMessage(request: string) {
    this.threadIdQT$.pipe(take(1)).subscribe(threadId => {
      this.store.dispatch(sendMessageToLLMQuestionTranslator({request, threadId}));
    });
  }

  onEraseHistory() {
    this.store.dispatch(eraseLLMHistory());
  }
}
