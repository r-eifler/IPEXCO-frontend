import { Component, inject } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router, RouterLink, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectProject, selectProjectDemoComputationPending } from "../../state/project.selector";
import { MatCardModule } from "@angular/material/card";
import { AsyncPipe } from "@angular/common";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { ProjectActionCardComponent } from "../project-action-card/project-action-card.component";
import { MatButtonModule } from "@angular/material/button";
import { DemoCreatorComponent } from "src/app/project/view/demo-creator/demo-creator.component";
import { PageModule } from "src/app/shared/components/page/page.module";
import { ActionCardModule } from "src/app/shared/components/action-card/action-card.module";
import { BreadcrumbModule } from "src/app/shared/components/breadcrumb/breadcrumb.module";

@Component({
  selector: "app-project-overview",
  standalone: true,
  imports: [
    PageModule, 
    AsyncPipe, 
    ActionCardModule, 
    MatIconModule,
    RouterLink, 
    BreadcrumbModule,
    MatCardModule,
    MatIcon,
    AsyncPipe,
    ProjectActionCardComponent,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: "./project-overview.component.html",
  styleUrls: ["./project-overview.component.scss"],
})
export class ProjectOverviewComponent {

  store = inject(Store)

  router = inject(Router);
  dialog = inject(MatDialog);

  project$ = this.store.select(selectProject);
  demoComputationRunning = this.store.select(selectProjectDemoComputationPending);

  createDemo(): void {
    this.dialog.open(DemoCreatorComponent);
  }

  deleteProject(): void {
    // this.projectsService.deleteObject(this.currentProject);
    this.router.navigate(['/projects']);
  }

}
