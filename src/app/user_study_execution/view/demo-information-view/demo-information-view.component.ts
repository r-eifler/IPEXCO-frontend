import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectExecutionUserStudyDemo, selectExecutionUserStudyPlanProperties, selectExecutionUserStudyStep } from '../../state/user-study-execution.selector';
import { loadUserStudyDemo } from '../../state/user-study-execution.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { UserStudyStepType } from 'src/app/user_study/domain/user-study';
import { MatTabsModule } from '@angular/material/tabs';
import { PlanPropertyPanelComponent } from 'src/app/shared/components/plan-property-panel/plan-property-panel.component';
import { AsyncPipe } from '@angular/common';
import { MarkedPipe } from 'src/app/pipes/marked.pipe';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-demo-information-view',
  imports: [
    MatTabsModule,
    PlanPropertyPanelComponent,
    AsyncPipe,
    MarkedPipe,
    PageModule,
    InfoComponent,
    MatIconModule
  ],
  templateUrl: './demo-information-view.component.html',
  styleUrl: './demo-information-view.component.scss'
})
export class DemoInformationViewComponent {

  host = window.location.protocol + "//" + window.location.host;

  store = inject(Store);

  step$ = this.store.select(selectExecutionUserStudyStep);
  demo$ = this.store.select(selectExecutionUserStudyDemo);
  planProperties$ = this.store.select(selectExecutionUserStudyPlanProperties);

  constructor(){


    this.step$.pipe(
      takeUntilDestroyed(),
      filter(s => !!s && s.type == UserStudyStepType.demoInfo)
    ).subscribe(s => this.store.dispatch(loadUserStudyDemo({demoId: s.content})))
    
  }

}
