import { Component, computed, effect, input, output } from '@angular/core';
import { BelugaAction, BelugaActionType, JigActionZ, RackActionZ } from '../../domain/beluga_plan';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-action-card',
  imports: [
    MatIconModule
  ],
  templateUrl: './action-card.component.html',
  styleUrl: './action-card.component.scss'
})
export class ActionCardComponent {
  
  action = input.required<BelugaAction>();
  highlight = input.required<boolean>();
  selfHighlight = false;
  hovered = output<boolean>();

  jigName  = computed(() => {
    const action = this.action();
    if (action === null || action.name === BelugaActionType.SWITCH_TO_NEXT_BELUGA){
      return null;
    }
    const jigAction = JigActionZ.parse(action);
    return jigAction.j.replace('jig','');
  })

  rackName  = computed(() => {
    const action = this.action();
    if (action.name === BelugaActionType.PUT_DOWN_RACK ||
      action.name === BelugaActionType.PICK_UP_RACK
    ){
      const rackAction = RackActionZ.parse(action);
      return rackAction.r.replace('rack','');
    }
    return null
  })

  actionLocationIcon = new Map<BelugaActionType, string>([
    [BelugaActionType.UNLOAD_BELUGA, "flight"],
    [BelugaActionType.LOAD_BELUGA, "flight"],
    [BelugaActionType.PUT_DOWN_RACK, "menu"],
    [BelugaActionType.PICK_UP_RACK, "menu"],
    [BelugaActionType.DELIVER_TO_HANGAR, "warehouse"],
    [BelugaActionType.GET_FROM_HANGAR, "warehouse"],
    [BelugaActionType.SWITCH_TO_NEXT_BELUGA, "flight"],
  ]);

  actionMoveIcon = new Map<BelugaActionType, string>([
    [BelugaActionType.UNLOAD_BELUGA, "arrow_forward"],
    [BelugaActionType.LOAD_BELUGA, "arrow_back"],
    [BelugaActionType.PUT_DOWN_RACK, "arrow_back"],
    [BelugaActionType.PICK_UP_RACK, "arrow_forward"],
    [BelugaActionType.DELIVER_TO_HANGAR, "arrow_back"],
    [BelugaActionType.GET_FROM_HANGAR, "arrow_forward"],
    [BelugaActionType.SWITCH_TO_NEXT_BELUGA, "swap_horiz"],
  ]);


  actionColor= new Map<BelugaActionType, string>([
    [BelugaActionType.UNLOAD_BELUGA, "#ffeb99"],
    [BelugaActionType.LOAD_BELUGA, "#ffeb99"],
    [BelugaActionType.PUT_DOWN_RACK, "#b3f0ff"],
    [BelugaActionType.PICK_UP_RACK, "#b3f0ff"],
    [BelugaActionType.DELIVER_TO_HANGAR, "#b3ffb3"],
    [BelugaActionType.GET_FROM_HANGAR, "#b3ffb3"],
    [BelugaActionType.SWITCH_TO_NEXT_BELUGA, "#ff9999"],
  ]);

  onEnter(){
    this.hovered.emit(true);
  }

  onLeave(){
    this.hovered.emit(false);

  }

}