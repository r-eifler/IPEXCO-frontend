import { Component, inject } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, Router, RouterLink, RouterModule } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { selectProject, selectProjectDemoComputationPending } from "../../state/project.selector";
import { PageModule } from "src/app/shared/components/page/page.module";
import { ActionCardModule } from "src/app/shared/components/action-card/action-card.module";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { BreadcrumbModule } from "src/app/shared/components/breadcrumb/breadcrumb.module";
import { MatCardModule } from "@angular/material/card";
import { AsyncPipe } from "@angular/common";
import { ProjectActionCardComponent } from "../../components/project-action-card/project-action-card.component";
import { MatButtonModule } from "@angular/material/button";
import { PlanningTaskViewComponent } from "../planning-task-view/planning-task-view.component";

@Component({
    selector: "app-project-base",
    imports: [
        PageModule,
        MatIconModule,
        RouterLink,
        BreadcrumbModule,
        ActionCardModule,
        MatCardModule,
        MatIcon,
        AsyncPipe,
        ProjectActionCardComponent,
        MatButtonModule,
        RouterModule,
        MatTabsModule,
    ],
    templateUrl: "./project-base.component.html",
    styleUrls: ["./project-base.component.scss"]
})
export class ProjectBaseComponent {

  store = inject(Store)

  router = inject(Router);
  route = inject(ActivatedRoute);

  dialog = inject(MatDialog);

  project$ = this.store.select(selectProject);
  demoComputationRunning = this.store.select(selectProjectDemoComputationPending);

  onPlanningTask(): void {
    this.router.navigate(['planning-task'], {relativeTo: this.route.parent});
  }

  onDemos(): void {
    this.router.navigate(['demos'], {relativeTo: this.route.parent});
  }

  onSettings(): void {
    this.router.navigate(['settings'], {relativeTo: this.route.parent});
  }

  deleteProject(): void {
    // this.projectsService.deleteObject(this.currentProject);
    this.router.navigate(['/projects']);
  }


}
