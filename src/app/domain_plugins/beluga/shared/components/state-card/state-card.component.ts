import { Component, computed, effect, input } from '@angular/core';
import { BelugaState } from '../../domain/beluga_state';
import { MatIconModule } from '@angular/material/icon';
import { JigComponent } from '../jig/jig.component';
import { BelugaProblem, Flight, ProductionLine } from '../../domain/beluga_problem';
import { TrailerComponent } from '../trailer/trailer.component';
import { HangarComponent } from '../hangar/hangar.component';
import { BelugaFlightComponent } from '../beluga-flight/beluga-flight.component';
import { RackComponent } from '../rack/rack.component';
import { ProductionLineComponent } from '../production-line/production-line.component';
import { NgFor, NgIf } from '@angular/common';
import { BelugaSiteSetUp } from '../../domain/site_set_up';

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
  siteSetUp = input.required<BelugaSiteSetUp>();
  flight = input.required<Flight>();
  productionSchedule = input.required<ProductionLine[]>;


  constructor(){
    effect(() => console.log(this.state()))
  }

  jigTypes = computed(() => this.siteSetUp()?.jig_types)
  jigs = computed(() => this.state()?.jigs)

  incomingSchedule = computed(() => this.flight()?.incoming)

  incoming = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    const numUnloaded = state.incomingUnloaded.length
    return this.incomingSchedule()?.slice(0,numUnloaded).map(j => this.jigs()?.[j]);
  })

  outgoing = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return state.outgoingLoaded.map(j => this.jigs()?.[j]);
  })

  outgoingSchedule = computed(() => this.flight()?.outgoing)
  

  racks = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return this.siteSetUp()?.racks.map((r) => 
      ({
        jigs: state.racks?.[r.name]?.map(j => this.jigs()?.[j]),
        name: r.name,
        size: r.size,
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
    return this.siteSetUp()?.belugaTrailers.map(tn => {
      const trailerState  = state.trailers[tn.name];
      if(trailerState === null){
        return {name: tn, jig: null}
      }
      else{
        return {name: tn.name, jig: this.jigs()?.[trailerState]}
      }
    })
  })

  trailersFactory = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return this.siteSetUp()?.factoryTrailers.map(tn => {
      const trailerState  = state.trailers[tn.name];
      if(trailerState === null){
        return {name: tn, jig: null}
      }
      else{
        return {name: tn.name, jig: this.jigs()?.[trailerState]}
      }
    })
  })

  productionLines = computed(() => this.productionLines ?? [])

  productionLinesDelivered = computed(() => {
    const state = this.state();
    if(state === undefined){
      return {}
    }
    return state.productionLines;
  })
}
