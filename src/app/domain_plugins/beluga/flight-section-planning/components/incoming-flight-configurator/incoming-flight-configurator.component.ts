import { Component, computed, input, output } from '@angular/core';
import { Flight, Jig, JigType } from '../../../shared/domain/beluga_problem';
import { FlightTargetSchedule, GoalStatus } from '../../domain/flight-section';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-incoming-flight-configurator',
  imports: [
    JigComponent,
    CdkDropList, 
    CdkDrag, 
    CdkDragPlaceholder,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './incoming-flight-configurator.component.html',
  styleUrl: './incoming-flight-configurator.component.scss'
})
export class IncomingFlightConfiguratorComponent {

  status = GoalStatus;


  originalFlight = input.required<Flight>();
  flightTargetSchedule = input.required<FlightTargetSchedule>();
  jigs = input.required<Record<string,Jig>>();
  jigTypes = input.required<Record<string,JigType>>();

  targetSchedule = output<FlightTargetSchedule>();

  schedule = computed(() => {
    if(this.flightTargetSchedule() && this.flightTargetSchedule().incoming.length > 0){
      return this.flightTargetSchedule().incoming.map(j => ({
        jig: this.jigs()?.[j.jig],
        status: j.status
      }))
    }

    return this.originalFlight()?.incoming.map(name => ({
      jig: this.jigs()?.[name],
      status: GoalStatus.HARD,
    }))
  })

  drop(event: CdkDragDrop<string[]>) {
    const schedule = this.schedule();
    moveItemInArray(schedule, event.previousIndex, event.currentIndex);
    console.log(schedule)

    const newFlightSchedule = {
      name: this.originalFlight().name,
      incoming: schedule.map(e => ({jig: e.jig.name, status: e.status})),
      outgoing: this.flightTargetSchedule()?.outgoing ?? []
    }

    this.targetSchedule.emit(newFlightSchedule);
  }
  
  setStatus(index: number, status: GoalStatus){
    const schedule = this.schedule().map(e => ({jig: e.jig.name, status: e.status}));
    const newFlightSchedule = {
      name: this.originalFlight().name,
      incoming: [
        ...schedule.slice(0,index),
        {
          ...schedule[index],
          status
        },
        ...schedule.slice(index + 1)
      ],
      outgoing: this.flightTargetSchedule()?.outgoing ?? []
    }

    this.targetSchedule.emit(newFlightSchedule);
  }

}


