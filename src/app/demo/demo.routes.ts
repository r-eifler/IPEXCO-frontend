import { ShellComponent } from './view/shell/shell.component';
import { DemosCollectionViewComponent } from './view/demos-collection-view/demos-collection-view.component';
import { DemoDetailsViewComponent } from './view/demo-details-view/demo-details-view.component';
import { loadDemoResolver } from './resolver/load-demo.resolver';
import { DemoEditViewComponent } from './view/demo-edit-view/demo-edit-view.component';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { demosFeature } from './state/demo.feature';
import { demosFeatureEffects } from './state/effects/effects';
import { DemoService } from './services/demo.service';
import { DemoPlanPropertyService } from './services/plan-properties.service';
import { DemoServicesService } from './services/planner.service';
import { DemoPromptsService } from './services/prompts.service';
import { Routes } from '@angular/router';



export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    providers: [
      provideState(demosFeature),
      provideEffects(demosFeatureEffects),
      DemoService,
      DemoPlanPropertyService,
      DemoServicesService,
      DemoPromptsService,
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'collection'
      },
      {
        path: 'collection',
        component: DemosCollectionViewComponent,
      },
      {
        path: ':demoId/details',
        component: DemoDetailsViewComponent,
        resolve: { loadDemoResolver }
      },
      {
        path: ':demoId/edit',
        component: DemoEditViewComponent,
        resolve: { loadDemoResolver }
      }
    ]
  }
];

