import {
  PlanningTask,
  predicateToString,
  FactToString,
  PlanningModel,
  PDDLFact,
} from "src/app/interface/planning-task";
import { Project } from "src/app/interface/project";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { filter, map, tap } from "rxjs/operators";

@Component({
  selector: "app-planning-task-view",
  templateUrl: "./planning-task-view.component.html",
  styleUrls: ["./planning-task-view.component.scss"],
})
export class PlanningTaskViewComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();

  domain_name$: Observable<string>
  planning_model$: Observable<PlanningModel>
  initial_state$: Observable<PDDLFact[]>

  constructor(projectsService: CurrentProjectService) {

    this.domain_name$ = projectsService.findSelectedObject().pipe(map(p => p.baseTask.domain_name));

    this.planning_model$ = projectsService.findSelectedObject().pipe(
      filter(p => p != null),
      map(p => p.baseTask.model),
      filter(m => m != null)
    );

    this.initial_state$ = projectsService.findSelectedObject().pipe(
      filter(p => p != null),
      map(p => p.baseTask.model),
      filter(m => m != null),
      map(m => m.initial)
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  predicatOut = predicateToString;
  factOut = FactToString;
}
