import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { sendMessageToLLM, sendMessageToLLMGoalTranslator } from 'src/app/LLM/state/llm.actions';
import { ChatModule } from 'src/app/shared/component/chat/chat.module';
import { DialogModule } from 'src/app/shared/component/dialog/dialog.module';
import { selectIsLoading, selectMessages } from './property-creation-chat.component.selector';

@Component({
  selector: 'app-property-creation-chat',
  standalone: true,
  imports: [AsyncPipe, DialogModule, ChatModule],
  templateUrl: './property-creation-chat.component.html',
  styleUrl: './property-creation-chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyCreationChatComponent {
  private store = inject(Store);

  messages$ = this.store.select(selectMessages);
  isLoading$ = this.store.select(selectIsLoading);
  threadIdGT = this.store.select(selectThreadIdGT);

  // onUserMessage(request: string) {
  //   this.store.dispatch(sendMessageToLLM({ request }))
  // }

  onUserMessage(request: string) {
    this.store.dispatch(sendMessageToLLMGoalTranslator({"request": request }))
  }
}
