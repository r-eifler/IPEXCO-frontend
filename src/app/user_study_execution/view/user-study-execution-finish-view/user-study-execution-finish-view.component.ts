import {Component, inject, output} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {Store} from '@ngrx/store';
import {PageModule} from '../../../shared/components/page/page.module';
import {executionUserStudyCancel, executionUserStudySubmit} from '../../state/user-study-execution.actions';
import {selectLoggedIn, selectLoggedOut} from '../../../user/state/user.selector';
import {selectExecutionUserStudyCanceled} from '../../state/user-study-execution.selector';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-user-study-execution-finish-view',
    imports: [
        MatButton,
        PageModule,
        AsyncPipe,
        MatIconModule
    ],
    templateUrl: './user-study-execution-finish-view.component.html',
    styleUrl: './user-study-execution-finish-view.component.scss'
})
export class UserStudyExecutionFinishViewComponent {

  store = inject(Store);

  submitted$ = this.store.select(selectLoggedOut);

  onSubmit() {
    this.store.dispatch(executionUserStudySubmit());
  }

  onCancel() {
    this.store.dispatch(executionUserStudyCancel());
  }

}
