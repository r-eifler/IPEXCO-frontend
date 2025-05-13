import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentPlanSection, selectFinishedPlanSections, selectSiteSetUp } from '../../state/builder.selector';
import { ActionCardComponent } from '../../../shared/components/action-card/action-card.component';
import { AsyncPipe } from '@angular/common';
import { InitCardComponent } from '../../../shared/components/init-card/init-card.component';
import { SectionCardComponent } from '../../../shared/components/section-card/section-card.component';

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

  planSection$ = this.store.select(selectCurrentPlanSection);

}
