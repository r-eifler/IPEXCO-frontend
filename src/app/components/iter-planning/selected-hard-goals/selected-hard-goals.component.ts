import { PlanPropertyMapService } from './../../../service/plan-properties/plan-property-services';
import { HardGoalSelectorComponent } from './../planning-step/hard-goal-selector/hard-goal-selector.component';
import { map, filter, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
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

  step$: BehaviorSubject<IterationStep>;
  planProperties$: BehaviorSubject<Map<string,PlanProperty>>;

  hardGoals$: Observable<PlanProperty[]>;

  constructor(
    private selectedIterationStepService: SelectedIterationStepService,
    private planPropertiesMapService: PlanPropertyMapService
  ) {

    this.step$ = selectedIterationStepService.findSelectedObject();
    this.planProperties$ = planPropertiesMapService.getMap();

    this.hardGoals$ = combineLatest([this.step$, this.planProperties$]).pipe(
      filter(([step, planProperties]) => !!step && planProperties && planProperties.size > 0),
      map(([step, planProperties]) => step.hardGoals.map(h => planProperties.get(h))),
      map(hardGoals => hardGoals.sort((a,b) => a.globalHardGoal ? -1 : 0 )),
    );
  }

  ngOnInit(): void {
  }

  deselectPP(pp: PlanProperty) {
    console.log(pp);
    let currentStep = this.step$.getValue();
    if(currentStep.canBeModified()){
      currentStep.hardGoals = currentStep.hardGoals.filter(p => p !== pp._id);
      this.selectedIterationStepService.saveObject(currentStep);
    }
    else {
      let modStep = new ModIterationStep('Next Step', currentStep)
      modStep.hardGoals = modStep.hardGoals.filter(p => p !== pp._id)
      this.selectedIterationStepService.saveObject(modStep);
    }
  }

}
