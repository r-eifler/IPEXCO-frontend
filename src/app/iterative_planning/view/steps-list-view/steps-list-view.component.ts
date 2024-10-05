import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { PageModule } from 'src/app/shared/component/page/page.module';

import { selectIterativePlanningIterationSteps, selectIterativePlanningIterationStepsLoadingState } from '../../state/iterative-planning.selector';

@Component({
  selector: 'app-steps-list-view',
  standalone: true,
  imports: [PageModule, AsyncPipe, JsonPipe],
  templateUrl: './steps-list-view.component.html',
  styleUrl: './steps-list-view.component.scss'
})
export class StepsListViewComponent{
  private store = inject(Store);

  steps$ = this.store.select(selectIterativePlanningIterationSteps);
  loadingState$ = this.store.select(selectIterativePlanningIterationStepsLoadingState);
}
