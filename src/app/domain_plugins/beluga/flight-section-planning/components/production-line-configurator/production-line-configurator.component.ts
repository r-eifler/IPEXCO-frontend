import { Component, computed, effect, input, output } from '@angular/core';
import { GoalStatus, ProductionLineTargetSchedule } from '../../domain/flight-section';
import { Jig, JigType, ProductionLine } from '../../../shared/domain/beluga_problem';
import { CdkDropList, CdkDrag, CdkDragPlaceholder, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { MatIconModule } from '@angular/material/icon';
import { JigConfiguratorComponent } from '../jig-configurator/jig-configurator.component';

@Component({
  selector: 'app-production-line-configurator',
  imports: [
    JigComponent,
    CdkDropList, 
    CdkDrag, 
    CdkDragPlaceholder,
    MatButtonModule,
    MatIconModule,
    JigConfiguratorComponent,
  ],
  templateUrl: './production-line-configurator.component.html',
  styleUrl: './production-line-configurator.component.scss'
})
export class ProductionLineConfiguratorComponent {
  
  status = GoalStatus;

  originalSchedule = input.required<ProductionLine>();
  productionLineTargetSchedule = input.required<ProductionLineTargetSchedule>();
  jigs = input.required<Record<string,Jig>>();
  jigTypes = input.required<Record<string,JigType>>();

  targetSchedule = output<ProductionLineTargetSchedule>();

  schedule = computed(() => {
    if(this.productionLineTargetSchedule() && this.jigs() !== undefined){
      return this.productionLineTargetSchedule().schedule.map(j => ({
        jig: this.jigs()?.[j.jig],
        status: j.status
      }))
    }
    return []
  })

  drop(event: CdkDragDrop<string[]>) {
    const schedule = this.schedule();
    moveItemInArray(schedule, event.previousIndex, event.currentIndex);
    console.log(schedule)

    const newProductionSchedule = {
      name: this.originalSchedule().name,
      schedule: schedule.map(e => ({jig: e.jig.name, status: e.status})),
    }

    this.targetSchedule.emit(newProductionSchedule);
  }
  
  setStatus(index: number, status: GoalStatus){
    const schedule = this.schedule().map(e => ({jig: e.jig.name, status: e.status}));
    const newProductionSchedule = {
      name: this.originalSchedule().name,
      schedule: [
        ...schedule.slice(0,index),
        {
          ...schedule[index],
          status
        },
        ...schedule.slice(index + 1)
      ],
    }

    this.targetSchedule.emit(newProductionSchedule);
  }
}
