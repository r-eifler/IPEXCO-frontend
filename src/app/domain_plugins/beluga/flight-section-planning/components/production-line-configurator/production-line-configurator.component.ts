import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Jig, JigType, ProductionLine } from '../../../shared/domain/beluga_problem';
import { GoalConsiderationStatus, ProductionLineTargetSchedule, updateDeliveryStatuses } from '../../domain/flight-section';
import { JigConfiguratorComponent } from '../jig-configurator/jig-configurator.component';

@Component({
  selector: 'app-production-line-configurator',
  imports: [
    MatButtonModule,
    MatIconModule,
    JigConfiguratorComponent,
  ],
  templateUrl: './production-line-configurator.component.html',
  styleUrl: './production-line-configurator.component.scss'
})
export class ProductionLineConfiguratorComponent {
  
  status = GoalConsiderationStatus;

  originalSchedule = input.required<ProductionLine>();
  productionLineTargetSchedule = input.required<ProductionLineTargetSchedule>();
  jigsOnSite = input.required<Set<string>>();
  jigs = input.required<Record<string,Jig>>();
  jigTypes = input.required<Record<string,JigType>>();

  targetSchedule = output<ProductionLineTargetSchedule>();

  schedule = computed(() => {
    if(this.productionLineTargetSchedule() && this.jigs() !== undefined){
      return this.productionLineTargetSchedule().schedule.map(e => ({
        jig: this.jigs()?.[e.jig],
        status: {
          considerationStatus: e.considerationStatus,
          solvabilityStatus: e.solvabilityStatus
        }
      }))
    }
    return []
  })

  // drop(event: CdkDragDrop<string[]>) {
  //   const schedule = this.schedule();
  //   moveItemInArray(schedule, event.previousIndex, event.currentIndex);
  //   console.log(schedule)

  //   this.targetSchedule.emit(schedule);
  // }
  
  setStatus(index: number, status: GoalConsiderationStatus){
    const schedule = this.productionLineTargetSchedule().schedule;
    const newProductionSchedule = {
      name: this.productionLineTargetSchedule().name,
      schedule: [
        ...schedule.slice(0,index),
        {
          ...schedule[index],
          considerationStatus: status,
        },
        ...schedule.slice(index + 1)
      ],
    }

    newProductionSchedule.schedule = updateDeliveryStatuses(newProductionSchedule.schedule, this.jigsOnSite())

    this.targetSchedule.emit(newProductionSchedule);
  }
}
