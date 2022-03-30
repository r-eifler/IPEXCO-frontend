import { PlanPropertyMapService } from './../../../service/plan-properties/plan-property-services';
import { HardGoalSelectorComponent } from './../planning-step/hard-goal-selector/hard-goal-selector.component';
import { map, filter, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { PlanProperty } from 'src/app/interface/plan-property/plan-property';
import { IterationStep, ModIterationStep } from 'src/app/interface/run';
import { SelectedIterationStepService } from 'src/app/service/planner-runs/selected-iteration-step.service';

interface ModHardGoal {
  planProperty: PlanProperty,
  added: boolean;
  removed: boolean;
}

@Component({
  selector: 'app-selected-hard-goals',
  templateUrl: './selected-hard-goals.component.html',
  styleUrls: ['./selected-hard-goals.component.scss']
})
export class SelectedHardGoalsComponent implements OnInit {

  step$: BehaviorSubject<IterationStep>;
  planProperties$: BehaviorSubject<Map<string,PlanProperty>>;

  hardGoals$: Observable<ModHardGoal[]>;

  constructor(
    private selectedIterationStepService: SelectedIterationStepService,
    private planPropertiesMapService: PlanPropertyMapService
  ) {

    this.step$ = selectedIterationStepService.findSelectedObject();
    this.planProperties$ = planPropertiesMapService.getMap();

    this.hardGoals$ = combineLatest([this.step$, this.planProperties$]).pipe(
      filter(([step, planProperties]) => !!step && planProperties && planProperties.size > 0),
      map(([step, planProperties]) => step.getAllHardGoals().map(pp_id =>
        {return {planProperty: planProperties.get(pp_id), added: step.hasBeenAdded(pp_id), removed: step.hasBeenRemoved(pp_id)}})),
      map(hardGoals => hardGoals.sort((a,b) => a.planProperty.globalHardGoal ? -1 : 0 )),
    );
  }

  ngOnInit(): void {
  }

  deselectPP(pp: PlanProperty) {
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
