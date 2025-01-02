import {Component, computed, inject, input, OnInit} from '@angular/core';
import {UserStudyStep} from '../../../user_study/domain/user-study';
import {number} from 'zod';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { selectExecutionUserStudy, selectExecutionUserStudyStep, selectExecutionUserStudyStepIndex } from '../../state/user-study-execution.selector';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-user-study-execution-progress',
    imports: [
        MatProgressBarModule,
        AsyncPipe,
    ],
    templateUrl: './user-study-execution-progress.component.html',
    styleUrl: './user-study-execution-progress.component.scss'
})
export class UserStudyExecutionProgressComponent {

  store = inject(Store);

  userStudy$ = this.store.select(selectExecutionUserStudy);
  steps$ = this.userStudy$.pipe(map(study => study?.steps));
  currentStepIndex$ = this.store.select(selectExecutionUserStudyStepIndex);

  progress$ = combineLatest([this.steps$, this.currentStepIndex$]).pipe(
    map(([steps, stepIndex]) =>  stepIndex && steps?.length > 0 ? (stepIndex / (steps?.length - 1)) * 100 : 0)
  );


}
