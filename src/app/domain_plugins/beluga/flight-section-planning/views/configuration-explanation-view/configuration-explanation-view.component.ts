import { Component, computed, effect, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLabel } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { ExplanationRunStatus } from 'src/app/iterative_planning/domain/explanation/explanations';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { ConfigurationSelectorComponent } from '../../components/configuration-selector/configuration-selector.component';
import { ExplanationControlsComponent } from '../../components/explanation-controls/explanation-controls.component';
import { HangarConfiguratorComponent } from '../../components/hangar-configurator/hangar-configurator.component';
import { MultiFlightConfiguratorComponent } from '../../components/multi-flight-configurator/multi-flight-configurator.component';
import { ProductionLinesConfiguratorComponent } from '../../components/production-lines-configurator/production-lines-configurator.component';
import { RackConfiguratorComponent } from '../../components/rack-configurator/rack-configurator.component';
import { TrailerConfiguratorComponent } from '../../components/trailer-configurator/trailer-configurator.component';
import { inspectConfig } from '../../state/flight-section-planning.actions';
import { selectSelectedConfigIndex } from '../../state/flight-section-planning.feature';
import { selectJigsOnSite, selectProductionLines, selectSelectedConfiguration, selectSelectedSection } from '../../state/flight-section-planning.selector';
import { selectHasEmptyRackConflictMember, selectIncomingFlightConflictMembers, selectOutgoingFlightConflictMembers, selectProductionConflictMembers, selectRackMaintenanceConflictMembers, selectSwapsConflictMembers, selectTrailerMaintenanceConflictMembers } from './configuration-explanation-view.selectors';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-configuration-explanation-view',
  imports: [
        PageModule,
        BreadcrumbModule,
        TranslocoModule,
        MatIconModule,
        RackConfiguratorComponent,
        TrailerConfiguratorComponent,
        HangarConfiguratorComponent,
        ProductionLinesConfiguratorComponent,
        ExplanationControlsComponent,
        ConfigurationSelectorComponent,
        MatProgressBarModule,
        MatLabel,
        MultiFlightConfiguratorComponent,
        MatCardModule
  ],
  templateUrl: './configuration-explanation-view.component.html',
  styleUrl: './configuration-explanation-view.component.scss'
})
export class ConfigurationExplanationViewComponent {

    store = inject(Store);
  
    section = this.store.selectSignal(selectSelectedSection);
    configuration = this.store.selectSignal(selectSelectedConfiguration);
    selectedConfigId = this.store.selectSignal(selectSelectedConfigIndex);
    configurations = computed(() => this.section()?.configurations);
  
    jigsOnSite = this.store.selectSignal(selectJigsOnSite);

    sectionName = computed(() => {
      const flightSchedule = this.flightTargetSchedule();
      if(flightSchedule === undefined){
        return 'UNKNOWN'
      }
      return Object.values(flightSchedule).map(f => f.name).join(" - ")
    })

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

    explanationsComputationRunning = computed(() => this.configuration()?.explanationStatus === ExplanationRunStatus.RUNNING)
    hasExplanations = computed(() => this.configuration()?.explanationStatus === ExplanationRunStatus.FINISHED)
    conflicts = computed(() => this.configuration()?.explanations?.MUGS)

    // conflict members

    loadConflictMembers = this.store.selectSignal(selectOutgoingFlightConflictMembers);
    unloadConflictMembers = this.store.selectSignal(selectIncomingFlightConflictMembers);
    deliverConflictMembers = this.store.selectSignal(selectProductionConflictMembers);
    swapConflictMembers = this.store.selectSignal(selectSwapsConflictMembers);
    hasEmptyRackConflictMember = this.store.selectSignal(selectHasEmptyRackConflictMember);
    rackMaintenanceConflictMembers = this.store.selectSignal(selectRackMaintenanceConflictMembers);
    trailerMaintenanceConflictMembers = this.store.selectSignal(selectTrailerMaintenanceConflictMembers);

    constructor(){
      effect(() => {
        const sectionId = this.section()?._id;
        const configIndex = this.selectedConfigId();
        if(sectionId !== undefined && configIndex !== null){
          this.store.dispatch(inspectConfig({sectionId, configIndex}))
        }
      });
    }

    // site elements  
    
    jigTypes = computed(() => this.configuration()?.siteSetUp.jig_types);
    jigs = computed(() => this.section()?.siteState.jigs);
  
    racks = computed(() => this.configuration()?.siteSetUp.racks.map(r => ({
      ...r,
      jigs: this.section()?.siteState.racks[r.name].map(j => this.section()?.siteState.jigs[j]),
      conflict: this.rackMaintenanceConflictMembers()?.find(cm => cm.rackName == r.name) !== undefined
    })));
  
  
    belugaTrailers = computed(() => this.configuration()?.siteSetUp.belugaTrailers.map(t => {
      const jigName = this.section()?.siteState.trailers[t.name]; 
      return {
        ...t,
        jig: jigName === null || jigName === undefined ? null : this.section()?.siteState.jigs[jigName],
        conflict: this.trailerMaintenanceConflictMembers()?.find(cm => cm.trailerName == t.name) !== undefined
      }
    }));
  
    factoryTrailers = computed(() => this.configuration()?.siteSetUp.factoryTrailers.map(t => {
      const jigName = this.section()?.siteState.trailers[t.name]; 
      return {
        ...t,
        jig: jigName === null || jigName === undefined ? null : this.section()?.siteState.jigs[jigName],
        conflict: this.trailerMaintenanceConflictMembers()?.find(cm => cm.trailerName == t.name) !== undefined
      }
    }));
  
    hangars = computed(() => this.configuration()?.siteSetUp.hangars.map(t => {
      const jigName = this.section()?.siteState.hangars[t.name]; 
      return {
        ...t,
        jig: jigName === null || jigName === undefined ? null : this.section()?.siteState.jigs[jigName]
      }
    }));
  

}
