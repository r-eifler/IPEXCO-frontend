import { Component, input } from '@angular/core';

import { ChatTypingComponent } from '../chat-typing/chat-typing.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ChatTypingComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  isSenderTyping = input<boolean>();
}
