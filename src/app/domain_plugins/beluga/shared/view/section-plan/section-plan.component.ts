import { ChangeDetectorRef, Component, computed, inject, input, signal, WritableSignal } from '@angular/core';
import { FlightSection, getFlightSchedule, getFullStartState, getProductionSchedule } from '../../../flight-section-planning/domain/flight-section';
import { PlanActionListComponent } from '../../components/plan-action-list/plan-action-list.component';
import { StateCardComponent } from '../../components/state-card/state-card.component';
import { StepControlComponent } from '../../components/step-control/step-control.component';
import { BelugaActionType } from '../../domain/beluga_plan';
import { applyActions } from '../../domain/beluga_state';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { stopInspectPlan } from '../../../flight-section-planning/state/flight-section-planning.actions';

@Component({
  selector: 'app-section-plan',
  imports: [
    PlanActionListComponent,
    StateCardComponent,
    StepControlComponent,
    MatIconModule,
    RouterLink,
    MatButtonModule,
  ],
  templateUrl: './section-plan.component.html',
  styleUrl: './section-plan.component.scss'
})
export class SectionPlanComponent {
  cd = inject(ChangeDetectorRef);
  store = inject(Store);

  section = input.required<FlightSection>();
  configuration = computed(() => this.section()?.configurations[this.section()?.configurationIndex])

  selectedActionIndex: WritableSignal<number | null> = signal(-1);
  actions = computed(() => this.section()?.actions.filter(a => a.name !== BelugaActionType.SWITCH_TO_NEXT_BELUGA) ?? [])

  selectedState = computed(() => {
    const startState = getFullStartState(this.section());
    let endIndex  = this.selectedActionIndex();
    if(endIndex === null || startState === undefined){
      return undefined;
    }
    endIndex += 1;
    const allActions = this.actions()
    const actions = allActions.slice(0, endIndex);

    const resState = applyActions(
      startState,
      actions,
      getFlightSchedule(this.configuration().flightTargetSchedule, false),
      getProductionSchedule(this.configuration().productionLinesTargetSchedule, false),
      this.configuration().siteSetUp
    )
    return resState;
  })

  onCancel(){
    this.store.dispatch(stopInspectPlan({sectionId: this.section()?._id}))
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
