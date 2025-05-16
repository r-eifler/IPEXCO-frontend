import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSelectedSection, selectUpdatingConfiguration, selectJigsOnSite, selectCurrentFlightSchedule, selectProductionLines, selectSelectedConfiguration } from '../../state/flight-section-planning.selector';
import { TranslocoModule } from '@jsverse/transloco';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { HangarConfiguratorComponent } from '../../components/hangar-configurator/hangar-configurator.component';
import { IncomingFlightConfiguratorComponent } from '../../components/incoming-flight-configurator/incoming-flight-configurator.component';
import { ObjectiveConfiguratorComponent } from '../../components/objective-configurator/objective-configurator.component';
import { OutgoingFlightConfiguratorComponent } from '../../components/outgoing-flight-configurator/outgoing-flight-configurator.component';
import { ProductionLinesConfiguratorComponent } from '../../components/production-lines-configurator/production-lines-configurator.component';
import { RackConfiguratorComponent } from '../../components/rack-configurator/rack-configurator.component';
import { TrailerConfiguratorComponent } from '../../components/trailer-configurator/trailer-configurator.component';
import { MatIconModule } from '@angular/material/icon';
import { ExplanationControlsComponent } from '../../components/explanation-controls/explanation-controls.component';
import { ExplanationRunStatus } from 'src/app/iterative_planning/domain/explanation/explanations';

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
  ],
  templateUrl: './configuration-explanation-view.component.html',
  styleUrl: './configuration-explanation-view.component.scss'
})
export class ConfigurationExplanationViewComponent {

    store = inject(Store);
  
    section = this.store.selectSignal(selectSelectedSection);
    configuration = this.store.selectSignal(selectSelectedConfiguration);
  
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

    hasExplanations = computed(() => this.configuration()?.explanationStatus === ExplanationRunStatus.FINISHED)
    conflicts = computed(() => this.configuration()?.explanations?.MUGS)
}
