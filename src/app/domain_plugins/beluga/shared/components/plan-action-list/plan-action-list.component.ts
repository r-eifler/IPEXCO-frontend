import { Component, computed, input, output, signal, WritableSignal } from '@angular/core';
import { BelugaAction, BelugaActionType, JigActionZ } from '../../domain/beluga_plan';
import { BelugaProblem, BelugaProblemZ } from '../../domain/beluga_problem';
import { ActionCardComponent } from '../action-card/action-card.component';
import { actionsForFlight, actionsForJigs } from './plan-filters';
import { InitCardComponent } from '../init-card/init-card.component';

export interface DisplayAction {
  index: number,
  action: BelugaAction,
  highlight: boolean,
  selected: boolean,
  trackId: string
}

@Component({
  selector: 'app-plan-action-list',
  imports: [
    ActionCardComponent,
    InitCardComponent,
  ],
  templateUrl: './plan-action-list.component.html',
  styleUrl: './plan-action-list.component.scss'
})
export class PlanActionListComponent {

  actions = input.required<BelugaAction[] | null>();

  selectedJigs = input<string[]>([]);
  selectedFlight = input<string | null>(null);
  hiddenPrefix = input<number>(0);
  selectedAction = input.required<number | null>();
  

  actionSelected = output<number>();

  initSelected = computed(() => this.selectedAction() === -1)
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
        selected: this.selectedAction() === index,
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


	task = input.required<BelugaProblem>();

  flights = computed(() => this.task()?.flights)
  jigs = computed(() => Object.values(this.task()?.jigs))



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

  onInitSelect(){
    this.actionSelected.emit(-1);
  }
}
