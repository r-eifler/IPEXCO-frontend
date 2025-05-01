import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActiveBranchSections } from '../../state/flight-section-planning.selector';
import { SectionCardComponent } from '../section-card/section-card.component';
import { NewSectionActionComponent } from '../new-section-action/new-section-action.component';



@Component({
  selector: 'app-section-tree',
  imports: [
    SectionCardComponent,
    NewSectionActionComponent,
  ],
  templateUrl: './section-tree.component.html',
  styleUrl: './section-tree.component.scss'
})
export class SectionTreeComponent {

  store = inject(Store);

  sections = this.store.selectSignal(selectActiveBranchSections);


}
