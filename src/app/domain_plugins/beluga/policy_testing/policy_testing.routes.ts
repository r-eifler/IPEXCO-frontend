import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { PolicyTestingShellComponent } from './view/policy-testing-shell/policy-testing-shell.component';
import { policyTestingEffects } from './state/effects/effects';
import { LoadProjectResolver } from './resolver/load-project.resolver';
import { PolicyTestingFeature } from './state/policy-testing.feature';
import { TestCollectionsComponent } from './view/test-collections/test-collections.component';
import { PolicyTestingProjectService } from './services/project.service';
import { PolicyTestingTestCollectionsService } from './services/tests.service';
import { TestCollectionDetailsComponent } from './view/test-collection-details/test-collection-details.component';
import { SelectTestSuiteResolver } from './resolver/select-test-suite.resolver';
import { NewTestCaseComponent } from './view/new-test-case/new-test-case.component';
import { FuzzingMonitoringService } from './services/fuzzing-monitoring.service';


export const routes: Routes = [
  {
    path: '',
    component: PolicyTestingShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    providers: [
      provideState(PolicyTestingFeature),
      provideEffects(policyTestingEffects),
      PolicyTestingProjectService,
      PolicyTestingTestCollectionsService,
      FuzzingMonitoringService,
    ],
    children: [
      {
        path: ':projectId',
        component: TestCollectionsComponent,
        resolve: [LoadProjectResolver],
      },
      {
        path: ':projectId/:testId',
        component: TestCollectionDetailsComponent,
        resolve: [LoadProjectResolver, SelectTestSuiteResolver],
      },
      {
        path: ':projectId/:testId/new-test-case',
        component: NewTestCaseComponent,
        resolve: [LoadProjectResolver, SelectTestSuiteResolver],
      },
    ]
  }
];
