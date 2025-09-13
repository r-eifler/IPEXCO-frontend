import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { TraceInspectorComponent } from '../../../shared/components/trace-inspector/trace-inspector.component';
import { selectProject, selectSelectedSection } from '../../state/flight-section-planning.selector';
import { BelugaActionType } from '../../../shared/domain/beluga_plan';
import { getFlightSchedule, getFullStartState, getProductionSchedule } from '../../domain/flight-section';

@Component({
  selector: 'app-plan-inspector',
  imports: [
    TranslocoModule,
    TraceInspectorComponent,
    PageModule,
    BreadcrumbModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './plan-inspector.component.html',
  styleUrl: './plan-inspector.component.scss'
})
export class PlanInspectorComponent {

  store = inject(Store);

  section = this.store.selectSignal(selectSelectedSection);

  project = this.store.selectSignal(selectProject);

  configuration = computed(() => {
    const index = this.section()?.configurationIndex;
    if(index === undefined){
      return undefined;
    }
    return this.section()?.configurations[index];
  })

  actions = computed(() => this.section()?.actions.filter(a => a.name !== BelugaActionType.SWITCH_TO_NEXT_BELUGA) ?? [])

  startState = computed(() => {
    const section = this.section();
    if(section === undefined){
      return undefined;
    }
    else{
      return getFullStartState(section)
    }
  })
  
  siteSetUp = computed(() => this.configuration()?.siteSetUp)

  flightSchedule = computed(() => {
    const targetSchedule = this.configuration()?.flightTargetSchedule
    let flightIndices = this.section()?.flightIndices
    if(targetSchedule !== undefined && flightIndices !== undefined){
      let orderedFlights = flightIndices.map(index => targetSchedule[index])
      return getFlightSchedule(orderedFlights, false)
    }
    return []
  })

  productionSchedule = computed(() => {
    const targetSchedule = this.configuration()?.productionLinesTargetSchedule
    if(targetSchedule !== undefined){
      return getProductionSchedule(Object.values(targetSchedule), false)
    }
    return []
  })

  name = computed(() => {
    let config = this.configuration();
    let flightIndices = this.section()?.flightIndices
    if(config == undefined || flightIndices == undefined){
      return "Unknown"
    }
    return flightIndices.map(index => config.flightTargetSchedule[index].name).join(" ");
  });

}
