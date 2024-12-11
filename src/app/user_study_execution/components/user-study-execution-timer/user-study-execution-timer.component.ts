import {Component, inject, output} from '@angular/core';
import {MatProgressBar} from '@angular/material/progress-bar';
import {interval, mapTo, Observable, skipWhile, switchMap, take, takeWhile} from 'rxjs';
import {selectExecutionUserStudyStep} from '../../state/user-study-execution.selector';
import {Store} from '@ngrx/store';
import {combineLatest, map} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { TimeOverDialogComponent } from '../time-over-dialog/time-over-dialog.component';
import { executionNextUserStudyStep } from '../../state/user-study-execution.actions';

@Component({
  selector: 'app-user-study-execution-timer',
  standalone: true,
  imports: [
    MatProgressBar,
    AsyncPipe
  ],
  templateUrl: './user-study-execution-timer.component.html',
  styleUrl: './user-study-execution-timer.component.scss',
})
export class UserStudyExecutionTimerComponent {

  store = inject(Store);
  dialog = inject(MatDialog);
  currentStep$ = this.store.select(selectExecutionUserStudyStep);

  over = output();

  showTimer$ = this.currentStep$.pipe(map(step => step?.type === 'demo'));

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

  overTime$ = this.remainingSeconds$.pipe(skipWhile(sec => sec > 0), map(() => true));

  

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
}
