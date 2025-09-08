import { Component, computed, effect, input, signal, Signal } from '@angular/core';
import { Flight, Jig, JigType } from '../../domain/beluga_problem';
import { MatCardModule } from '@angular/material/card';
import { JigComponent } from '../jig/jig.component';

@Component({
  selector: 'app-multi-flight-card',
  imports: [
    MatCardModule,
    JigComponent,
  ],
  templateUrl: './multi-flight-card.component.html',
  styleUrl: './multi-flight-card.component.scss'
})
export class MultiFlightCardComponent {

  flights = input.required<Flight[]>();
  jigs = input.required<Record<string,Jig>>();
  jigTypes = input.required<Record<string,JigType>>();

  selectedFlightIndex = signal<number | null>(0);

  selectedFlight = computed(() => {
    let index = this.selectedFlightIndex();
    if(index == null || index > this.flights()?.length){
      return null;
    }
    return this.flights()?.[index]
  })

  selectedIncoming = computed(() => this.selectedFlight()?.incoming.map(
    jigName => {
      let jig = this.jigs()?.[jigName];
      let type = this.jigTypes()?.[jig.type]
      return {jig, type}
    }))

  selectedOutgoing = computed(() => this.selectedFlight()?.outgoing.map(
    typeName => this.jigTypes()?.[typeName]))

  selectFlightIndex(flightIndex: number){
    this.selectedFlightIndex.set(flightIndex);
  }

}
