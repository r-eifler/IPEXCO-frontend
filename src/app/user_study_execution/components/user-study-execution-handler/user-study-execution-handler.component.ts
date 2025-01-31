import {Component, inject, output} from '@angular/core';
import {MatProgressBar} from '@angular/material/progress-bar';
import {combineLatestAll, combineLatestWith, filter, interval, mapTo, Observable, skipWhile, startWith, switchMap, take, takeWhile, tap, withLatestFrom} from 'rxjs';
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
import { TimerStartsDialogComponent } from '../timer-starts-dialog/timer-starts-dialog.component';
import { FinishDemoInfoDialogComponent } from '../finish-demo-info-dialog/finish-demo-info-dialog.component';
import { selectIterativePlanningCurrentMaxUtility, selectIterativePlanningMaxPossibleUtility, selectIterativePlanningProject } from 'src/app/iterative_planning/state/iterative-planning.selector';

@Component({
    selector: 'app-user-study-execution-handler',
    imports: [
        MatProgressBar,
        AsyncPipe,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './user-study-execution-handler.component.html',
    styleUrl: './user-study-execution-handler.component.scss'
})
export class UserStudyExecutionHandlerComponent {

  store = inject(Store);
  dialog = inject(MatDialog);
  currentStep$ = this.store.select(selectExecutionUserStudyStep);
  loggedIn$ = this.store.select(selectLoggedIn);
  allStepsFinished$ = this.store.select(selectExecutionUserStudyFinishedAllSteps);
  maxPossibleUtility$ = this.store.select(selectIterativePlanningMaxPossibleUtility);
  currentMaxUtility$ = this.store.select(selectIterativePlanningCurrentMaxUtility);

  over = output();

  isDemoStep$ = this.currentStep$.pipe(map(step => step?.type === 'demo'));

  startTime$ = this.currentStep$.pipe(
    filter(s => !!s),
    map(step => step?.time),
  );

  remainingTime$ = this.startTime$.pipe(
    switchMap(startTime => interval(1000).pipe(
      map(time => startTime - time)))
  )

  remainingSeconds$ = this.remainingTime$.pipe(map(sec => Math.max(0,sec)))
  remainingMinutes$ = this.remainingSeconds$.pipe(map(sec => Math.floor(sec/60)))
  remainingTimeFraction$ = combineLatest([this.remainingSeconds$, this.startTime$]).pipe(
    map(([remaining, start]) => (remaining/start) * 100),
    startWith(1)
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
          this.over.emit();
        }
    )

    this.currentStep$.pipe(
      takeUntilDestroyed(),
      filter((step) => !!step)
    ).subscribe(
      (step) => {
        if(step.type === UserStudyStepType.demo){
          const dialogRef = this.dialog.open(TimerStartsDialogComponent, {data: {timeout: Math.floor(step.time / 60)}})
        }
      }
    );

    this.timeOut$.pipe(
      takeUntilDestroyed(),
      withLatestFrom(this.currentStep$),
      filter(([to, step ]) => to && !!step)
    ).subscribe(
      ([_, step]) => {
        if(step.type === UserStudyStepType.demo){
          const dialogRef = this.dialog.open(TimeOverDialogComponent);
          dialogRef.afterClosed().pipe(take(1)).subscribe(() => this.store.dispatch((executionNextUserStudyStep())))
        }
      }
    );

    this.currentMaxUtility$.pipe(
      takeUntilDestroyed(),
      withLatestFrom(this.maxPossibleUtility$, this.currentStep$, this.store.select(selectIterativePlanningProject)),
      filter(([cur, max, step, demo]) => cur && max && !!step && !!demo && cur == max),
    ).subscribe(
      ([cur, max, step, demo]) => {
        if(step.type === UserStudyStepType.demo){
          let dialogRef = null;
          if(demo.settings.userStudy.introTask){
            dialogRef = this.dialog.open(AskDeleteComponent, {
              data: {
                name: 'Maximal Possible Utility',
                text: 'Congratulation you achieved the maximal possible utility. If you need more time to familiarize yourself with the tool you can go back to the introduction task. If you feel comfortable with the tool you can continue with the next step.',
                buttonAgree: 'Next User Study Part',
                buttonDisagree: 'Back to Introduction Task'
              },
            });
          }
          else{
            dialogRef = this.dialog.open(AskDeleteComponent, {
              data: {
                name: 'Maximal Possible Utility',
                text: 'Congratulation you achieved the maximal possible utility. Please continue with the next part of the user study.',
                buttonAgree: 'Next User Study Part',
                buttonDisagree: 'Back to Task'
              },
            });
          }
          dialogRef.afterClosed().pipe(take(1)).subscribe((result ) => {
            if(result){
              this.store.dispatch((executionNextUserStudyStep()));
            }
          });
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
      if(result){
        this.store.dispatch(executionUserStudyCancel());
      }
    });
  }

  onNext() {
    this.currentStep$.pipe(
      filter((step) => !!step),
      take(1),
    ).subscribe(
      (step) => {
        if(step.type === UserStudyStepType.demo){
          const dialogRef = this.dialog.open(FinishDemoInfoDialogComponent)
          dialogRef.afterClosed().pipe(take(1)).subscribe((nextUserStudyStep) => {
            if(nextUserStudyStep){
              this.store.dispatch((executionNextUserStudyStep()));
            }
          })
        }
        else{
          this.store.dispatch(executionNextUserStudyStep());
        }
      }
    );
  }
}
