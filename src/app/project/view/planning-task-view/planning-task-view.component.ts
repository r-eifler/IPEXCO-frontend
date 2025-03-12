
import { AsyncPipe, NgFor } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import { selectProject, selectProjectPlanningTask } from "src/app/project/state/project.selector";
import { PageModule } from "src/app/shared/components/page/page.module";
import { BreadcrumbModule } from "../../../shared/components/breadcrumb/breadcrumb.module";
import { CompleteActionComponent } from "../../components/complete-action/complete-action.component";
import { FactToString, predicateToString } from "src/app/shared/domain/PDDL_task";

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
  planning_model$ = this.store.select(selectProjectPlanningTask).pipe(map(pt => pt?.model));


  predicatOut = predicateToString;
  factOut = FactToString;
}
