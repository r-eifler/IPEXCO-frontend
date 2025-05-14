import { Component, computed, input, signal, WritableSignal } from '@angular/core';
import { FlightSection, getFlightSchedule, getFullStartState, getProductionSchedule } from '../../../flight-section-planning/domain/flight-section';
import { PlanActionListComponent } from '../../components/plan-action-list/plan-action-list.component';
import { StateCardComponent } from '../../components/state-card/state-card.component';
import { StepControlComponent } from '../../components/step-control/step-control.component';
import { BelugaAction, BelugaActionType } from '../../domain/beluga_plan';
import { applyActions } from '../../domain/beluga_state';

@Component({
  selector: 'app-section-plan',
  imports: [
    PlanActionListComponent,
    StateCardComponent,
    StepControlComponent
  ],
  templateUrl: './section-plan.component.html',
  styleUrl: './section-plan.component.scss'
})
export class SectionPlanComponent {

  section = input.required<FlightSection>();

  selectedActionIndex: WritableSignal<number | null> = signal(-1);
  actions = computed(() => this.section()?.actions.filter(a => a.name !== BelugaActionType.SWITCH_TO_NEXT_BELUGA) ?? [])

  selectedState = computed(() => {
    const section = this.section();
    const startState = getFullStartState(this.section());
    let endIndex  = this.selectedActionIndex();
    if(endIndex === null || startState === undefined){
      return undefined;
    }
    endIndex += 1;
    const allActions = this.actions()
    const actions = allActions.slice(0, endIndex);

    return applyActions(
      startState, 
      actions, 
      getFlightSchedule(section.flightTargetSchedule, false),
      getProductionSchedule(section.productionLinesTargetSchedule, false),
      section.siteSetUp
    )
  })


  onActionSelected(index: number){
    this.selectedActionIndex.set(index)
  }

  onForward(){
    this.selectedActionIndex.update((current) =>  Math.min(this.actions()?.length, (current ?? 0) + 1))
  }
  
  onBack(){
    this.selectedActionIndex.update((current) =>  Math.max(0, (current ?? 0) - 1))
  }

}
