import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { combineLatest, map, shareReplay, startWith, take } from 'rxjs';
import { filterListNotNullOrUndefined, filterNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { UserStudyFormStep, UserStudyStepType } from 'src/app/user_study/domain/user-study';
import { ActionType } from '../../domain/user-action';
import { executionLockNextStep, executionUnlockNextStep, logAction } from '../../state/user-study-execution.actions';
import { selectExecutionUserStudyStep, selectExecutionUserStudyStepIndex } from '../../state/user-study-execution.selector';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from "@angular/common";

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
        NgIf
    ],
    templateUrl: './user-study-execution-external-view.component.html',
    styleUrl: './user-study-execution-external-view.component.scss'
})
export class UserStudyExecutionExternalViewComponent {

  fb = inject(FormBuilder);
  form = this.fb.group({
    code: this.fb.control<string | null>(null)
  })
  enteredCode$ = this.form.controls.code.valueChanges;

  store = inject(Store);
  dialog = inject(MatDialog);
  step$ = this.store.select(selectExecutionUserStudyStep).pipe(
    map(s => s !== null && s.type === UserStudyStepType.form ? s as UserStudyFormStep : null)
  );
  stepIndex$ = this.store.select(selectExecutionUserStudyStepIndex);

  clickedLink = false;
  unlocked = false;

  usesCode$ = this.step$.pipe(
    filterNotNullOrUndefined(),
    map(s => s.content.code !== null)
  )

  code$ = this.step$.pipe(
    filterNotNullOrUndefined(),
    map(s => s.content.code)
  )

  codeValid$ = combineLatest([this.code$, this.enteredCode$]).pipe(
    filterListNotNullOrUndefined(),
    map(([code, enteredCode]) => code === enteredCode),
    startWith(false),
    shareReplay(1)
  );

  constructor(){
    this.usesCode$.pipe(
      take(1)
    ).subscribe(usesCode => {if(usesCode){this.store.dispatch(executionLockNextStep())}});

    // HACK: subscribe to codeValid, otherwise onUnlock might break
    this.codeValid$.pipe(take(1)).subscribe();
  }

  onClickLink(){
    combineLatest([this.stepIndex$, this.step$]).pipe(take(1)).subscribe(([index, step]) =>
      this.store.dispatch(logAction({
        action: {
          type: ActionType.OPEN_EXTERNAL_LINK,
          data: {
              stepIndex: index,
              stepName: step?.name ?? 'Step without name'
          }
        }
      }))
    );
    this.clickedLink = true;
  }

  onUnlock(){
    this.codeValid$.pipe(take(1)).subscribe(
      (valid) => {
        if(valid){
          this.store.dispatch(executionUnlockNextStep());
          this.unlocked = true;
        }
    });
  }
}
