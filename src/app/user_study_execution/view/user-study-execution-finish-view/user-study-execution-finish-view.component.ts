import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { filterNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';
import { PageModule } from '../../../shared/components/page/page.module';
import { selectLoggedOut } from '../../../user/state/user.selector';
import { executionUserStudyCancel, executionUserStudySubmit } from '../../state/user-study-execution.actions';
import { selectExecutionUserStudy } from '../../state/user-study-execution.selector';

@Component({
    selector: 'app-user-study-execution-finish-view',
    imports: [
        MatButtonModule,
        PageModule,
        AsyncPipe,
        MatIconModule,
        TranslocoModule
    ],
    templateUrl: './user-study-execution-finish-view.component.html',
    styleUrl: './user-study-execution-finish-view.component.scss'
})
export class UserStudyExecutionFinishViewComponent {

  store = inject(Store);

  userStudy$ = this.store.select(selectExecutionUserStudy);

  isProlificStudy$ = this.userStudy$.pipe(
    filterNotNullOrUndefined(),
    map(userStudy => userStudy.redirectUrl !== null)
  )

  redirectLink$ = this.userStudy$.pipe(
    filterNotNullOrUndefined(),
    map(userStudy => userStudy.redirectUrl)
  )

  submitted$ = this.store.select(selectLoggedOut);

  onSubmit() {
    this.store.dispatch(executionUserStudySubmit());
  }

  onCancel() {
    this.store.dispatch(executionUserStudyCancel());
  }

}
