import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ChatModule } from "src/app/shared/component/chat/chat.module";
import { QuestionType } from "../../domain/explanation/explanations";

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

}
