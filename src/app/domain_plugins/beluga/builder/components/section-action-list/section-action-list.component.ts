import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActionCardComponent } from '../../../shared/components/action-card/action-card.component';
import { InitCardComponent } from '../../../shared/components/init-card/init-card.component';
import { selectActions } from '../../state/builder.selector';
import { ActionCardEmptyStateComponent } from '../action-card-empty-state/action-card-empty-state.component';

@Component({
  selector: 'app-section-action-list',
  imports: [
    ActionCardComponent,
    ActionCardEmptyStateComponent,
    InitCardComponent,
  ],
  templateUrl: './section-action-list.component.html',
  styleUrl: './section-action-list.component.scss'
})
export class SectionActionListComponent {

  store = inject(Store);
  actions = this.store.selectSignal(selectActions);

}
