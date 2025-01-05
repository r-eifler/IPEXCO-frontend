import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectExecutionUserStudyStep, selectExecutionUserStudyDemo, selectExecutionUserStudyPlanProperties } from '../../state/user-study-execution.selector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { loadUserStudyDemo } from '../../state/user-study-execution.actions';
import { UserStudyStepType } from 'src/app/user_study/domain/user-study';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { UserManualComponent } from '../../../iterative_planning/components/user-manual/user-manual.component';
import { MatIconModule } from '@angular/material/icon';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-manual-view',
  imports: [
    PageModule,
    UserManualComponent,
    MatIconModule,
    InfoComponent,
    AsyncPipe
  ],
  templateUrl: './user-manual-view.component.html',
  styleUrl: './user-manual-view.component.scss'
})
export class UserManualViewComponent {
  
  store = inject(Store);

  step$ = this.store.select(selectExecutionUserStudyStep);
  demo$ = this.store.select(selectExecutionUserStudyDemo);
  planProperties$ = this.store.select(selectExecutionUserStudyPlanProperties);

  constructor(){


    this.step$.pipe(
      takeUntilDestroyed(),
      filter(s => !!s && s.type == UserStudyStepType.userManual)
    ).subscribe(s => this.store.dispatch(loadUserStudyDemo({demoId: s.content})))
    
  }

}
