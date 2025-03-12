import {Component, input, output, SimpleChanges} from '@angular/core';
import {AvailableQuestion} from '../../components/explanation-chat/explanation-chat.component';
import {MatListModule, MatListOption, MatSelectionListChange} from '@angular/material/list';
import {PlanProperty} from '../../../shared/domain/plan-property/plan-property';

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
  property = input.required<PlanProperty>();

  questionSelected = output<AvailableQuestion>();
  avaQuestions: AvailableQuestion[];
  firstChange: boolean = false;
  selectedItem = null;

  onQuestionSelected(question: AvailableQuestion): void {
    this.questionSelected.emit(question);
  }

  onSelectionChanged(event: MatSelectionListChange, option: MatListOption[]): void {
    const selected = option.map(o => o.value);
    if (selected.length === 1) {
      this.selectedItem = selected[0];
      this.onQuestionSelected(this.selectedItem);
    }else{
      event.source.selectedOptions.clear()
      this.selectedItem = null;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['availableQuestions'] && changes['availableQuestions'].currentValue){
      if (!this.firstChange){
        this.avaQuestions = JSON.parse(JSON.stringify(Object.values(changes['availableQuestions'].currentValue)));
        this.firstChange = true;
      }
    }
  }
}
