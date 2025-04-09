import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MarkedPipe } from 'src/app/pipes/marked.pipe';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';
import { PageModule } from '../../../shared/components/page/page.module';
import { registerUserStudyUser } from '../../state/user-study-execution.actions';
import { selectExecutionProlificId, selectExecutionUserStudy } from '../../state/user-study-execution.selector';

@Component({
    selector: 'app-user-study-execution-agreement-view',
    imports: [
        AsyncPipe,
        MatButtonModule,
        PageModule,
        InfoComponent,
        MatIconModule,
        MarkedPipe
    ],
    templateUrl: './user-study-execution-agreement-view.component.html',
    styleUrl: './user-study-execution-agreement-view.component.scss'
})
export class UserStudyExecutionAgreementViewComponent {

  store = inject(Store);
  router = inject(Router);

  userStudy$ = this.store.select(selectExecutionUserStudy);
  prolificId$ = this.store.select(selectExecutionProlificId);


  onAccept(id: string, prolificId: string | null) {
    this.store.dispatch(registerUserStudyUser({id, prolificId}));
  }
}
