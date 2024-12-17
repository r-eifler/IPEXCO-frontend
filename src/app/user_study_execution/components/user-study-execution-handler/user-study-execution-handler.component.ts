import {Component, inject, output} from '@angular/core';
import {MatProgressBar} from '@angular/material/progress-bar';
import {filter, interval, mapTo, Observable, skipWhile, switchMap, take, takeWhile} from 'rxjs';
import {selectExecutionUserStudyFinishedAllSteps, selectExecutionUserStudyStep} from '../../state/user-study-execution.selector';
import {Store} from '@ngrx/store';
import {combineLatest, map} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { TimeOverDialogComponent } from '../time-over-dialog/time-over-dialog.component';
import { executionNextUserStudyStep, executionUserStudyCancel } from '../../state/user-study-execution.actions';
import { MatButtonModule } from '@angular/material/button';
import { AskDeleteComponent } from 'src/app/shared/components/ask-delete/ask-delete.component';
import { MatIconModule } from '@angular/material/icon';
import { selectLoggedIn } from 'src/app/user/state/user.selector';
import { UserStudyStepType } from 'src/app/user_study/domain/user-study';

@Component({
  selector: 'app-user-study-execution-handler',
  standalone: true,
  imports: [
    MatProgressBar,
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './user-study-execution-handler.component.html',
  styleUrl: './user-study-execution-handler.component.scss',
})
export class UserStudyExecutionHandlerComponent {

  store = inject(Store);
  dialog = inject(MatDialog);
  currentStep$ = this.store.select(selectExecutionUserStudyStep);
  loggedIn$ = this.store.select(selectLoggedIn);
  allStepsFinished$ = this.store.select(selectExecutionUserStudyFinishedAllSteps);

  over = output();

  isDemoStep$ = this.currentStep$.pipe(map(step => step?.type === 'demo'));

  startTime$ = this.currentStep$.pipe(map(step => step?.time));

  remainingTime$ = this.startTime$.pipe(
    switchMap(startTime => interval(1000).pipe(
      map(time => startTime - time)))
  )

  remainingSeconds$ = this.remainingTime$.pipe(map(sec => Math.max(0,sec)))
  remainingMinutes$ = this.remainingSeconds$.pipe(map(sec => Math.floor(sec/60)))
  remainingTimeFraction$ = combineLatest([this.remainingSeconds$, this.startTime$]).pipe(
    map(([remaining, start]) => (remaining/start) * 100)
  )

  timeOut$ = this.remainingTime$.pipe(map((sec) => sec === 0));

  allowContinue$ = combineLatest([this.remainingTime$, this.isDemoStep$]).pipe(
    map(([rsec, isDemoStep]) => rsec <= 0 || isDemoStep)
  )
  

  constructor(){
    this.timeOut$.pipe(
      takeUntilDestroyed(),
      filter((to) => to)
    ).subscribe(
        () => {
          console.log("Time over");
          this.over.emit();
        }
    )

    combineLatest([this.timeOut$,this.currentStep$]).pipe(
      takeUntilDestroyed(),
      filter(([to, _ ]) => to)
    ).subscribe(
      ([_, step]) => {
        if(step.type === UserStudyStepType.demo){
          console.log("Time over: Demo");
          const dialogRef = this.dialog.open(TimeOverDialogComponent)
          dialogRef.afterClosed().pipe(take(1)).subscribe(() => this.store.dispatch((executionNextUserStudyStep())))
        }
      }
    );
  }

  onCancel() {
    const dialogRef = this.dialog.open(AskDeleteComponent, {
      data: {
        name: 'Cancel User Study',
        text: 'Are you sure you want to cancel the user study? By clicking the cancel button all data related to this run will be delete.',
        buttonAgree: 'Cancel',
        buttonDisagree: 'Continue with user study'
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        this.store.dispatch(executionUserStudyCancel());
      }
    });
  }

  onNext() {
    this.store.dispatch((executionNextUserStudyStep()));
  }
}
