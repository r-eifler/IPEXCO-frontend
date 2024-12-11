import {Component, computed, input, OnInit} from '@angular/core';
import {UserStudyStep} from '../../../user_study/domain/user-study';
import {number} from 'zod';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-user-study-execution-progress',
  standalone: true,
  imports: [
    MatProgressBarModule
  ],
  templateUrl: './user-study-execution-progress.component.html',
  styleUrl: './user-study-execution-progress.component.scss'
})
export class UserStudyExecutionProgressComponent implements OnInit {

  steps = input.required<UserStudyStep[]>();
  currentStepIndex = input.required<number>();

  progress = computed(() =>
    this.currentStepIndex() && this.steps()?.length > 0 ? this.currentStepIndex() / this.steps()?.length : 0)

  ngOnInit(): void {
      console.log(this.progress());
  }

}
