import {  Routes } from '@angular/router';
import { loadProjectResolver } from './resolver/load-project.resolver';
import { setCurrentStepResolver } from './resolver/set-current-step.resolver';
import { ShellComponent } from './view/shell/shell.component';
import { StepDetailViewComponent } from './view/step-detail-view/step-detail-view.component';
import { StepsListViewComponent } from './view/steps-list-view/steps-list-view.component';
import { PlanDetailViewComponent } from './view/plan-detail-view/plan-detail-view.component';
import { provideState } from '@ngrx/store';
import { iterativePlanningFeature } from './state/iterative-planning.feature';
import { provideEffects } from '@ngrx/effects';
import { iterativePlanningFeatureEffects } from './state/effects/effects';
import { IterativePlanningDomainSpecificationService } from './service/domainSpecification.service';
import { IterationStepService } from './service/iteration-step.service';
import { PlanPropertyService } from './service/plan-properties.service';
import { PlannerMonitoringService } from './service/planner-monitoring.service';
import { IterativePlanningProjectService } from './service/project.service';
import { ExplainerMonitoringService } from './service/explainer-monitoring.service';
import { ExplainerService } from './service/explainer.service';
import { PlannerService } from './service/planner.service';
import { LLMService } from '../LLM/service/llm.service';


export const routes: Routes = [
  {
    path: ':projectId',
    component: ShellComponent,
    resolve: { loadProjectResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      { path: '', redirectTo: 'steps', pathMatch: 'full' },
      {
        path: 'steps',
        component: StepsListViewComponent,
      },
      {
        path: 'steps/:stepId',
        component: StepDetailViewComponent,
        resolve: { setCurrentStepResolver },
      },
      {
        path: 'steps/:stepId/plan',
        component: PlanDetailViewComponent,
        resolve: { setCurrentStepResolver },
      }
    ]
  }
];