import {  Routes } from '@angular/router';
import { ShellComponent } from './view/shell/shell.component';
import { SpecificationOverviewComponent } from './view/specification-overview/specification-overview.component';
import { DomainSpecEditorComponent } from './view/domain-spec-editor/domain-spec-editor.component';
import { loadDomainSpecResolver } from './resolver/load-domain-spec.resolver';
import { PromptEditorComponent } from './view/prompt-editor/prompt-editor.component';
import { OutputSchemaEditorComponent } from './view/output-schema-editor/output-schema-editor.component';
import { loadPromptResolver } from './resolver/load-prompt.resolver';
import { loadOutputSchemaResolver } from './resolver/load-output-schema.resolver';
import { globalSpecFeatureEffects } from './state/effects/effects';
import { globalSpecFeature } from './state/globalSpec.feature';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { DomainSpecificationService } from './service/domainSpecification.service';
import { ExplainerServicesService } from './service/explainer.service';
import { PlannerServicesService } from './service/planner.service';
import { PromptsService } from './service/prompts.service';



export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      providers: [
        provideState(globalSpecFeature),
        provideEffects(globalSpecFeatureEffects),
        DomainSpecificationService,
        ExplainerServicesService,
        PlannerServicesService,
        PromptsService,
      ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview'
      },
      {
        path: 'overview',
        component: SpecificationOverviewComponent,
      },
      {
        path: 'domain/:domainSpecId/edit',
        resolve: { loadDomainSpecResolver },
        component: DomainSpecEditorComponent,
      },
      {
        path: 'prompt/:promptId/edit',
        resolve: { loadPromptResolver },
        component: PromptEditorComponent,
      },
      {
        path: 'schema/:schemaId/edit',
        resolve: { loadOutputSchemaResolver },
        component: OutputSchemaEditorComponent,
      },
    ]
  }
];
