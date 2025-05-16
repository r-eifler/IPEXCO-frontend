import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { Side } from '../../../shared/domain/beluga_problem';
import { SiteStatus } from '../../../shared/domain/site_set_up';
import { HangarConfiguratorComponent } from '../../components/hangar-configurator/hangar-configurator.component';
import { IncomingFlightConfiguratorComponent } from '../../components/incoming-flight-configurator/incoming-flight-configurator.component';
import { ObjectiveConfiguratorComponent } from '../../components/objective-configurator/objective-configurator.component';
import { OutgoingFlightConfiguratorComponent } from '../../components/outgoing-flight-configurator/outgoing-flight-configurator.component';
import { ProductionLinesConfiguratorComponent } from '../../components/production-lines-configurator/production-lines-configurator.component';
import { RackConfiguratorComponent } from '../../components/rack-configurator/rack-configurator.component';
import { TrailerConfiguratorComponent } from '../../components/trailer-configurator/trailer-configurator.component';
import { FlightSection, FlightTargetSchedule, ProductionLineTargetSchedule } from '../../domain/flight-section';
import { updateFlightSection } from '../../state/flight-section-planning.actions';
import { selectCurrentFlightSchedule, selectJigsOnSite, selectProductionLines, selectSelectedSection } from '../../state/flight-section-planning.selector';

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
  configuration = computed(() => {
    const index = this.section()?.configurationIndex;
    if(index === undefined){
      return undefined;
    }
    return this.section()?.configurations[index];
  })
  jigsOnSite = this.store.selectSignal(selectJigsOnSite);

  name = computed(() => {
      let name = this.originalFlight()?.name;
      return name ?? "Unknown"
    });

  
  jigTypes = computed(() => this.configuration()?.siteSetUp.jig_types);
  jigs = computed(() => this.section()?.siteState.jigs);

  racks = computed(() => this.configuration()?.siteSetUp.racks.map(r => ({
    ...r,
    jigs: this.section()?.siteState.racks[r.name].map(j => this.section()?.siteState.jigs[j])
  })));


  belugaTrailers = computed(() => this.configuration()?.siteSetUp.belugaTrailers.map(t => {
    const jigName = this.section()?.siteState.trailers[t.name]; 
    return {
      ...t,
      jig: jigName === null || jigName === undefined ? null : this.section()?.siteState.jigs[jigName]
    }
  }));

  factoryTrailers = computed(() => this.configuration()?.siteSetUp.factoryTrailers.map(t => {
    const jigName = this.section()?.siteState.trailers[t.name]; 
    return {
      ...t,
      jig: jigName === null || jigName === undefined ? null : this.section()?.siteState.jigs[jigName]
    }
  }));

  hangars = computed(() => this.configuration()?.siteSetUp.hangars.map(t => {
    const jigName = this.section()?.siteState.hangars[t.name]; 
    return {
      ...t,
      jig: jigName === null || jigName === undefined ? null : this.section()?.siteState.jigs[jigName]
    }
  }));


  originalFlight = this.store.selectSignal(selectCurrentFlightSchedule);
  flightTargetSchedule = computed(() => this.configuration()?.flightTargetSchedule);

  originalProductionLines = this.store.selectSignal(selectProductionLines);
  productionLineTargetSchedules = computed(() => this.configuration()?.productionLinesTargetSchedule);

  onChangeRackStatus(status: SiteStatus, index: number){
    const oldSection = this.section();
    if(oldSection == undefined){
      return;
    }
    let newSection = {
      ...oldSection,
      // siteSetUp: {
      //   ...oldSection?.siteSetUp,
      //   racks: [
      //     ...oldSection.siteSetUp.racks.slice(0,index),
      //     {
      //       ...oldSection.siteSetUp.racks[index],
      //       status
      //     },
      //     ...oldSection.siteSetUp.racks.slice(index + 1)
      //   ]
      // }
    }
    newSection.configurations[newSection.configurationIndex].siteSetUp.racks[index].status = status;
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
        // siteSetUp: {
        //   ...oldSection?.siteSetUp,
        //   belugaTrailers: [
        //     ...oldSection.siteSetUp.belugaTrailers.slice(0,index),
        //     {
        //       ...oldSection.siteSetUp.belugaTrailers[index],
        //       status
        //     },
        //     ...oldSection.siteSetUp.belugaTrailers.slice(index + 1)
        //   ]
        // }
      }
      newSection.configurations[newSection.configurationIndex].siteSetUp.belugaTrailers[index].status = status 
      this.store.dispatch(updateFlightSection({section: newSection}));
      return 
    }
    
    if(side == 'fside'){
      let newSection = {
        ...oldSection,
        // siteSetUp: {
        //   ...oldSection?.siteSetUp,
        //   factoryTrailers: [
        //     ...oldSection.siteSetUp.factoryTrailers.slice(0,index),
        //     {
        //       ...oldSection.siteSetUp.factoryTrailers[index],
        //       status
        //     },
        //     ...oldSection.siteSetUp.factoryTrailers.slice(index + 1)
        //   ]
        // }
      }
      newSection.configurations[newSection.configurationIndex].siteSetUp.factoryTrailers[index].status = status 
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
      // siteSetUp: {
      //   ...oldSection?.siteSetUp,
      //   hangars: [
      //     ...oldSection.siteSetUp.hangars.slice(0,index),
      //     {
      //       ...oldSection.siteSetUp.hangars[index],
      //       status
      //     },
      //     ...oldSection.siteSetUp.hangars.slice(index + 1)
      //   ]
      // }
    }
    newSection.configurations[newSection.configurationIndex].siteSetUp.hangars[index].status = status 
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
      // productionLinesTargetSchedule: newSchedule
    }
    newSection.configurations[newSection.configurationIndex].productionLinesTargetSchedule = newSchedule;
    console.log(newSection)
    this.store.dispatch(updateFlightSection({section: newSection}));
  }

  updateSection(section: FlightSection){
    console.log(section);
    this.store.dispatch(updateFlightSection({section}));
  }
}
