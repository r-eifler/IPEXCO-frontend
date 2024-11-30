import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { sendMessageToLLM } from '../../state/llm.actions';
import { selectIsLoading, selectMessages } from './llm-base.component.selector';
import { ChatModule } from 'src/app/shared/component/chat/chat.module';
import { AsyncPipe } from '@angular/common';
import { PageModule } from 'src/app/shared/component/page/page.module';

@Component({
  selector: 'app-llm-base',
  standalone: true,
  imports: [
    ChatModule,
    AsyncPipe,
    PageModule,
  ],
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
