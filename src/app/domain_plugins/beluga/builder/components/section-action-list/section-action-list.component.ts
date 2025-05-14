import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActionCardComponent } from '../../../shared/components/action-card/action-card.component';
import { InitCardComponent } from '../../../shared/components/init-card/init-card.component';
import { selectActions } from '../../state/builder.selector';

@Component({
  selector: 'app-section-action-list',
  imports: [
    ActionCardComponent,
    InitCardComponent,
  ],
  templateUrl: './section-action-list.component.html',
  styleUrl: './section-action-list.component.scss'
})
export class SectionActionListComponent {

  store = inject(Store);
  actions = this.store.selectSignal(selectActions);

}
