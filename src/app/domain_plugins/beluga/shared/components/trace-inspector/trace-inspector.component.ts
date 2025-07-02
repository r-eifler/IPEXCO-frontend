import { ChangeDetectorRef, Component, computed, inject, input, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { BelugaConfiguration, getFlightSchedule, getProductionSchedule } from '../../../flight-section-planning/domain/flight-section';
import { BelugaAction } from '../../domain/beluga_plan';
import { applyActions, BelugaState } from '../../domain/beluga_state';
import { PlanActionListComponent } from '../plan-action-list/plan-action-list.component';
import { StateCardComponent } from '../state-card/state-card.component';
import { StepControlComponent } from '../step-control/step-control.component';
import { BelugaSiteSetUp } from '../../domain/site_set_up';
import { Flight, ProductionLine } from '../../domain/beluga_problem';

@Component({
  selector: 'app-trace-inspector',
  imports: [
    PlanActionListComponent,
    StateCardComponent,
    StepControlComponent,
    MatIconModule,
    RouterLink,
    MatButtonModule,
  ],
  templateUrl: './trace-inspector.component.html',
  styleUrl: './trace-inspector.component.scss'
})
export class TraceInspectorComponent {

  cd = inject(ChangeDetectorRef);
  store = inject(Store);

  configuration = input.required<BelugaConfiguration>();
  actions = input.required<BelugaAction[]>();
  startState = input.required<BelugaState>();

  siteSetUp = input.required<BelugaSiteSetUp>();
  productionSchedule = input.required<ProductionLine[]>();
  flightSchedule = input.required<Flight>();

  // section = input.required<FlightSection>();
  // configuration = computed(() => this.section()?.configurations[this.section()?.configurationIndex])

  selectedActionIndex: WritableSignal<number | null> = signal(-1);
  // actions = computed(() => this.section()?.actions.filter(a => a.name !== BelugaActionType.SWITCH_TO_NEXT_BELUGA) ?? [])

  selectedState = computed(() => {
    // const startState = getFullStartState(this.section());
    const state = this.startState();
    const siteSetUp = this.siteSetUp();
    const productionSchedule = this.productionSchedule();
    const flightSchedule = this.flightSchedule();

    let endIndex  = this.selectedActionIndex();
    if(endIndex === null || state === undefined || siteSetUp === undefined || productionSchedule === undefined || flightSchedule === undefined){
      return undefined;
    }
    endIndex += 1;
    const allActions = this.actions() ?? []
    const actions = allActions.slice(0, endIndex);

    const resState = applyActions(
      state,
      actions,
      flightSchedule,
      productionSchedule,
      siteSetUp,
      // getFlightSchedule(this.configuration().flightTargetSchedule, false),
      // getProductionSchedule(this.configuration().productionLinesTargetSchedule, false),
      // this.siteSetUp()
    )
    return resState;
  })

  onCancel(){
    // this.store.dispatch(stopInspectPlan({sectionId: this.section()?._id}))
  }

  onActionSelected(index: number){
    document.startViewTransition(() => {
      this.selectedActionIndex.set(index);
      this.cd.detectChanges();
    });
  }

  onForward(){
    document.startViewTransition(() => {
      this.selectedActionIndex.update((current) =>  Math.min(this.actions()?.length -1, (current ?? 0) + 1));
      this.cd.detectChanges();
    });
  }

  onBack(){
    document.startViewTransition(() => {
      this.selectedActionIndex.update((current) =>  Math.max(-1, (current ?? 0) - 1))
      this.cd.detectChanges();
    });
  }

}
