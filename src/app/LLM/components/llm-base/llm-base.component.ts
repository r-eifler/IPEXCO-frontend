import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { sendMessageToLLM } from '../../state/llm.actions';
import { selectIsLoading, selectMessages } from './llm-base.component.selector';

@Component({
  selector: 'app-llm-base',
  templateUrl: './llm-base.component.html',
  styleUrl: './llm-base.component.scss'
})
export class LlmBaseComponent {
  private store = inject(Store);

  messages$ = this.store.select(selectMessages);
  isLoading$ = this.store.select(selectIsLoading);

  onUserMessage(request: string) {
    this.store.dispatch(sendMessageToLLM({ request }))
  }
}
