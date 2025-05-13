import { Component, computed, input, signal, WritableSignal } from '@angular/core';
import { BelugaProblem } from '../../domain/beluga_problem';
import { FlightSection, getFullState } from '../../../flight-section-planning/domain/flight-section';
import { PlanActionListComponent } from '../../components/plan-action-list/plan-action-list.component';
import { StateCardComponent } from '../../components/state-card/state-card.component';
import { StepControlComponent } from '../../components/step-control/step-control.component';
import { BehaviorSubject } from 'rxjs';
import { BelugaAction } from '../../domain/beluga_plan';
import { applyAction, applyActions } from '../../domain/beluga_state';

@Component({
  selector: 'app-single-plan-view',
  imports: [
    PlanActionListComponent,
    StepControlComponent
  ],
  templateUrl: './single-plan-view.component.html',
  styleUrl: './single-plan-view.component.scss'
})
export class SinglePlanViewComponent {

    sections = input.required<FlightSection[]>();

    selectedActionIndex: WritableSignal<number | null> = signal(null);
    actions = computed(() => this.sections()?.reduce((actions, section) => ([...actions, ...section.actions]), [] as BelugaAction[]))

    selectedState = computed(() => {
      const firstSection = this.sections()?.[0]
      let startState = getFullState(firstSection);
      let endIndex  = this.selectedActionIndex();
      if(endIndex === null || startState === undefined){
        return undefined;
      }
      endIndex += 1;
      const allActions = this.actions()
      const actions = allActions.slice(0, endIndex);
      // TODO
      // return applyActions(startState, actions, firstSection.)
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
