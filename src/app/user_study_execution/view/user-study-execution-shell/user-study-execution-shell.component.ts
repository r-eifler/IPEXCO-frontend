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
import {UserStudyExecutionHandlerComponent} from '../../components/user-study-execution-handler/user-study-execution-handler.component';
import {
  selectExecutionUserStudy,
  selectExecutionUserStudyFinishedAllSteps,
  selectExecutionUserStudyStep,
  selectExecutionUserStudyStepIndex
} from '../../state/user-study-execution.selector';


@Component({
    selector: 'app-shell',
    imports: [
        RouterOutlet,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        AsyncPipe,
        UserStudyExecutionProgressComponent,
        UserStudyExecutionHandlerComponent,
    ],
    templateUrl: './user-study-execution-shell.component.html',
    styleUrl: './user-study-execution-shell.component.scss'
})
export class UserStudyExecutionShellComponent {

  store = inject(Store);

}
