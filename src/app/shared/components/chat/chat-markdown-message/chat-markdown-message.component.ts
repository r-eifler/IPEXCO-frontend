import { Component, input } from '@angular/core';

import { MarkedPipe } from 'src/app/pipes/marked.pipe';

import { ChatMessageComponent, Role } from '../chat-message/chat-message.component';

@Component({
  selector: 'app-chat-markdown-message',
  imports: [
    ChatMessageComponent,
    MarkedPipe,
  ],
  templateUrl: './chat-markdown-message.component.html',
  styleUrl: './chat-markdown-message.component.scss'
})
export class ChatMarkdownMessageComponent {
  role = input.required<Role>();
  rawMessage = input.required<string>();
}
