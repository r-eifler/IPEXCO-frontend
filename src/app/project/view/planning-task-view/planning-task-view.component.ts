import {
  PlanningTask,
  predicateToString,
  FactToString,
  PlanningModel,
  PDDLFact,
} from "src/app/shared/domain/planning-task";
import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { selectProject, selectProjectPlanningTask } from "src/app/project/state/project.selector";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { CompleteActionComponent } from "../../components/complete-action/complete-action.component";
import { PageModule } from "src/app/shared/components/page/page.module";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { BreadcrumbModule } from "../../../shared/components/breadcrumb/breadcrumb.module";
import { BreadcrumbItemComponent } from "../../../shared/components/breadcrumb/breadcrumb-item/breadcrumb-item.component";

@Component({
    selector: "app-planning-task-view",
    imports: [
        PageModule,
        BreadcrumbModule,
        RouterLink,
        MatListModule,
        MatExpansionModule,
        CompleteActionComponent,
        AsyncPipe,
        NgFor,
        MatIconModule,
    ],
    templateUrl: "./planning-task-view.component.html",
    styleUrls: ["./planning-task-view.component.scss"]
})
export class PlanningTaskViewComponent {

  store = inject(Store);

  project$ = this.store.select(selectProject);
  domain_name$ = this.store.select(selectProjectPlanningTask).pipe(map(pt => pt?.domain_name));
  planning_model$ = this.store.select(selectProjectPlanningTask).pipe(map(pt => pt?.model));


  predicatOut = predicateToString;
  factOut = FactToString;
}
