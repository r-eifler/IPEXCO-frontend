import {
  PlanningTask,
  predicateToString,
  FactToString,
  PlanningModel,
  PDDLFact,
} from "src/app/interface/planning-task";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { selectProjectPlanningTask } from "src/app/project/state/project.selector";

@Component({
  selector: "app-planning-task-view",
  templateUrl: "./planning-task-view.component.html",
  styleUrls: ["./planning-task-view.component.scss"],
})
export class PlanningTaskViewComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();

  domain_name$: Observable<string>
  planning_model$: Observable<PlanningModel>

  constructor(store: Store) {

    this.domain_name$ = store.select(selectProjectPlanningTask).pipe(map(pt => pt?.domain_name));
    this.planning_model$ = store.select(selectProjectPlanningTask).pipe(map(pt => pt?.model));

  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  predicatOut = predicateToString;
  factOut = FactToString;
}
