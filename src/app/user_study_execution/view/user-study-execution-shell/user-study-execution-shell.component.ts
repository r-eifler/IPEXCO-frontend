import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import {map, take} from 'rxjs/operators';
import {TimeOverDialogComponent} from '../../components/time-over-dialog/time-over-dialog.component';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {AskDeleteComponent} from '../../../shared/components/ask-delete/ask-delete.component';
import {executionNextUserStudyStep, executionUserStudyCancel} from '../../state/user-study-execution.actions';
import {MatDialog} from '@angular/material/dialog';
import {selectLoggedIn} from '../../../user/state/user.selector';
import {AsyncPipe} from '@angular/common';
import {UserStudyExecutionProgressComponent} from '../../components/user-study-execution-progress/user-study-execution-progress.component';
import {UserStudyExecutionTimerComponent} from '../../components/user-study-execution-timer/user-study-execution-timer.component';
import {
  selectExecutionUserStudy,
  selectExecutionUserStudyFinishedAllSteps,
  selectExecutionUserStudyStep,
  selectExecutionUserStudyStepIndex
} from '../../state/user-study-execution.selector';


@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    UserStudyExecutionProgressComponent,
    UserStudyExecutionTimerComponent,
  ],
  templateUrl: './user-study-execution-shell.component.html',
  styleUrl: './user-study-execution-shell.component.scss'
})
export class UserStudyExecutionShellComponent {

  store = inject(Store);
  dialog = inject(MatDialog);

  userStudy$ = this.store.select(selectExecutionUserStudy);
  currenStep$ = this.store.select(selectExecutionUserStudyStep);
  currenStepIndex$ = this.store.select(selectExecutionUserStudyStepIndex);
  loggedIn$ = this.store.select(selectLoggedIn);
  allStepsFinished$ = this.store.select(selectExecutionUserStudyFinishedAllSteps);

  showTimer$ = this.currenStep$.pipe(map(step => step.type === 'demo'));


  onTimeOver(){
   
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
