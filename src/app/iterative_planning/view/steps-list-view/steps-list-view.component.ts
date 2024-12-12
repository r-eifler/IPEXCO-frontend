import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ActionCardModule } from 'src/app/shared/components/action-card/action-card.module';

import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';

import { IterationStepCardComponent } from '../../components/iteration-step-card/iteration-step-card.component';
import { initNewIterationStep } from '../../state/iterative-planning.actions';
import { selectIterativePlanningIterationSteps, selectIterativePlanningIterationStepsLoadingState, selectIterativePlanningProject, selectIterativePlanningProperties } from '../../state/iterative-planning.selector';
import { ProjectDirective } from '../../derectives/isProject.directive';

@Component({
  selector: 'app-steps-list-view',
  standalone: true,
  imports: [
    PageModule, 
    AsyncPipe, 
    IterationStepCardComponent, 
    ActionCardModule, 
    MatIconModule, 
    RouterLink, 
    BreadcrumbModule,
    ProjectDirective
  ],
  templateUrl: './steps-list-view.component.html',
  styleUrl: './steps-list-view.component.scss'
})
export class StepsListViewComponent{
  private store = inject(Store);

  project$ = this.store.select(selectIterativePlanningProject)
  steps$ = this.store.select(selectIterativePlanningIterationSteps);
  loadingState$ = this.store.select(selectIterativePlanningIterationStepsLoadingState);
  planProperties$ = this.store.select(selectIterativePlanningProperties);

  createNewIteration(baseStepId?: string) {
    this.store.dispatch(initNewIterationStep({baseStepId}));
  }
}
