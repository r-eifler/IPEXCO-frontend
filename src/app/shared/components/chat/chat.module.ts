import { NgModule } from "@angular/core";

import { ChatActionComponent } from "./chat-action/chat-action.component";
import { ChatInputComponent } from "./chat-input/chat-input.component";
import { ChatMessageComponent } from "./chat-message/chat-message.component";
import { ChatComponent } from "./chat/chat.component";

@NgModule({
  imports: [ChatComponent, ChatActionComponent, ChatMessageComponent, ChatInputComponent],
  exports: [ChatComponent, ChatActionComponent, ChatMessageComponent, ChatInputComponent],
})
export class ChatModule { }
