import { Component, input } from '@angular/core';
import { Role } from '../chat-message/chat-message.component';
import { MarkedPipe } from 'src/app/pipes/marked.pipe';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-chat-markdown-message',
  imports: [
    NgClass,
    MarkedPipe
  ],
  templateUrl: './chat-markdown-message.component.html',
  styleUrl: './chat-markdown-message.component.scss'
})
export class ChatMarkdownMessageComponent {
  role = input.required<Role>();
  rawMessage = input.required<string>();
}
