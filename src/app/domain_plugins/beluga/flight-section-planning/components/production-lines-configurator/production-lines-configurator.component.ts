import { Component, input, output } from '@angular/core';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
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
  disabled = input<boolean>(false);

  conflictMembers = input<{
    jigName: string,
    productionLineName: string,
    position: number
  }[]>([]);

  change = output<{productionLineIndex: number, index: number, skip: boolean}>();

  onChangeProductionTarget(change: {index: number, skip: boolean}, productionLineIndex: number){
    this.change.emit({
      productionLineIndex,
      index: change.index,
      skip: change.skip
    });
  }

}
