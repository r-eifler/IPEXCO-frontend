import {Component, input, output, SimpleChanges} from '@angular/core';
import {AvailableQuestion} from '../../iterative_planning/components/explanation-chat/explanation-chat.component';
import {MatListModule, MatListOption, MatSelectionListChange} from '@angular/material/list';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss'],
  imports: [
    MatListModule
  ],
  standalone: true
})

export class QuestionFormComponent {
  availableQuestions = input.required<AvailableQuestion[]>();
  isLoading = input.required<boolean>();

  questionSelected = output<AvailableQuestion>();
  avaQuestions: AvailableQuestion[] | undefined;
  firstChange: boolean = false;

  onQuestionSelected(question: AvailableQuestion): void {
    this.questionSelected.emit(question);
  }

  onSelectionChanged(event: MatSelectionListChange, option: MatListOption[]): void {
    const selected = option.map(o => o.value);
    if (selected.length === 1) {
      this.onQuestionSelected(selected[0]);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['availableQuestions'] && changes['availableQuestions'].currentValue){
      if (!this.firstChange){
        this.avaQuestions = Object.values(changes['availableQuestions'].currentValue);
        this.avaQuestions = this.avaQuestions.filter(ques => ques.questionType.toLowerCase().includes("why"));
        this.firstChange = true;
      }
    }
  }
}
