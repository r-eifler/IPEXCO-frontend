import { JsonPipe, NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { ChatModule } from "src/app/shared/components/chat/chat.module";
import { QuestionType } from "../../domain/explanation/explanations";
import { ExplanationMessage, StructuredText } from "../../domain/interface/explanation-message";
import { PlanProperty } from "../../../shared/domain/plan-property/plan-property";
import { StructuredTextComponent } from "../structured-text/structured-text.component";

export type AvailableQuestion = {
  message: StructuredText;
  questionType: QuestionType;
}

@Component({
    selector: "app-explanation-chat-hybrid",
    imports: [ChatModule, StructuredTextComponent],
    templateUrl: "./explanation-chat-hybrid.component.html",
    styleUrl: "./explanation-chat-hybrid.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplanationChatHybridComponent {
  availableQuestions = input.required<AvailableQuestion[]>();
  messages = input.required<ExplanationMessage[]>();
  properties = input.required<Record<string, PlanProperty>>();
  isLoading = input.required<boolean>();

  questionSelected = output<AvailableQuestion>();

  onQuestionSelected(question: AvailableQuestion): void {
    this.questionSelected.emit(question);
  }
}
