import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { Side } from '../../../shared/domain/beluga_problem';
import { SiteStatus } from '../../../shared/domain/site_set_up';
import { ConfiugurationUpdateControlsComponent } from '../../components/confiuguration-update-controls/confiuguration-update-controls.component';
import { HangarConfiguratorComponent } from '../../components/hangar-configurator/hangar-configurator.component';
import { IncomingFlightConfiguratorComponent } from '../../components/incoming-flight-configurator/incoming-flight-configurator.component';
import { OutgoingFlightConfiguratorComponent } from '../../components/outgoing-flight-configurator/outgoing-flight-configurator.component';
import { ProductionLinesConfiguratorComponent } from '../../components/production-lines-configurator/production-lines-configurator.component';
import { RackConfiguratorComponent } from '../../components/rack-configurator/rack-configurator.component';
import { TrailerConfiguratorComponent } from '../../components/trailer-configurator/trailer-configurator.component';
import { newConfiguration, skipIncomingJig, skipOutgoingJigType, skipProductionJig, updateHangarStatus, updateRackStatus, updateTrailerStatus } from '../../state/flight-section-planning.actions';
import { selectCurrentFlightSchedule, selectJigsOnSite, selectProductionLines, selectSelectedSection, selectUpdatingConfiguration } from '../../state/flight-section-planning.selector';

@Component({
  selector: 'app-configuration-update-view',
  imports: [
    PageModule,
    BreadcrumbModule,
    TranslocoModule,
    MatIconModule,
    RackConfiguratorComponent,
    TrailerConfiguratorComponent,
    IncomingFlightConfiguratorComponent,
    OutgoingFlightConfiguratorComponent,
    HangarConfiguratorComponent,
    ProductionLinesConfiguratorComponent,
    ConfiugurationUpdateControlsComponent,
  ],
  templateUrl: './configuration-update-view.component.html',
  styleUrl: './configuration-update-view.component.scss'
})
export class ConfigurationUpdateViewComponent {

  store = inject(Store);

  section = this.store.selectSignal(selectSelectedSection);
  configuration = this.store.selectSignal(selectUpdatingConfiguration);

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

  constructor(){
    this.store.dispatch(newConfiguration());
  }

  onChangeRackStatus(status: SiteStatus, index: number){
    this.store.dispatch(updateRackStatus({index, status}));
  }

  onChangeTrailerStatus(status: SiteStatus, index: number, side: Side){
    this.store.dispatch(updateTrailerStatus({index, side, status}));
  }

  onChangeHangarStatus(status: SiteStatus, index: number){
    this.store.dispatch(updateHangarStatus({index, status}));
  }

  onChangeIncomingFlight(change: {index: number, skip:boolean}){
    this.store.dispatch(skipIncomingJig({index: change.index, skip: change.skip}));
  }

  onChangeOutgoingFlight(change: {index: number, skip:boolean}){
    this.store.dispatch(skipOutgoingJigType({index: change.index, skip: change.skip}));
  }

  onChangeProductionTarget(change: {productionLineIndex: number, index: number, skip:boolean}){
    this.store.dispatch(skipProductionJig({productionLineIndex: change.productionLineIndex, index: change.index, skip: change.skip}));
  }
}
