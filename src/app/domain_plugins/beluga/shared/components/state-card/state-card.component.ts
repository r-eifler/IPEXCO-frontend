import { Component, computed, effect, input } from '@angular/core';
import { BelugaState } from '../../domain/beluga_state';
import { MatIconModule } from '@angular/material/icon';
import { JigComponent } from '../jig/jig.component';
import { BelugaProblem, Flight, occupiedRackSpace, ProductionLine } from '../../domain/beluga_problem';
import { TrailerComponent } from '../trailer/trailer.component';
import { HangarComponent } from '../hangar/hangar.component';
import { BelugaFlightComponent } from '../beluga-flight/beluga-flight.component';
import { RackComponent } from '../rack/rack.component';
import { ProductionLineComponent } from '../production-line/production-line.component';
import { NgFor, NgIf } from '@angular/common';
import { BelugaSiteSetUp, SiteStatus } from '../../domain/site_set_up';
import { FlightTargetSchedule, ProductionLineTargetSchedule } from '../../../flight-section-planning/domain/flight-section';

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
  targetFlightSchedule = input.required<FlightTargetSchedule>();
  targetProductionSchedule = input.required<ProductionLineTargetSchedule[]>();

  constructor(){
    effect(() => console.log(this.state()))
  }

  jigTypes = computed(() => this.siteSetUp()?.jig_types)
  jigs = computed(() => this.state()?.jigs)

  incomingSchedule = computed(() => this.targetFlightSchedule()?.incoming.
    filter(e => !e.skip)
  )

  incoming = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    const numUnloaded = state.incomingUnloaded.length
    const fullSchedule = this.incomingSchedule()?.map(j => this.jigs()?.[j.jig])
    return fullSchedule.slice(numUnloaded);
  })

  outgoing = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return state.outgoingLoaded.map(j => this.jigs()?.[j]);
  })

  outgoingSchedule = computed(() => this.targetFlightSchedule()?.outgoing)
  

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
        maintenance: r.status == SiteStatus.MAINTENANCE,
        occupied: occupiedRackSpace(state.racks?.[r.name], this.jigs(), this.jigTypes())
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
      const loadedJigName  = state.trailers[tn.name];
      if(loadedJigName === null){
        return {trailer: tn, jig: null}
      }
      else{
        return {trailer: tn, jig: this.jigs()?.[loadedJigName]}
      }
    })
  })

  trailersFactory = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return this.siteSetUp()?.factoryTrailers.map(tn => {
      const loadedJigName  = state.trailers[tn.name];
      if(loadedJigName === null){
        return {trailer: tn, jig: null}
      }
      else{
        return {trailer: tn, jig: this.jigs()?.[loadedJigName]}
      }
    })
  })

  productionLines = computed(() => this.targetProductionSchedule() ?? [])

  productionLinesDelivered = computed(() => {
    const state = this.state();
    if(state === undefined){
      return {}
    }
    return state.productionLines;
  })
}
