import { Component, ElementRef, contentChildren, effect, input, viewChild } from '@angular/core';

import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatTypingComponent } from '../chat-typing/chat-typing.component';

@Component({
    selector: 'app-chat',
    imports: [ChatTypingComponent],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss'
})
export class ChatComponent {
  isSenderTyping = input<boolean>();

  chatMessages = contentChildren(ChatMessageComponent);
  scrollContainer = viewChild.required<ElementRef<HTMLDivElement>>('messageContainer');

  constructor() {
    effect(() => {
      this.chatMessages();

      const scrollContainer = this.scrollContainer().nativeElement;
      const scrollHeight = scrollContainer.scrollHeight;

      scrollContainer.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    })
  }
}
