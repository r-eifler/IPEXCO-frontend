import {Component, input, output} from '@angular/core';
import {AvailableQuestion} from '../../components/explanation-chat/explanation-chat.component';
import {ChatComponent} from '../../../shared/components/chat/chat/chat.component';
import {ChatActionComponent} from '../../../shared/components/chat/chat-action/chat-action.component';
import {ChatMessageComponent} from '../../../shared/components/chat/chat-message/chat-message.component';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss'],
  imports: [
    ChatComponent,
    ChatActionComponent,
    ChatMessageComponent
  ],
  standalone: true
})

export class QuestionFormComponent {
  availableQuestions = input.required<AvailableQuestion[]>();
  isLoading = input.required<boolean>();

  questionSelected = output<AvailableQuestion>();

  onQuestionSelected(question: AvailableQuestion): void {
    this.questionSelected.emit(question);
  }
}
