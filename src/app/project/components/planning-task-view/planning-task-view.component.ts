import {
  PlanningTask,
  predicateToString,
  FactToString,
  PlanningModel,
  PDDLFact,
} from "src/app/shared/domain/planning-task";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { selectProjectPlanningTask } from "src/app/project/state/project.selector";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { CompleteActionComponent } from "../complete-action/complete-action.component";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";

@Component({
  selector: "app-planning-task-view",
  standalone: true,
  imports: [
    MatListModule,
    MatExpansionModule,
    CompleteActionComponent,
    AsyncPipe,
    NgIf,
    NgFor,
  ],
  templateUrl: "./planning-task-view.component.html",
  styleUrls: ["./planning-task-view.component.scss"],
})
export class PlanningTaskViewComponent implements OnInit {

  domain_name$: Observable<string>
  planning_model$: Observable<PlanningModel>

  constructor(store: Store) {

    this.domain_name$ = store.select(selectProjectPlanningTask).pipe(map(pt => pt?.domain_name));
    this.planning_model$ = store.select(selectProjectPlanningTask).pipe(map(pt => pt?.model));

  }

  ngOnInit(): void {}

  predicatOut = predicateToString;
  factOut = FactToString;
}
