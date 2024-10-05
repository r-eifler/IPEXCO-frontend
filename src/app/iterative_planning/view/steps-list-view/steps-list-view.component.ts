import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { PageModule } from 'src/app/shared/component/page/page.module';

import { IterationStepCardComponent } from '../../components/iteration-step-card/iteration-step-card.component';
import { selectIterativePlanningIterationSteps, selectIterativePlanningIterationStepsLoadingState, selectIterativePlanningProperties } from '../../state/iterative-planning.selector';

@Component({
  selector: 'app-steps-list-view',
  standalone: true,
  imports: [PageModule, AsyncPipe, JsonPipe, IterationStepCardComponent],
  templateUrl: './steps-list-view.component.html',
  styleUrl: './steps-list-view.component.scss'
})
export class StepsListViewComponent{
  private store = inject(Store);

  steps$ = this.store.select(selectIterativePlanningIterationSteps);
  loadingState$ = this.store.select(selectIterativePlanningIterationStepsLoadingState);
  planProperties$ = this.store.select(selectIterativePlanningProperties);
}
