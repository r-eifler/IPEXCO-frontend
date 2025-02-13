import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { selectExecutionUserStudy, selectExecutionUserStudyStepIndex } from '../../state/user-study-execution.selector';
import { inputIsNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';

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
    filter((list) => list.every(inputIsNotNullOrUndefined)),
    map(([steps, stepIndex]) =>  steps !== undefined && stepIndex !== null && steps?.length > 0 ? 
      (stepIndex / (steps?.length - 1)) * 100 : 
      0
    )
  );


}

