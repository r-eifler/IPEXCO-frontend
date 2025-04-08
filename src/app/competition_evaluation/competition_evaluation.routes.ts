import { Routes } from "@angular/router";
import { provideEffects } from "@ngrx/effects";
import { provideState } from "@ngrx/store";
import { EvalInstancesService } from "./services/plans.service";
import { competitionEvaluationFeature } from "./state/competition_evaluation.feature";
import { competitionEvaluationFeatureEffects } from "./state/effects/effects";
import { PlanDetailViewComponent } from "./view/plan-detail-view/plan-detail-view.component";
import { PlansListViewComponent } from "./view/plans-list-view/plans-list-view.component";
import { ShellComponent } from "./view/shell/shell.component";

export const routes: Routes = [
    {
      path: '',
      component: ShellComponent,
      runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      providers: [
        provideState(competitionEvaluationFeature),
        provideEffects(competitionEvaluationFeatureEffects),
        EvalInstancesService,
      ],
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'collection'
        },
        {
          path: 'collection',
          component: PlansListViewComponent,
        },
        {
          path: ':id/details',
          component: PlanDetailViewComponent,
          resolve: {  }
        }
      ]
    }
  ];
  
  