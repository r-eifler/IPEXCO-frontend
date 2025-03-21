import { Component, computed, input, output, signal, WritableSignal } from '@angular/core';
import { BelugaAction, BelugaActionType, JigActionZ } from '../../domain/beluga_plan';
import { BelugaProblemZ } from '../../domain/beluga_problem';
import { ActionCardComponent } from '../action-card/action-card.component';
import { actionsForFlight, actionsForJigs } from './plan-filters';

export interface DisplayAction {
  index: number,
  action: BelugaAction,
  highlight: boolean,
  trackId: string
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
  actions = input.required<BelugaAction[] | null>();

  actionSelected = output<number>();

  selectedJigId: WritableSignal<string | null> = signal(null);

  displayActions = computed(() => {
    const actions = this.actions();

    if(actions === null){
      return actions;
    }

    const displayActions: DisplayAction[] =  actions.map((action, index) => {

      let highlight = false;
      if (action.name !== BelugaActionType.SWITCH_TO_NEXT_BELUGA){
        const jigAction = JigActionZ.parse(action);
        highlight = jigAction.j === this.selectedJigId()
      }

      return {
        index,
        action,
        highlight,
        trackId: index.toString() + highlight.toString()
      }
    });

    if(this.hiddenPrefix() !== null){
      return displayActions.slice(this.hiddenPrefix())
    }
    return displayActions;
  })


  filteredActions = computed(() => {
    let actions = this.displayActions();
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



	model = input.required<unknown>();
	belugaProblem = computed(() => BelugaProblemZ.parse(this.model()))

  flights = computed(() => this.belugaProblem()?.flights)
  jigs = computed(() => Object.values(this.belugaProblem()?.jigs))

  onHighlight(highlighted: boolean, action: BelugaAction){
    if(!highlighted){
      this.selectedJigId.update(() => null);
      return
    }

    if (action === null || action.name === BelugaActionType.SWITCH_TO_NEXT_BELUGA){
      this.selectedJigId.update(() => null);
      return;
    }
    const jigAction = JigActionZ.parse(action);
    this.selectedJigId.update(() => jigAction.j);
  }

  onSelected(index: number){
    this.actionSelected.emit(index);
  }
}
