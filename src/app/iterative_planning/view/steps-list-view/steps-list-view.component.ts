import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ActionCardModule } from 'src/app/shared/component/action-card/action-card.module';

import { BreadcrumbModule } from 'src/app/shared/component/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/component/page/page.module';

import { IterationStepCardComponent } from '../../components/iteration-step-card/iteration-step-card.component';
import { initNewIterationStep } from '../../state/iterative-planning.actions';
import { selectIterativePlanningIterationSteps, selectIterativePlanningIterationStepsLoadingState, selectIterativePlanningProperties } from '../../state/iterative-planning.selector';

@Component({
  selector: 'app-steps-list-view',
  standalone: true,
  imports: [PageModule, AsyncPipe, JsonPipe, IterationStepCardComponent, ActionCardModule, MatIconModule, RouterLink, BreadcrumbModule],
  templateUrl: './steps-list-view.component.html',
  styleUrl: './steps-list-view.component.scss'
})
export class StepsListViewComponent{
  private store = inject(Store);

  steps$ = this.store.select(selectIterativePlanningIterationSteps);
  loadingState$ = this.store.select(selectIterativePlanningIterationStepsLoadingState);
  planProperties$ = this.store.select(selectIterativePlanningProperties);

  createNewIteration(baseStepId?: string) {
    this.store.dispatch(initNewIterationStep({baseStepId}));
  }
}
