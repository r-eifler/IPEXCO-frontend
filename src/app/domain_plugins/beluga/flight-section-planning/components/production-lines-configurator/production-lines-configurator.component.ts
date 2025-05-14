import { Component, computed, effect, input, output } from '@angular/core';
import { ProductionLine, Jig, JigType } from '../../../shared/domain/beluga_problem';
import { ProductionLineTargetSchedule } from '../../domain/flight-section';
import { ProductionLineConfiguratorComponent } from '../production-line-configurator/production-line-configurator.component';

@Component({
  selector: 'app-production-lines-configurator',
  imports: [
    ProductionLineConfiguratorComponent
  ],
  templateUrl: './production-lines-configurator.component.html',
  styleUrl: './production-lines-configurator.component.scss'
})
export class ProductionLinesConfiguratorComponent {

  productionLineTargetSchedules = input.required<ProductionLineTargetSchedule[]>();
  jigsOnSite = input.required<Set<string>>();
  jigs = input.required<Record<string,Jig>>();
  jigTypes = input.required<Record<string,JigType>>();

  targetSchedules = output<ProductionLineTargetSchedule[]>();

  onChangeProductionTarget(newSchedule: ProductionLineTargetSchedule, index: number){
    const oldSchedules = this.productionLineTargetSchedules();
    const newProductionSchedules = [
        ...oldSchedules.slice(0,index),
        newSchedule,
        ...oldSchedules.slice(index + 1)
      ];

    this.targetSchedules.emit(newProductionSchedules);
  }

}
