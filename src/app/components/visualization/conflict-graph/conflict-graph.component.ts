import { SelectedIterationStepService } from 'src/app/service/planner-runs/selected-iteration-step.service';
import { PPDependencies } from 'src/app/interface/explanations';
import { OnDestroy } from '@angular/core';
import { PlanProperty } from 'src/app/interface/plan-property/plan-property';
import { Observable, Subject } from 'rxjs';
import { PlanPropertyMapService } from 'src/app/service/plan-properties/plan-property-services';
import { RunningDemoService } from 'src/app/service/demo/demo-services';
import { Component, OnInit } from '@angular/core';
import { Demo } from 'src/app/interface/demo';
import { filter, map, takeUntil } from 'rxjs/operators';
import { getAllDependencies, IterationStep } from 'src/app/interface/run';
import * as d3 from 'd3';


@Component({
  selector: 'app-conflict-graph',
  templateUrl: './conflict-graph.component.html',
  styleUrls: ['./conflict-graph.component.scss']
})
export class ConflictGraphComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject();


  /*
    Stores the general information about the planning task
    The baseTask field stores the planning task.
    One can use it to acess all objects present in the planning task
  */
  demo$: Observable<Demo>;

  /*
    The current selected set. Stores the currently enforced planproperties as
    "hard goals"
  */
  selectedStep$: Observable<IterationStep>

  /*
    MUGS/goal conflicts
    Given by lists of planProperty ids
  */
  conflicts$:  Observable<PPDependencies>;

  /*
    Map of planproperty id to plan property objects
    Those are the elemets of the MUGS/conflicts.
    All mentinoed property have default values which can be changed in the
    properties overview in the project
    They contain:
      - naturalLanguageDescription: a natural language sentence describing the property
      - class: name of the class the property is group into
      - color: hex value
      - icon: mat icon name
    All of these properties can be modified in the demo collection -> Menue --> Modify --> PlanProperties

    There is currently no easy why to access all object conatined in a plan
    property. The only possibility is to parse the formula itself.
    TODO: add fieled storing all objects selected during the creation of the plan property.
  */
  planProperties$: Observable<Map<string,PlanProperty>>;

  constructor(
    demoService: RunningDemoService,
    planPropertiesService: PlanPropertyMapService,
    stepService: SelectedIterationStepService,
  ) {

    // Access the data over these observables
    // If you subscribe to one, please add takeUntil(this.unsubscribe$) in the pipe
    this.demo$ = demoService.getSelectedObject();
    this.selectedStep$ = stepService.getSelectedObject();
    this.conflicts$ = this.selectedStep$.pipe(
      takeUntil(this.unsubscribe$),
      filter(step => !!step),
      map(step => getAllDependencies(step))
    );
    this.planProperties$ = planPropertiesService.getMap();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
