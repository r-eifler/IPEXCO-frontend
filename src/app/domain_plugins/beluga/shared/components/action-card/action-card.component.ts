import { Component, computed, effect, ElementRef, input, output, Signal, viewChild } from '@angular/core';
import { BelugaAction, BelugaActionType, JigActionZ, PickUpRackZ, PutDownRackZ, RackActionZ, SideActionZ } from '../../domain/beluga_plan';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-action-card',
  imports: [
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './action-card.component.html',
  styleUrl: './action-card.component.scss',
  animations: [
    trigger('zoomInOut', [
      transition(':enter', [style({scale: 0}), animate('100ms', style({scale: 1}))]),
      transition(':leave', [style({scale: 1}), animate('100ms', style({scale: 0}))]),
    ]),
  ],
})
export class ActionCardComponent {
  root = viewChild.required<ElementRef<HTMLDivElement>>('root');

  action = input.required<BelugaAction>();
  highlight = input.required<boolean>();
  select = input.required<boolean>();

  hovered = output<boolean>();
  selected = output<void>();

  selfHighlight = false;

  constructor() {
    effect(() => {
      const isSelected = this.select();

      if (!isSelected || !this.root()) {
        return;
      }

      this.root().nativeElement.scrollIntoView({behavior: 'smooth', block: "nearest", inline: "nearest"});
    })
  }

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

  isHangarAction = computed(() =>
    this.action()?.name === BelugaActionType.DELIVER_TO_HANGAR ||
    this.action().name === BelugaActionType.GET_FROM_HANGAR
  );

  isBelugaAction = computed(() =>
    this.action()?.name === BelugaActionType.UNLOAD_BELUGA ||
    this.action().name === BelugaActionType.LOAD_BELUGA
  );

  isRackAction = computed(() =>
    this.action()?.name === BelugaActionType.PICK_UP_RACK ||
    this.action()?.name === BelugaActionType.PUT_DOWN_RACK
  );

  isBelugaRackSideAction = computed(() => {
    if(this.action()?.name === BelugaActionType.PICK_UP_RACK ||
      this.action()?.name === BelugaActionType.PUT_DOWN_RACK){
        return SideActionZ.parse(this.action()).s === 'bside';
    }
    return false
  });

  isFactoryRackSideAction = computed(() => {
    if(this.action()?.name === BelugaActionType.PICK_UP_RACK ||
      this.action()?.name === BelugaActionType.PUT_DOWN_RACK){
        return SideActionZ.parse(this.action()).s === 'fside';
    }
    return false
  });

  isSwitchAction = computed(() =>
    this.action()?.name === BelugaActionType.SWITCH_TO_NEXT_BELUGA
  )

  moveIconLocation: Signal<'left' | 'right'> = computed(() => {
    if (
      this.isHangarAction() ||
      this.isBelugaRackSideAction()
    ) {
      return 'left';
    }

    return 'right';
  })

  locationName = computed(() => {
    if (this.isFactoryRackSideAction() || this.isBelugaRackSideAction()) {
      return this.rackName();
    }

    return undefined;
  })

  actionLocationIcon = computed(() => {
    switch (this.action().name){
      case BelugaActionType.UNLOAD_BELUGA:
        return 'flight_land';
      case BelugaActionType.LOAD_BELUGA:
        return 'flight_takeoff';
      case BelugaActionType.SWITCH_TO_NEXT_BELUGA:
        return "flight"
      case BelugaActionType.PUT_DOWN_RACK:
      case BelugaActionType.PICK_UP_RACK:
        return "shelves";
      case BelugaActionType.DELIVER_TO_HANGAR:
      case BelugaActionType.GET_FROM_HANGAR:
        return "warehouse";
    }
  })

  actionMoveIcon = computed(() => {
    switch (this.action().name){
      case BelugaActionType.UNLOAD_BELUGA:
      case BelugaActionType.DELIVER_TO_HANGAR:
        return "arrow_forward"
      case BelugaActionType.LOAD_BELUGA:
      case BelugaActionType.GET_FROM_HANGAR:
        return "arrow_back"
      case BelugaActionType.SWITCH_TO_NEXT_BELUGA:
        return "swap_horiz"
      case BelugaActionType.PUT_DOWN_RACK:
        return PutDownRackZ.parse(this.action()).s === 'bside' ?
          "arrow_forward" : "arrow_back"
      case BelugaActionType.PICK_UP_RACK:
        return PickUpRackZ.parse(this.action()).s === 'bside' ?
          "arrow_back" : "arrow_forward"
    }
  })

  actionColor= new Map<BelugaActionType, string>([
    [BelugaActionType.UNLOAD_BELUGA, "oklch(90.1% 0.076 70.697)"],
    [BelugaActionType.LOAD_BELUGA, "oklch(90.1% 0.076 70.697)"],
    [BelugaActionType.PUT_DOWN_RACK, "oklch(88.2% 0.059 254.128)"],
    [BelugaActionType.PICK_UP_RACK, "oklch(88.2% 0.059 254.128)"],
    [BelugaActionType.DELIVER_TO_HANGAR, "oklch(92.5% 0.084 155.995)"],
    [BelugaActionType.GET_FROM_HANGAR, "oklch(92.5% 0.084 155.995)"],
    [BelugaActionType.SWITCH_TO_NEXT_BELUGA, "oklch(0.8 0.1135 22.24)"],
  ]);

  onEnter(){
    this.hovered.emit(true);
  }

  onLeave(){
    this.hovered.emit(false);

  }

  onSelect(){
    this.selected.emit();
  }

}
