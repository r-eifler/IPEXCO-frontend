import { ShellComponent } from './view/shell/shell.component';
import { loadUserStudyResolver } from './resolver/load-user-study.resolver';
import {UserStudyCollectionComponent} from './view/user-study-collection/user-study-collection.component';
import {UserStudyCreatorComponent} from './view/user-study-creator/user-study-creator.component';
import {UserStudyDetailsViewComponent} from './view/user-study-details-view/user-study-details-view.component';
import {UserStudyEditorComponent} from './view/user-study-editor/user-study-editor.component';
import { UserStudyEvaluationViewComponent } from './view/user-study-evaluation-view/user-study-evaluation-view.component';
import { ParticipantDistributionCreatorComponent } from './view/participant-distribution-creator/participant-distribution-creator.component';
import { loadUserStudyParticipantDistributionResolver } from './resolver/load-user-study-participant-distribution.resolver';
import { ParticipantDistributionDetailsViewComponent } from './view/participant-distribution-details-view/participant-distribution-details-view.component';
import { ParticipantDistributionEditorComponent } from './view/participant-distribution-editor/participant-distribution-editor.component';
import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { userStudyFeature } from './state/user-study.feature';
import { provideEffects } from '@ngrx/effects';
import { userStudyFeatureEffects } from './state/effects/effects';
import { UserStudyParticipantDistributionService } from './service/user-study-participant-distribution.service';
import { UserStudyDemoService } from './service/user-study-demo.service';
import { UserStudyExecutionEvalService } from './service/user-study-execution-eval.service';
import { UserStudyService } from './service/user-study.service';



export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    resolve: { },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    providers: [
      provideState(userStudyFeature),
      provideEffects(userStudyFeatureEffects),
      UserStudyDemoService,
      UserStudyExecutionEvalService,
      UserStudyParticipantDistributionService,
      UserStudyService
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'collection'
      },
      {
        path: 'collection',
        component: UserStudyCollectionComponent
      },
      {
        path: 'new',
        component: UserStudyCreatorComponent
      },
      {
        path: 'new-distribution',
        component: ParticipantDistributionCreatorComponent,
      },
      {
        path: 'distribution/:participantDistributionId/details',
        component: ParticipantDistributionDetailsViewComponent,
        resolve: {loadUserStudyParticipantDistributionResolver}
      },
      {
        path: 'distribution/:participantDistributionId/edit',
        component: ParticipantDistributionEditorComponent,
        resolve: {loadUserStudyParticipantDistributionResolver}
      },
      {
        path: ':userStudyId/edit',
        component: UserStudyEditorComponent,
        resolve: {loadUserStudyResolver}
      },
      {
        path: ':userStudyId/details',
        component: UserStudyDetailsViewComponent,
        resolve: {loadUserStudyResolver}
      },
      {
        path: ':userStudyId/eval',
        component: UserStudyEvaluationViewComponent,
        resolve: {loadUserStudyResolver}
      },
    ]
  }
];
