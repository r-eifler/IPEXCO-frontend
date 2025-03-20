import { Component, computed, effect, inject, input, signal, WritableSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Plan } from 'src/app/iterative_planning/domain/plan';
import { array } from 'zod';
import { BelugaAction, BelugaActionType, BelugaActionZ, JigActionZ } from '../../domain/beluga_plan';
import { BelugaProblemZ, Flight, Jig } from '../../domain/beluga_problem';
import { ActionCardComponent } from '../action-card/action-card.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { toSignal } from '@angular/core/rxjs-interop';
import { actionsForFlight, actionsForJigs } from './plan-filters';

interface DisplayAction {
  action: BelugaAction,
  highlight: boolean
}

@Component({
  selector: 'app-plan-inspection',
  imports: [
    ActionCardComponent,
  ],
  templateUrl: './plan-inspection.component.html',
  styleUrl: './plan-inspection.component.scss'
})
export class PlanInspectionComponent {

  selectedJigs = input.required<string[]>();
  selectedFlight = input.required<string | null>();
  hiddenPrefix = input<number>(0);

  selectedJig: WritableSignal<string | null> = signal(null);

  actions = input.required<BelugaAction[] | null>();

  filteredActions = computed(() => {
    let actions = this.actions();
    if(actions === null){
      return null
    }
    const flight = this.selectedFlight();
    if(flight !== null && flight !== undefined) {
      actions = actionsForFlight(actions, this.flights().findIndex(f => f.name === flight) + 1)
    }

    if(actions === null){
      return null;
    }

    const jigs = this.selectedJigs();
    if(jigs !== null && jigs.length > 0) {
      actions = actionsForJigs(actions, jigs)
    }

    return actions;
  })

  displayActions = computed(() => {
    const actions = this.filteredActions();
    let highlight = false;
    const displayActions =  actions?.map(a => {
      if (a.name !== BelugaActionType.SWITCH_TO_NEXT_BELUGA){
        const jigAction = JigActionZ.parse(a);
        highlight = jigAction.j == this.selectedJig()
      }
      // if(highlight){
      //   console.log(a.name)
      // }
      return {
        action: a,
        highlight
      }
    });
    console.log("hidden prefix: " + this.hiddenPrefix())
    return displayActions === undefined ? [] : displayActions.slice(this.hiddenPrefix());
  })



	model = input.required<unknown>();
	belugaProblem = computed(() => BelugaProblemZ.parse(this.model()))

  flights = computed(() => this.belugaProblem()?.flights)
  jigs = computed(() => Object.values(this.belugaProblem()?.jigs))

  onHighlight(highlighted: boolean, action: BelugaAction){
    if(!highlighted){
      this.selectedJig.update(() => null);
      return
    }

    if (action === null || action.name === BelugaActionType.SWITCH_TO_NEXT_BELUGA){
      this.selectedJig.update(() => null);
      return;
    }
    const jigAction = JigActionZ.parse(action);
    // console.log(jigAction.j);
    this.selectedJig.update(() => jigAction.j);
  }

}
