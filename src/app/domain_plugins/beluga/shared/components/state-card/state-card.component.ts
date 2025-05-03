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
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-state-card',
  imports: [
    MatIconModule,
    TrailerComponent,
    HangarComponent,
    BelugaFlightComponent,
    RackComponent,
    ProductionLineComponent,
    JigComponent,
    NgIf,
    NgFor,
  ],
  templateUrl: './state-card.component.html',
  styleUrl: './state-card.component.scss'
})
export class StateCardComponent {

  state = input.required<BelugaState>();
  task = input.required<BelugaProblem>();

  constructor(){
    effect(() => console.log(this.state()))
  }

  jigTypes = computed(() => this.task()?.jig_types)
  jigs = computed(() => this.state()?.jigs)

  incoming = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return state.incoming.map(j => this.jigs()?.[j]);
  })

  outgoing = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return state.outgoing.map(j => this.jigs()?.[j]);
  })

  outgoingSchedule = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return this.task()?.flights[state.flightIndex].outgoing;
  })
  

  racks = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return Object.values(state.racks).map((r,index) => 
      ({
        jigs: r.map(j => this.jigs()?.[j]),
        name: this.task()?.racks[index].name,
        size: this.task()?.racks[index].size,
      })
    )
  });

  hangars = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    let hangarNames = Object.keys(state.hangars)
    return hangarNames.map(h => ({
      name: h,
      jig: state.hangars[h] === null ? null : this.jigs()?.[state.hangars[h]]
    }))
  })

  trailersBeluga = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return Object.keys(state.trailersBeluga).map(tn => 
      state.trailersBeluga[tn] === null ? {name: tn, jig: null} : 
      {name: tn, jig: this.jigs()?.[state.trailersBeluga[tn]]});
  })

  trailersFactory = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return Object.keys(state.trailersFactory).map(tn => 
      state.trailersFactory[tn] === null ? {name: tn, jig: null} : 
      {name: tn, jig: this.jigs()?.[state.trailersFactory[tn]]});
  })

  productionLines = computed(() => {
    const task = this.task();
    if(task === undefined){
      return []
    }
    return task.production_lines;
  })

  productionLinesDelivered = computed(() => {
    const state = this.state();
    if(state === undefined){
      return {}
    }
    return state.productionLines;
  })
}
