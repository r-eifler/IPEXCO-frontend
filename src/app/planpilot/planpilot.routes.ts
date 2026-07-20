import { Routes } from '@angular/router';
import { ProjectService } from 'src/app/project/service/project.service';
import { loadPlanPilotProjectResolver } from './resolver/load-planpilot-project.resolver';
import { PlanPilotStartComponent } from './view/planpilot-start/planpilot-start.component';
import { PlanPilotViewComponent } from './view/planpilot-view/planpilot-view.component';

export const routes: Routes = [
  {
    path: ':projectId',
    resolve: { project: loadPlanPilotProjectResolver },
    providers: [ProjectService],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      { path: '', component: PlanPilotStartComponent },
      { path: 'graph', component: PlanPilotViewComponent },
    ],
  },
];
