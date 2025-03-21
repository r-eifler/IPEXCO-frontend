import { Component, computed, effect, input } from '@angular/core';
import { BelugaState } from '../../domain/beluga_state';
import { MatIconModule } from '@angular/material/icon';
import { JigComponent } from '../jig/jig.component';
import { BelugaProblem } from '../../domain/beluga_problem';
import { TrailerComponent } from '../trailer/trailer.component';
import { HangarComponent } from '../hangar/hangar.component';
import { BelugaFlightComponent } from '../beluga-flight/beluga-flight.component';

@Component({
  selector: 'app-state-card',
  imports: [
    MatIconModule,
    JigComponent,
    TrailerComponent,
    HangarComponent,
    BelugaFlightComponent
  ],
  templateUrl: './state-card.component.html',
  styleUrl: './state-card.component.scss'
})
export class StateCardComponent {

  state = input.required<BelugaState>();
  model = input.required<BelugaProblem>();

  constructor(){
    effect(() => console.log(this.state()))
  }

  incoming = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    console.log(state.incoming)
    return state.incoming.map(j => this.model()?.jigs[j]);
  })

  outgoing = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return state.outgoing.map(j => this.model()?.jigs[j]);
  })
  

  racks = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return Object.values(state.racks).map(r => r.map(j => this.model()?.jigs[j]));
  })

  hangars = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return Object.values(state.hangars).map(j => j === null ? null : this.model()?.jigs[j]);
  })

  trailersBeluga = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return Object.values(state.trailers_beluga).map(j => j === null ? null : this.model()?.jigs[j]);
  })

  trailersFactory = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return Object.values(state.trailers_factory).map(j => j === null ? null : this.model()?.jigs[j]);
  })
}
