import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { ChatModule } from "src/app/shared/component/chat/chat.module";
import { QuestionType } from "../../domain/explanation/explanations";
import { ExplanationMessage } from "../../domain/interface/explanation-message";

export type AvailableQuestion = {
  message: string;
  questionType: QuestionType;
}

@Component({
  selector: "app-explanation-chat",
  standalone: true,
  imports: [ChatModule, JsonPipe],
  templateUrl: "./explanation-chat.component.html",
  styleUrl: "./explanation-chat.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplanationChatComponent {
  availableQuestions = input.required<AvailableQuestion[]>();
  messages = input.required<ExplanationMessage[]>();

  questionSelected = output<AvailableQuestion>();

  onQuestionSelected(question: AvailableQuestion): void {
    this.questionSelected.emit(question);
  }
}
