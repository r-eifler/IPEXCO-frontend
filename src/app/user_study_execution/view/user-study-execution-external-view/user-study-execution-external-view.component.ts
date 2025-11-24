import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { UserStudyFormStep, UserStudyStepType } from 'src/app/user_study/domain/user-study';
import { ActionType } from '../../domain/user-action';
import { executionLockNextStep, executionUnlockNextStep, logAction } from '../../state/user-study-execution.actions';
import { selectExecutionUserStudyStep, selectExecutionUserStudyStepIndex } from '../../state/user-study-execution.selector';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-user-study-execution-external-view',
    imports: [
        AsyncPipe,
        PageModule,
        MatAnchor,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
    ],
    templateUrl: './user-study-execution-external-view.component.html',
    styleUrl: './user-study-execution-external-view.component.scss'
})
export class UserStudyExecutionExternalViewComponent {

  fb = inject(FormBuilder);
  form = this.fb.group({
    code: this.fb.control<string | null>(null)
  })

  store = inject(Store);
  dialog = inject(MatDialog);
  step$ = this.store.select(selectExecutionUserStudyStep).pipe(
    map(s => s !== null && s.type === UserStudyStepType.form ? s as UserStudyFormStep : null)
  );
  stepIndex$ = this.store.select(selectExecutionUserStudyStepIndex);

  clickedLink = false;

  usesCode$ = this.step$.pipe(
    map(s => s !== null && s.content.code !== null)
  )

  code$ = this.step$.pipe(
    map(s => s?.content.code ?? null)
  )

  constructor(){
    this.usesCode$.pipe(
      take(1)
    ).subscribe(usesCode => {if(usesCode){this.store.dispatch(executionLockNextStep())}});
  }

  onClickLink(){
    this.store.select(selectExecutionUserStudyStepIndex).pipe(
      take(1)
    ).subscribe(index => {
      this.step$.pipe(take(1)).subscribe(step => {
        this.store.dispatch(logAction({
          action: {
            type: ActionType.OPEN_EXTERNAL_LINK, 
            data: {
                stepIndex: index,
                stepName: step?.name ?? 'Step without name'
            }
          }
        }));
      });
    });
    this.clickedLink = true;
  }

  onUnlock(){
    this.code$.pipe(take(1)).subscribe(expectedCode => {
      const enteredCode = this.form.controls.code.value;

      if (!expectedCode || !enteredCode || typeof expectedCode !== 'string' || typeof enteredCode !== 'string') return;
      
      const isValid = expectedCode.trim().toLowerCase() === enteredCode.trim().toLowerCase();
      
      if(isValid){
        this.store.dispatch(executionUnlockNextStep());
      }
    });
  }
}
