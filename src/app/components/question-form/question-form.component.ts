import {Component, inject, input, output, SimpleChanges} from '@angular/core';
import {AvailableQuestion} from '../../iterative_planning/components/explanation-chat/explanation-chat.component';
import {MatListModule, MatListOption, MatSelectionListChange} from '@angular/material/list';
import {Store} from '@ngrx/store';
import {logAction} from '../../user_study_execution/state/user-study-execution.actions';
import {ActionType} from '../../user_study_execution/domain/user-action';
import {QuestionType} from '../../iterative_planning/domain/explanation/explanations';

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
  private store = inject(Store);

  availableQuestions = input.required<AvailableQuestion[]>();
  isLoading = input.required<boolean>();
  demoId = input.required<string>();
  stepId = input.required<string>();

  questionSelected = output<AvailableQuestion>();
  avaQuestions: AvailableQuestion[] | undefined;
  firstChange: boolean = false;

  onQuestionSelected(question: AvailableQuestion): void {
    this.store.dispatch(logAction({
      action: {
        type: ActionType.ASK_QUESTION,
        timeStamp: new Date(),
        data: {
          questionType: QuestionType.WHY_PLAN,
          demoId: this.demoId(),
          stepId: this.stepId()
        }
      }
    }))
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
