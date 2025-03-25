import { Component, computed, effect, input } from '@angular/core';
import { BelugaState } from '../../domain/beluga_state';
import { MatIconModule } from '@angular/material/icon';
import { JigComponent } from '../jig/jig.component';
import { BelugaProblem } from '../../domain/beluga_problem';
import { TrailerComponent } from '../trailer/trailer.component';
import { HangarComponent } from '../hangar/hangar.component';
import { BelugaFlightComponent } from '../beluga-flight/beluga-flight.component';
import { RackComponent } from '../rack/rack.component';
import { ProductionLineComponent } from '../production-line/production-line.component';

@Component({
  selector: 'app-state-card',
  imports: [
    MatIconModule,
    JigComponent,
    TrailerComponent,
    HangarComponent,
    BelugaFlightComponent,
    RackComponent,
    ProductionLineComponent,
  ],
  templateUrl: './state-card.component.html',
  styleUrl: './state-card.component.scss'
})
export class StateCardComponent {

  state = input.required<BelugaState>();
  model = input.required<BelugaProblem>();

  constructor(){
    effect(() => console.log(this.state()))
    effect(() => console.log(this.outgoingSchedule()))
  }

  jigTypes = computed(() => this.model()?.jig_types)
  jigs = computed(() => this.model()?.jigs)

  incoming = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return state.incoming.map(j => this.model()?.jigs[j]);
  })

  outgoing = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return state.outgoing.map(j => this.model()?.jigs[j]);
  })

  outgoingSchedule = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return this.model()?.flights[state.flightIndex].outgoing;
  })
  

  racks = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return Object.values(state.racks).map((r,index) => 
      ({
        jigs: r.map(j => this.model()?.jigs[j]),
        name: this.model()?.racks[index].name,
        size: this.model()?.racks[index].size,
      })
    )
  });

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
    return Object.values(state.trailersBeluga).map(j => j === null ? null : this.model()?.jigs[j]);
  })

  trailersFactory = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return Object.values(state.trailersFactory).map(j => j === null ? null : this.model()?.jigs[j]);
  })

  productionLines = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return Object.values(state.productionLines);
  })
}
