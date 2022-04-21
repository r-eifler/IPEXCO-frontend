import { NewIterationStepService } from './../../../../service/planner-runs/selected-iteration-step.service';
import { PlanPropertyMapService } from '../../../../service/plan-properties/plan-property-services';
import { HardGoalSelectorComponent } from '../hard-goal-selector/hard-goal-selector.component';
import { map, filter, tap } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { PlanProperty } from 'src/app/interface/plan-property/plan-property';
import { IterationStep, ModIterationStep } from 'src/app/interface/run';
import { SelectedIterationStepService } from 'src/app/service/planner-runs/selected-iteration-step.service';


@Component({
  selector: 'app-selected-hard-goals',
  templateUrl: './selected-hard-goals.component.html',
  styleUrls: ['./selected-hard-goals.component.scss']
})
export class SelectedHardGoalsComponent implements OnInit {

  @Input()
  set step(step : IterationStep){
    this.step$.next(step);
  }

  planProperties$: BehaviorSubject<Map<string,PlanProperty>>;
  private step$ = new BehaviorSubject<IterationStep>(null);

  hardGoals$: Observable<PlanProperty[]>;

  constructor(
    private planPropertiesMapService: PlanPropertyMapService
  ) {

    this.planProperties$ = this.planPropertiesMapService.getMap();

    this.hardGoals$ = combineLatest([this.step$, this.planProperties$]).pipe(
      filter(([step, planProperties]) => !!step && planProperties && planProperties.size > 0),
      map(([step, planProperties]) => step.hardGoals.map(pp_id => planProperties.get(pp_id))),
      map(hardGoals => hardGoals.sort((a,b) => a.globalHardGoal ? -1 : 0 )),
    );
  }

  ngOnInit(): void {
  }

}
