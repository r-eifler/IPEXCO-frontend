import { CdkDropList, CdkDrag, CdkDragPlaceholder, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { Flight, Jig, JigType } from '../../../shared/domain/beluga_problem';
import { GoalStatus, FlightTargetSchedule } from '../../domain/flight-section';
import { MatIconModule } from '@angular/material/icon';
import { empty } from 'ramda';
import { JigConfiguratorComponent } from '../jig-configurator/jig-configurator.component';

@Component({
  selector: 'app-outgoing-flight-configurator',
  imports: [
    JigComponent,
    CdkDropList, 
    CdkDrag, 
    CdkDragPlaceholder,
    MatButtonModule,
    MatIconModule,
    JigConfiguratorComponent,
  ],
  templateUrl: './outgoing-flight-configurator.component.html',
  styleUrl: './outgoing-flight-configurator.component.scss'
})
export class OutgoingFlightConfiguratorComponent {

    status = GoalStatus;
  
    originalFlight = input.required<Flight>();
    flightTargetSchedule = input.required<FlightTargetSchedule>();
    jigs = input.required<Record<string,Jig>>();
    jigTypes = input.required<Record<string,JigType>>();
  
    targetSchedule = output<FlightTargetSchedule>();
  
    schedule = computed(() => {
      if(this.flightTargetSchedule() && this.flightTargetSchedule().outgoing.length > 0){
        return this.flightTargetSchedule().outgoing.map(elem => ({
          jig: {
            name: 'XXX',
            empty: true,
            type: elem.jigType,
          },
          status: elem.status
        }))
      }
  
      return this.originalFlight()?.outgoing.map(type => ({
        jig: {
          name: 'XXX',
          empty: true,
          type,
        },
        status: GoalStatus.HARD,
      }))
    })
  
    drop(event: CdkDragDrop<string[]>) {
      const schedule = this.schedule().map(e => ({jigType: e.jig.type, status: e.status}));
      moveItemInArray(schedule, event.previousIndex, event.currentIndex);
      console.log(schedule)
  
      const newFlightSchedule = {
        name: this.originalFlight().name,
        incoming: this.flightTargetSchedule()?.incoming ?? [],
        outgoing: schedule
      }
  
      this.targetSchedule.emit(newFlightSchedule);
    }
    
    setStatus(index: number, status: GoalStatus){
      const schedule = this.schedule().map(e => ({jigType: e.jig.type, status: e.status}));
      const newFlightSchedule = {
        name: this.originalFlight().name,
        outgoing: [
          ...schedule.slice(0,index),
          {
            ...schedule[index],
            status
          },
          ...schedule.slice(index + 1)
        ],
        incoming: this.flightTargetSchedule()?.incoming ?? []
      }
  
      this.targetSchedule.emit(newFlightSchedule);
    }

}
