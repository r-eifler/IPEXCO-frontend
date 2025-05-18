import { ApplicationRef, Component, computed, inject, input, signal, WritableSignal } from '@angular/core';
import { FlightSection, getFlightSchedule, getFullStartState, getProductionSchedule } from '../../../flight-section-planning/domain/flight-section';
import { PlanActionListComponent } from '../../components/plan-action-list/plan-action-list.component';
import { StateCardComponent } from '../../components/state-card/state-card.component';
import { StepControlComponent } from '../../components/step-control/step-control.component';
import { BelugaAction, BelugaActionType } from '../../domain/beluga_plan';
import { applyActions } from '../../domain/beluga_state';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

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
  appRef = inject(ApplicationRef);

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


  onActionSelected(index: number){
    this.selectedActionIndex.set(index)
  }

  onForward(){
    document.startViewTransition(() => {
      this.selectedActionIndex.update((current) =>  Math.min(this.actions()?.length, (current ?? 0) + 1));
      this.appRef.tick();
    })
  }

  onBack(){
    document.startViewTransition(() => {
      this.selectedActionIndex.update((current) =>  Math.max(0, (current ?? 0) - 1))
      this.appRef.tick();
    });
  }

}
