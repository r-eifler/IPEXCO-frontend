import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ProductionLineComponent } from '../../../shared/components/production-line/production-line.component';
import { selectProductionLineSchedule, selectProductionLinesState } from '../../state/builder.selector';

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
  
  productionLines$ = this.store.select(selectProductionLineSchedule)
  productionLineStates$  = this.store.select(selectProductionLinesState)
}
