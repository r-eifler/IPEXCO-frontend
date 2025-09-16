import { Component, computed, effect, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { Side } from '../../../shared/domain/beluga_problem';
import { SiteStatus } from '../../../shared/domain/site_set_up';
import { ConfigurationUpdateControlsComponent } from '../../components/configuration-update-controls/configuration-update-controls.component';
import { ConstraintControlsComponent } from '../../components/constraint-controls/constraint-controls.component';
import { HangarConfiguratorComponent } from '../../components/hangar-configurator/hangar-configurator.component';
import { ProductionLinesConfiguratorComponent } from '../../components/production-lines-configurator/production-lines-configurator.component';
import { RackConfiguratorComponent } from '../../components/rack-configurator/rack-configurator.component';
import { TrailerConfiguratorComponent } from '../../components/trailer-configurator/trailer-configurator.component';
import { newConfiguration, skipIncomingJig, skipOutgoingJigType, skipProductionJig, updateHangarStatus, updateRackStatus, updateTrailerStatus } from '../../state/flight-section-planning.actions';
import { selectJigsOnSite, selectProductionLines, selectSelectedSection, selectUpdatingConfiguration } from '../../state/flight-section-planning.selector';
import { MultiFlightConfiguratorComponent } from '../../components/multi-flight-configurator/multi-flight-configurator.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-configuration-update-view',
  imports: [
    PageModule,
    BreadcrumbModule,
    TranslocoModule,
    MatIconModule,
    RackConfiguratorComponent,
    TrailerConfiguratorComponent,
    HangarConfiguratorComponent,
    ProductionLinesConfiguratorComponent,
    ConfigurationUpdateControlsComponent,
    ConstraintControlsComponent,
    MultiFlightConfiguratorComponent,
    MatCardModule
  ],
  templateUrl: './configuration-update-view.component.html',
  styleUrl: './configuration-update-view.component.scss'
})
export class ConfigurationUpdateViewComponent {

  store = inject(Store);

  section = this.store.selectSignal(selectSelectedSection);
  configuration = this.store.selectSignal(selectUpdatingConfiguration);

  jigsOnSite = this.store.selectSignal(selectJigsOnSite);

  flightTargetSchedule = computed(() => this.configuration()?.flightTargetSchedule);
  
  orderedFlights = computed(() => {
    const flightSchedule = this.flightTargetSchedule();
    if(flightSchedule === undefined){
      return []
    }
    return this.section()?.flightIndices.map(index => flightSchedule[index])
  })

  originalProductionLines = this.store.selectSignal(selectProductionLines);
  productionLineTargetSchedules = computed(() => {
    const schedule = this.configuration()?.productionLinesTargetSchedule;
    if(schedule === undefined){
      return []
    }
    return Object.values(schedule);
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

  constructor(){
    effect(() => {
      console.log(this.section())
      if(this.section() !== undefined){
        this.store.dispatch(newConfiguration());
      }
    });
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

  onChangeFlight(change: {flightIndex: number, incoming: boolean, index: number, skip: boolean}){
    console.log(change)
    if(change.incoming){
      this.store.dispatch(skipIncomingJig({flightIndex: change.flightIndex, index: change.index, skip: change.skip}));
    }
    else{
      this.store.dispatch(skipOutgoingJigType({flightIndex: change.flightIndex, index: change.index, skip: change.skip}));
    }
  }


  onChangeProductionTarget(change: {productionLineName: string, index: number, skip:boolean}){
    this.store.dispatch(skipProductionJig({productionLineName: change.productionLineName, index: change.index, skip: change.skip}));
  }
}
