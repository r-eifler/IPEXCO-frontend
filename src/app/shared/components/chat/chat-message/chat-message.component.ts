import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

export type Role = 'receiver' | 'sender';

@Component({
    selector: 'app-chat-message',
    imports: [NgClass],
    templateUrl: './chat-message.component.html',
    styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  role = input.required<Role>();
}
