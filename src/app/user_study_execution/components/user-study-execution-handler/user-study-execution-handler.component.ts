import {Component, inject, output} from '@angular/core';
import {MatProgressBar} from '@angular/material/progress-bar';
import {interval, mapTo, Observable, skipWhile, switchMap, take, takeWhile} from 'rxjs';
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

  remainingSeconds$ = this.startTime$.pipe(
    switchMap(startTime => interval(1000).pipe(
      takeWhile(time => time <= startTime),
      map(time => startTime - time)))
  )

  remainingMinutes$ = this.remainingSeconds$.pipe(map(sec => Math.floor(sec/60)))
  remainingTimeFraction$ = combineLatest([this.remainingSeconds$, this.startTime$]).pipe(
    map(([remaining, start]) => (remaining/start) * 100)
  )

  overTime$ = this.remainingSeconds$.pipe(skipWhile(sec => sec > 0), map(() => void undefined));

  allowContinue$ = combineLatest([this.remainingSeconds$, this.isDemoStep$]).pipe(
    map(([rsec, isDemoStep]) => rsec === 0 || isDemoStep)
  )
  

  constructor(){
    this.overTime$.pipe(takeUntilDestroyed()).subscribe(
        () => this.over.emit()
    )

    combineLatest([this.overTime$,this.currentStep$]).pipe(take(1)).subscribe(
      ([_, step]) => {
        if(step.type === 'demo'){
          console.log("Time over");
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
