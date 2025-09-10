import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectJigsState, selectJigTypes, selectProductionLineScheduleList } from '../../state/builder.selector';
import { ProductionLineStateComponent } from '../production-line-state/production-line-state.component';

@Component({
  selector: 'app-production-lines-state',
  imports: [
    ProductionLineStateComponent,
  ],
  templateUrl: './production-lines-state.component.html',
  styleUrl: './production-lines-state.component.scss'
})
export class ProductionLinesStateComponent {

  store = inject(Store);

  productionLinesTargetSchedules = this.store.selectSignal(selectProductionLineScheduleList);
  jigTypes = this.store.selectSignal(selectJigTypes);
  jigs = this.store.selectSignal(selectJigsState);
}
