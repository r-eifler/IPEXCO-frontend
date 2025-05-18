import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserStudyStepType } from '../../../user_study/domain/user-study';
import { selectExecutionUserStudyStep } from '../../state/user-study-execution.selector';
import { DemoInformationViewComponent } from '../demo-information-view/demo-information-view.component';
import { UserManualViewComponent } from '../user-manual-view/user-manual-view.component';
import { UserStudyExecutionDemoViewComponent } from '../user-study-execution-demo-view/user-study-execution-demo-view.component';
import { UserStudyExecutionDescriptionViewComponent } from '../user-study-execution-description-view/user-study-execution-description-view.component';
import { UserStudyExecutionExternalViewComponent } from '../user-study-execution-external-view/user-study-execution-external-view.component';
import { ProjectViewComponent } from '../project-view/project-view.component';

@Component({
    selector: 'app-user-study-execution-step-shell',
    imports: [
        AsyncPipe,
        UserStudyExecutionDescriptionViewComponent,
        UserStudyExecutionExternalViewComponent,
        UserStudyExecutionDemoViewComponent,
        UserManualViewComponent,
        DemoInformationViewComponent,
        ProjectViewComponent,
    ],
    templateUrl: './user-study-execution-step-shell.component.html',
    styleUrl: './user-study-execution-step-shell.component.scss'
})
export class UserStudyExecutionStepShellComponent {

  protected readonly UserStudyStepType = UserStudyStepType;

  store = inject(Store);
  router = inject(Router);
  route = inject(ActivatedRoute);

  step$ = this.store.select(selectExecutionUserStudyStep);

}
