import {Component, inject, output} from '@angular/core';
import {MatProgressBar} from '@angular/material/progress-bar';
import {interval, skipWhile, switchMap, takeWhile} from 'rxjs';
import {selectExecutionUserStudyStep} from '../../state/user-study-execution.selector';
import {Store} from '@ngrx/store';
import {combineLatest, map} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
  currenStep$ = this.store.select(selectExecutionUserStudyStep);

  over = output();

  startTime$ = this.currenStep$.pipe(map(step => step.time));

  remainingSeconds$ = this.startTime$.pipe(
    switchMap(startTime => interval(1000).pipe(
      takeWhile(time => time <= startTime),
      map(time => startTime - time)))
  )

  remainingMinutes$ = this.remainingSeconds$.pipe(map(sec => Math.floor(sec/60)))
  remainingTimeFraction$ = combineLatest([this.remainingSeconds$, this.startTime$]).pipe(
    map(([remaining, start]) => (remaining/start) * 100)
  )

  constructor(){
    this.remainingSeconds$.pipe(
      takeUntilDestroyed(),
      skipWhile(sec => sec > 0)).subscribe(
        () => this.over.emit()
    )
  }
}
