import {
  PlanningTask,
  predicateToString,
  FactToString,
} from "src/app/interface/plannig-task";
import { Project } from "src/app/interface/project";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { Subject, BehaviorSubject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-planning-task-view",
  templateUrl: "./planning-task-view.component.html",
  styleUrls: ["./planning-task-view.component.scss"],
})
export class PlanningTaskViewComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();

  project$: BehaviorSubject<Project>;

  constructor(private projectsService: CurrentProjectService) {
    this.project$ = projectsService.findSelectedObject();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  predicatOut = predicateToString;
  factOut = FactToString;
}
