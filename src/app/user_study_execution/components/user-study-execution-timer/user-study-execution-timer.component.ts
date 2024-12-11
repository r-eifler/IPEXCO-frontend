import {Component, effect, input} from '@angular/core';
import {MatProgressBar} from '@angular/material/progress-bar';
import {number} from 'zod';

@Component({
  selector: 'app-user-study-execution-timer',
  standalone: true,
  imports: [
    MatProgressBar
  ],
  templateUrl: './user-study-execution-timer.component.html',
  styleUrl: './user-study-execution-timer.component.scss'
})
export class UserStudyExecutionTimerComponent {

  time = input.required<number>();

  remainingSeconds = 0;
  remainingMinutes = 0;

  remainingTimeFraction = 1;


  constructor() {
    this.remainingTimeFraction = 1;

    effect(() => {
      this.remainingSeconds = this.time()
      this.remainingTimeFraction = 1
    });

    setInterval(() => {
      if(this.remainingSeconds > 0){
        this.remainingSeconds -= 1;
        this.remainingMinutes = Math.floor(this.remainingSeconds / 60);
        this.remainingTimeFraction = (this.remainingSeconds / this.time()) * 100;
      }
    }, 1000);
  }

}
