import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ActionCardModule } from 'src/app/shared/components/action-card/action-card.module';

import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';

import { IterationStepCardComponent } from '../../components/iteration-step-card/iteration-step-card.component';
import { cancelPlanComputationAndIterationStep, initNewIterationStep } from '../../state/iterative-planning.actions';
import { selectIterativePlanningIterationSteps, selectIterativePlanningIterationStepsLoadingState, selectIterativePlanningProject, selectIterativePlanningProperties } from '../../state/iterative-planning.selector';
import { ProjectDirective } from '../../derectives/isProject.directive';
import { DemoDirective } from '../../derectives/isDemo.directive';
import { StepsListHeroComponent } from '../../components/steps-list-hero/steps-list-hero.component';
import { map } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { DemoInfoComponent } from 'src/app/shared/components/demo/demo-info/demo-info.component';

@Component({
    selector: 'app-steps-list-view',
    imports: [
        PageModule,
        AsyncPipe,
        IterationStepCardComponent,
        ActionCardModule,
        MatIconModule,
        RouterLink,
        BreadcrumbModule,
        ProjectDirective,
        DemoDirective,
        StepsListHeroComponent,
        MatExpansionModule,
        DemoInfoComponent
    ],
    templateUrl: './steps-list-view.component.html',
    styleUrl: './steps-list-view.component.scss'
})
export class StepsListViewComponent{

  host = window.location.protocol + "//" + window.location.host;

  private store = inject(Store);

  project$ = this.store.select(selectIterativePlanningProject)
  image$ = this.project$.pipe(map(p => p?.summaryImage));
  domainInfo$ = this.project$.pipe(map(p => p?.domainInfo));
  instanceInfo$ = this.project$.pipe(map(p => p?.instanceInfo));
  steps$ = this.store.select(selectIterativePlanningIterationSteps);
  loadingState$ = this.store.select(selectIterativePlanningIterationStepsLoadingState);
  planProperties$ = this.store.select(selectIterativePlanningProperties);

  createNewIteration(baseStepId?: string) {
    this.store.dispatch(initNewIterationStep({baseStepId}));
  }

  cancelIterationStep(iterationStepId: string){
    this.store.dispatch(cancelPlanComputationAndIterationStep({iterationStepId}))
  }
}
