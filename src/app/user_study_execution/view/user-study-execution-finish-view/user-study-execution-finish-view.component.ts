import {Component, inject, output} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {Store} from '@ngrx/store';
import {PageModule} from '../../../shared/components/page/page.module';
import {executionUserStudyCancel, executionUserStudySubmit} from '../../state/user-study-execution.actions';

@Component({
  selector: 'app-user-study-execution-finish-view',
  standalone: true,
  imports: [
    MatButton,
    PageModule,
  ],
  templateUrl: './user-study-execution-finish-view.component.html',
  styleUrl: './user-study-execution-finish-view.component.scss'
})
export class UserStudyExecutionFinishViewComponent {

  store = inject(Store);

  // TODO wait for success from server
  submitted = false;
  canceled = false;

  onSubmit() {
    this.store.dispatch(executionUserStudySubmit());
    this.submitted = true
  }
  onCancel() {
    this.store.dispatch(executionUserStudyCancel());
    this.canceled = true;
  }

}
