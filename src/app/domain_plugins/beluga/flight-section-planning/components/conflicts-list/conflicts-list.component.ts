import { Component, effect, inject, input } from '@angular/core';
import { BelugaGoal } from '../../../shared/domain/properties';
import { Store } from '@ngrx/store';
import { selectConflictIndex } from '../../state/flight-section-planning.actions';
import { selectSelectedConfigIndex } from '../../state/flight-section-planning.feature';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-conflicts-list',
  imports: [
    MatIconModule,
  ],
  templateUrl: './conflicts-list.component.html',
  styleUrl: './conflicts-list.component.scss'
})
export class ConflictsListComponent {


  store = inject(Store);

  conflicts = input.required<BelugaGoal[][]>()
  selectedConflict = this.store.selectSignal(selectSelectedConfigIndex)

  constructor(){
    effect(() => {
      if(this.conflicts()?.length > 0){
        this.store.dispatch(selectConflictIndex({index: 0}))
      }})
  }

  onSelectConflict(index: number){
    this.store.dispatch(selectConflictIndex({index}))
  }

}
