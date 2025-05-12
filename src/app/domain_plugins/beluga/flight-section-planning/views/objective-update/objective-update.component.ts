import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentFlightSchedule, selectProductionLines, selectSelectedSection } from '../../state/flight-section-planning.selector';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { TranslocoModule } from '@jsverse/transloco';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RackConfiguratorComponent } from '../../components/rack-configurator/rack-configurator.component';
import { SiteStatus } from '../../../shared/domain/site_set_up';
import { updateFlightSection } from '../../state/flight-section-planning.actions';
import { TrailerConfiguratorComponent } from '../../components/trailer-configurator/trailer-configurator.component';
import { Side } from '../../../shared/domain/beluga_problem';
import { IncomingFlightConfiguratorComponent } from '../../components/incoming-flight-configurator/incoming-flight-configurator.component';
import { FlightSection, FlightTargetSchedule, ProductionLineTargetSchedule } from '../../domain/flight-section';
import { OutgoingFlightConfiguratorComponent } from '../../components/outgoing-flight-configurator/outgoing-flight-configurator.component';
import { HangarConfiguratorComponent } from '../../components/hangar-configurator/hangar-configurator.component';
import { ProductionLinesConfiguratorComponent } from '../../components/production-lines-configurator/production-lines-configurator.component';
import { SwapConfiguratorComponent } from '../../components/swap-configurator/swap-configurator.component';
import { ObjectiveConfiguratorComponent } from '../../components/objective-configurator/objective-configurator.component';

@Component({
  selector: 'app-objective-update',
  imports: [
    PageModule,
    BreadcrumbModule,
    TranslocoModule,
    RouterLink,
    MatIconModule,
    RackConfiguratorComponent,
    TrailerConfiguratorComponent,
    IncomingFlightConfiguratorComponent,
    OutgoingFlightConfiguratorComponent,
    HangarConfiguratorComponent,
    ProductionLinesConfiguratorComponent,
    ObjectiveConfiguratorComponent,
  ],
  templateUrl: './objective-update.component.html',
  styleUrl: './objective-update.component.scss'
})
export class ObjectiveUpdateComponent {

  store = inject(Store);

  section = this.store.selectSignal(selectSelectedSection);

  name = computed(() => {
      let name = this.originalFlight()?.name;
      return name ?? "Unknown"
    });

  
  jigTypes = computed(() => this.section()?.siteSetUp.jig_types);
  jigs = computed(() => this.section()?.siteState.jigs);

  racks = computed(() => this.section()?.siteSetUp.racks.map(r => ({
    ...r,
    jigs: this.section()?.siteState.racks[r.name].map(j => this.section()?.siteState.jigs[j])
  })));


  belugaTrailers = computed(() => this.section()?.siteSetUp.belugaTrailers.map(t => {
    const jigName = this.section()?.siteState.trailers[t.name]; 
    return {
      ...t,
      jig: jigName === null || jigName === undefined ? null : this.section()?.siteState.jigs[jigName]
    }
  }));

  factoryTrailers = computed(() => this.section()?.siteSetUp.factoryTrailers.map(t => {
    const jigName = this.section()?.siteState.trailers[t.name]; 
    return {
      ...t,
      jig: jigName === null || jigName === undefined ? null : this.section()?.siteState.jigs[jigName]
    }
  }));

  hangars = computed(() => this.section()?.siteSetUp.hangars.map(t => {
    const jigName = this.section()?.siteState.hangars[t.name]; 
    return {
      ...t,
      jig: jigName === null || jigName === undefined ? null : this.section()?.siteState.jigs[jigName]
    }
  }));


  originalFlight = this.store.selectSignal(selectCurrentFlightSchedule);
  flightTargetSchedule = computed(() => this.section()?.flightTargetSchedule);

  originalProductionLines = this.store.selectSignal(selectProductionLines);
  productionLineTargetSchedules = computed(() => this.section()?.productionLinesTargetSchedule);

  onChangeRackStatus(status: SiteStatus, index: number){
    const oldSection = this.section();
    if(oldSection == undefined){
      return;
    }
    let newSection = {
      ...oldSection,
      siteSetUp: {
        ...oldSection?.siteSetUp,
        racks: [
          ...oldSection.siteSetUp.racks.slice(0,index),
          {
            ...oldSection.siteSetUp.racks[index],
            status
          },
          ...oldSection.siteSetUp.racks.slice(index + 1)
        ]
      }
    }
    this.store.dispatch(updateFlightSection({section: newSection}));
  }


  onChangeTrailerStatus(status: SiteStatus, index: number, side: Side){
    const oldSection = this.section();
    if(oldSection == undefined){
      return;
    }
    if(side == 'bside'){
      let newSection = {
        ...oldSection,
        siteSetUp: {
          ...oldSection?.siteSetUp,
          belugaTrailers: [
            ...oldSection.siteSetUp.belugaTrailers.slice(0,index),
            {
              ...oldSection.siteSetUp.belugaTrailers[index],
              status
            },
            ...oldSection.siteSetUp.belugaTrailers.slice(index + 1)
          ]
        }
      }
      this.store.dispatch(updateFlightSection({section: newSection}));
      return 
    }
    
    if(side == 'fside'){
      let newSection = {
        ...oldSection,
        siteSetUp: {
          ...oldSection?.siteSetUp,
          factoryTrailers: [
            ...oldSection.siteSetUp.factoryTrailers.slice(0,index),
            {
              ...oldSection.siteSetUp.factoryTrailers[index],
              status
            },
            ...oldSection.siteSetUp.factoryTrailers.slice(index + 1)
          ]
        }
      }
      this.store.dispatch(updateFlightSection({section: newSection}));
      return 
    }
  }

  onChangeHangarStatus(status: SiteStatus, index: number){
    const oldSection = this.section();
    if(oldSection == undefined){
      return;
    }
    let newSection = {
      ...oldSection,
      siteSetUp: {
        ...oldSection?.siteSetUp,
        hangars: [
          ...oldSection.siteSetUp.hangars.slice(0,index),
          {
            ...oldSection.siteSetUp.hangars[index],
            status
          },
          ...oldSection.siteSetUp.hangars.slice(index + 1)
        ]
      }
    }
    this.store.dispatch(updateFlightSection({section: newSection}));
  }

  onChangeFlightTarget(newSchedule: FlightTargetSchedule){
    const oldSection = this.section();
    if(oldSection == undefined){
      return;
    }
    let newSection = {
      ...oldSection,
      flightTargetSchedule: newSchedule
    }
    this.store.dispatch(updateFlightSection({section: newSection}));
  }

  onChangeProductionTarget(newSchedule: ProductionLineTargetSchedule[]){
    const oldSection = this.section();
    if(oldSection == undefined){
      return;
    }
    let newSection: FlightSection= {
      ...oldSection,
      productionLinesTargetSchedule: newSchedule
    }
    console.log(newSection)
    this.store.dispatch(updateFlightSection({section: newSection}));
  }

  updateSection(section: FlightSection){
    console.log(section);
    this.store.dispatch(updateFlightSection({section}));
  }
}
