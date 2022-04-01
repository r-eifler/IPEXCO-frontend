import { NewIterationStepService } from './../../../../service/planner-runs/selected-iteration-step.service';
import { PlannerService } from 'src/app/service/planner-runs/planner.service';
import { ModIterationStep } from '../../../../interface/run';
import { PlanProperty } from 'src/app/interface/plan-property/plan-property';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { PlanPropertyMapService } from 'src/app/service/plan-properties/plan-property-services';
import { SelectedIterationStepService } from '../../../../service/planner-runs/selected-iteration-step.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { IterationStep } from 'src/app/interface/run';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-hard-goal-selector',
  templateUrl: './hard-goal-selector.component.html',
  styleUrls: ['./hard-goal-selector.component.css']
})
export class HardGoalSelectorComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject();

  step$  : BehaviorSubject<ModIterationStep>;
  planPropertiesMap$: BehaviorSubject<Map<string, PlanProperty>>;

  possiblePP$: Observable<PlanProperty[]>;
  hardGoals$: Observable<PlanProperty[]>;

  constructor(
    private newIterationStepService: NewIterationStepService,
    private planpropertiesService: PlanPropertyMapService,
    private plannerService: PlannerService,
  ) {
    this.step$ = newIterationStepService.getSelectedObject();
    this.planPropertiesMap$ = planpropertiesService.getMap();

    this.possiblePP$ = combineLatest([this.step$, this.planPropertiesMap$])
      .pipe(
        filter(([step, properties]) => !!step && properties && properties.size > 0),
        map(([step, properties]) => {
          const props = [];
          for (let property of properties.values()) {
            if (property.isUsed && !step.hardGoals.includes(property._id))
              props.push(property);
          }

          return props
        })
      )
      .pipe(takeUntil(this.unsubscribe$));

      this.hardGoals$ = combineLatest([this.step$, this.planPropertiesMap$]).pipe(
        filter(([step, planProperties]) => !!step && planProperties && planProperties.size > 0),
        map(([step, planProperties]) => step.hardGoals.map(pp_id => planProperties.get(pp_id))),
        map(hardGoals => hardGoals.sort((a,b) => a.globalHardGoal ? -1 : 0 )),
      );
  }

  ngOnInit() {
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  selectPP(pp: PlanProperty) {
    this.step$.pipe(take(1)).subscribe(
      step => {
        step.hardGoals.push(pp._id);
        this.newIterationStepService.saveObject(step);
        console.log("new PP added");
      });
  }

  deselectPP(pp: PlanProperty) {
    this.step$.pipe(take(1)).subscribe(
      step => {
        step.hardGoals = step.hardGoals.filter(hg => hg != pp._id);
        this.newIterationStepService.saveObject(step);
        console.log("PP removed");
      });
  }

}
