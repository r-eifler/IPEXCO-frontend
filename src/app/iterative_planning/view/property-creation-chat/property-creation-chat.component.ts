import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChatModule } from 'src/app/shared/component/chat/chat.module';
import { DialogModule } from 'src/app/shared/component/dialog/dialog.module';

@Component({
  selector: 'app-property-creation-chat',
  standalone: true,
  imports: [DialogModule, ChatModule],
  templateUrl: './property-creation-chat.component.html',
  styleUrl: './property-creation-chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyCreationChatComponent {

}
