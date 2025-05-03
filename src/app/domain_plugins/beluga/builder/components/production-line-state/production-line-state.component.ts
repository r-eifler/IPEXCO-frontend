import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectProductionLines, selectProductionLinesState, selectTaskState } from '../../state/builder.selector';
import { AsyncPipe } from '@angular/common';
import { ProductionLineComponent } from '../../../shared/components/production-line/production-line.component';

@Component({
  selector: 'app-production-line-state',
  imports: [
    AsyncPipe,
    ProductionLineComponent,
  ],
  templateUrl: './production-line-state.component.html',
  styleUrl: './production-line-state.component.scss'
})
export class ProductionLineStateComponent {

  store = inject(Store);
  
  productionLines$ = this.store.select(selectProductionLines)
  productionLineStates$  = this.store.select(selectProductionLinesState)
}
