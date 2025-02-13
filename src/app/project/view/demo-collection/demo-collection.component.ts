import { AsyncPipe } from "@angular/common";
import { Component, inject, } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { RunStatus } from "src/app/iterative_planning/domain/run";
import { DemoCardComponent } from "src/app/project/components/demo-card/demo-card.component";
import { deleteProjectDemo } from "src/app/project/state/project.actions";
import { selectHasRunningDemoComputations, selectProject, selectProjectDemoProperties, selectProjectFinishedDemos, selectProjectRunningDemos } from "src/app/project/state/project.selector";
import { DemoCreatorComponent } from "src/app/project/view/demo-creator/demo-creator.component";
import { ActionCardModule } from "src/app/shared/components/action-card/action-card.module";
import { BreadcrumbModule } from "src/app/shared/components/breadcrumb/breadcrumb.module";
import { PageModule } from "src/app/shared/components/page/page.module";
import { AskDeleteComponent } from "../../../shared/components/ask-delete/ask-delete.component";
import { DemoCardRunningComponent } from "../../components/demo-card-running/demo-card-running.component";
import { Demo } from "src/app/shared/domain/demo";

@Component({
    selector: "app-demo-selection",
    imports: [
        PageModule,
        MatIconModule,
        RouterLink,
        BreadcrumbModule,
        ActionCardModule,
        MatIconModule,
        MatMenuModule,
        MatCardModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        AsyncPipe,
        DemoCardComponent,
        DemoCardRunningComponent
    ],
    templateUrl: "./demo-collection.component.html",
    styleUrls: ["./demo-collection.component.scss"]
})
export class DemoCollectionComponent{

  runStatus = RunStatus;

  store = inject(Store);

  project$ = this.store.select(selectProject)
  demosFinished$ = this.store.select(selectProjectFinishedDemos);
  demosRunning$ = this.store.select(selectProjectRunningDemos);
  demoComputationsRunning$ = this.store.select(selectHasRunningDemoComputations);
  demoProperties$ = this.store.select(selectProjectDemoProperties);

  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);

  openDeleteDialog(demo: Demo): void {
    const dialogRef = this.dialog.open(AskDeleteComponent, {
      data: {name: "Delete Demo", text: "Are you sure you want to delete demo: " + demo.name + "?"},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.store.dispatch(deleteProjectDemo({id: demo._id}))
      }
    });
  }

  createNewDemo() {
    this.dialog.open(DemoCreatorComponent);
  }

  onRunIterPlanning(id: string){
    this.router.navigate(['/iterative-planning', id]);
  }


}
