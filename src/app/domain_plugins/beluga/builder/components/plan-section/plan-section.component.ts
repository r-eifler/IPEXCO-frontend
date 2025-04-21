import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentPlanSection, selectTask } from '../../state/builder.selector';
import { ActionCardComponent } from '../../../shared/components/action-card/action-card.component';
import { AsyncPipe } from '@angular/common';
import { InitCardComponent } from '../../../shared/components/init-card/init-card.component';

@Component({
  selector: 'app-plan-section',
  imports: [
    ActionCardComponent,
    AsyncPipe,
    InitCardComponent,
  ],
  templateUrl: './plan-section.component.html',
  styleUrl: './plan-section.component.scss'
})
export class PlanSectionComponent {


  store = inject(Store);

  task$ = this.store.select(selectTask);
  planSection = this.store.select(selectCurrentPlanSection);

}
