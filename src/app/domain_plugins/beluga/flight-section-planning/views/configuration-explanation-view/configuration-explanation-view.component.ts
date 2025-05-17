import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { ExplanationRunStatus } from 'src/app/iterative_planning/domain/explanation/explanations';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { ConfigurationSelectorComponent } from '../../components/configuration-selector/configuration-selector.component';
import { ExplanationControlsComponent } from '../../components/explanation-controls/explanation-controls.component';
import { HangarConfiguratorComponent } from '../../components/hangar-configurator/hangar-configurator.component';
import { IncomingFlightConfiguratorComponent } from '../../components/incoming-flight-configurator/incoming-flight-configurator.component';
import { OutgoingFlightConfiguratorComponent } from '../../components/outgoing-flight-configurator/outgoing-flight-configurator.component';
import { ProductionLinesConfiguratorComponent } from '../../components/production-lines-configurator/production-lines-configurator.component';
import { RackConfiguratorComponent } from '../../components/rack-configurator/rack-configurator.component';
import { TrailerConfiguratorComponent } from '../../components/trailer-configurator/trailer-configurator.component';
import { selectSelectedConfigIndex } from '../../state/flight-section-planning.feature';
import { selectCurrentFlightSchedule, selectJigsOnSite, selectProductionLines, selectSelectedConfiguration, selectSelectedSection } from '../../state/flight-section-planning.selector';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { selectHasEmptyRackConflictMember, selectIncomingFlightConflictMembers, selectOutgoingFlightConflictMembers, selectProductionConflictMembers, selectRackMaintenanceConflictMembers, selectSwapsConflictMembers, selectTrailerMaintenanceConflictMembers } from './configuration-explanation-view.selectors';

@Component({
  selector: 'app-configuration-explanation-view',
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
        ExplanationControlsComponent,
        ConfigurationSelectorComponent,
        MatProgressBarModule,
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

    originalFlight = this.store.selectSignal(selectCurrentFlightSchedule);
    flightTargetSchedule = computed(() => this.configuration()?.flightTargetSchedule);
  
    originalProductionLines = this.store.selectSignal(selectProductionLines);
    productionLineTargetSchedules = computed(() => this.configuration()?.productionLinesTargetSchedule);

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

    // site elements
  
    name = computed(() => {
        let name = this.originalFlight()?.name;
        return name ?? "Unknown"
      });
  
    
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
