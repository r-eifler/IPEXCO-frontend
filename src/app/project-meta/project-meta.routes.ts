import { Routes } from '@angular/router';
import { ProjectCollectionComponent } from './components/project-collection/project-collection.component';
import { provideState } from '@ngrx/store';
import { projectMetaFeature } from './state/project-meta.feature';
import { provideEffects } from '@ngrx/effects';
import { projectMetaFeatureEffects } from './state/effects/effects';
import { CreateProjectService } from './service/create-project.service';
import { MetaProjectDomainSpecificationService } from './service/domainSpecification.service';
import { PDDLService } from './service/pddl.service';
import { ProjectMetaDataService } from './service/project-meta-data.service';


export const routes: Routes = [
  {
    path: '',
    component: ProjectCollectionComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    providers: [
      provideState(projectMetaFeature),
      provideEffects(projectMetaFeatureEffects),
      CreateProjectService,
      MetaProjectDomainSpecificationService,
      PDDLService,
      ProjectMetaDataService
    ],
  }
];


