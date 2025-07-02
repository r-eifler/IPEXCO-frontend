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
import { TranslocoDirective } from '@jsverse/transloco';

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
    TranslocoDirective,
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
    effect(() => console.log(this.siteSetUp()))
    //  effect(() => console.log(this.jigs()))
  }

  jigTypes = computed(() => this.siteSetUp()?.jig_types)
  maxJigSize = computed(() => {
    const jigTypes = this.jigTypes();
    if(jigTypes === undefined){
            return undefined;
    }
    return Math.max(...Object.values(jigTypes).map(jt => jt.size_loaded))
  })
  // jigs = computed(() => this.state()?.jigs)

  incomingSchedule = computed(() => this.targetFlightSchedule()?.incoming.filter(e => !e.skip))

  incoming = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    const numUnloaded = state.incomingUnloaded.length
    const fullSchedule = this.incomingSchedule()?.map(j => state.jigs[j.jig])
    return fullSchedule?.slice(numUnloaded);
  })

  outgoing = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return state.outgoingLoaded.map(j => state.jigs[j]);
  })

  outgoingSchedule = computed(() => this.targetFlightSchedule()?.outgoing.filter(e => !e.skip))


  racks = computed(() => {
    const state = this.state();
    const jigTypes = this.jigTypes();
    const siteSetUp = this.siteSetUp();
    if(state === undefined || jigTypes === undefined || siteSetUp === undefined){
      return []
    }

    const racks =  siteSetUp.racks.map((r) =>
      ({
        jigs: state.racks?.[r.name]?.map(j => state.jigs[j]),
        name: r.name,
        size: r.size,
        maintenance: r.status == SiteStatus.MAINTENANCE,
        occupied: occupiedRackSpace(state.racks?.[r.name], state.jigs, jigTypes)
      })
    )
    return racks;
  });

  hangars = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return  this.siteSetUp()?.hangars.map(h => {
      const loadedJigName  = state.hangars[h.name];
      if(loadedJigName === null){
        return {name: h.name, jig: null, maintenance: h.status == SiteStatus.MAINTENANCE}
      }
      else{
        return {name: h.name, jig: state.jigs[loadedJigName], maintenance: h.status == SiteStatus.MAINTENANCE}
      }
    })
  })

  trailersBeluga = computed(() => {
    const state = this.state();
    if(state === undefined){
      return []
    }
    return this.siteSetUp()?.belugaTrailers.map(tn => {
      const loadedJigName  = state.trailers[tn.name];
      if(loadedJigName === null){
        return {trailer: tn, jig: null, maintenance: tn.status == SiteStatus.MAINTENANCE}
      }
      else{
        return {trailer: tn, jig: state.jigs[loadedJigName], maintenance: tn.status == SiteStatus.MAINTENANCE}
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
        return {trailer: tn, jig: null, maintenance: tn.status == SiteStatus.MAINTENANCE}
      }
      else{
        return {trailer: tn, jig: state.jigs[loadedJigName], maintenance: tn.status == SiteStatus.MAINTENANCE}
      }
    })
  })

  productionLines = computed(() => {
    const state = this.state();
    if (state === undefined){
      return []
    }
    return this.targetProductionSchedule()?.map(pl => ({
      name: pl.name,
      schedule: pl.schedule.filter(e => !e.skip).map(e => state.jigs[e.jig])
    }))
  })

  productionLinesDelivered = computed(() => {
    const state = this.state();
    if(state === undefined){
      return {}
    }
    return state.productionLines;
  })
}
