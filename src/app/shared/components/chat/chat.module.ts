import { NgModule } from "@angular/core";

import { ChatActionComponent } from "./chat-action/chat-action.component";
import { ChatInputComponent } from "./chat-input/chat-input.component";
import { ChatMessageComponent } from "./chat-message/chat-message.component";
import { ChatComponent } from "./chat/chat.component";
import { ChatMarkdownMessageComponent } from "./chat-markdown-message/chat-markdown-message.component";

@NgModule({
  imports: [ChatComponent, ChatActionComponent, ChatMessageComponent, ChatMarkdownMessageComponent, ChatInputComponent],
  exports: [ChatComponent, ChatActionComponent, ChatMessageComponent, ChatMarkdownMessageComponent, ChatInputComponent],
})
export class ChatModule { }
