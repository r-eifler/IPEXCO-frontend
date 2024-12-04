import {  Router, RouterLink } from "@angular/router";
import { Component, inject, } from "@angular/core";
import { Demo } from "src/app/demo/domain/demo";
import { MatDialog } from "@angular/material/dialog";
import { AskDeleteComponent } from "../../../shared/components/ask-delete/ask-delete.component";
import { RunStatus } from "src/app/iterative_planning/domain/run";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AsyncPipe } from "@angular/common";
import { Store } from "@ngrx/store";
import { selectProject, selectProjectFinishedDemos, selectProjectRunningDemos } from "src/app/project/state/project.selector";
import { deleteProjectDemo } from "src/app/project/state/project.actions";
import { PageModule } from "src/app/shared/components/page/page.module";
import { BreadcrumbModule } from "src/app/shared/components/breadcrumb/breadcrumb.module";
import { ActionCardModule } from "src/app/shared/components/action-card/action-card.module";

@Component({
  selector: "app-demo-selection",
  standalone: true,
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
  ],
  templateUrl: "./demo-collection.component.html",
  styleUrls: ["./demo-collection.component.scss"],
})
export class DemoCollectionComponent{

  runStatus = RunStatus;

  store = inject(Store);

  project$ = this.store.select(selectProject)
  demosFinished$ = this.store.select(selectProjectFinishedDemos);
  demosRunning$ = this.store.select(selectProjectRunningDemos);
  router = inject(Router);
  dialog = inject(MatDialog);

  openDeleteDialog(demo: Demo): void {
    const dialogRef = this.dialog.open(AskDeleteComponent, {
      data: {name: "Delete Demo", text: "Are you sure you want to delete demo: " + demo.name + "?"},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        this.store.dispatch(deleteProjectDemo({id: demo._id}))
      }
    });
  }

  createNewDemo() {
    
  }

  openDemo(demo: Demo): void {

    // this.router.navigate(["../demos/" + demo._id], {
    //   relativeTo: this.activatedRoute,
    // });
  }

  // openSettings(demo: Demo): void {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.width = "1000px";
  //   dialogConfig.height = "750px";
  //   dialogConfig.data = {
  //     demo: demo, 
  //     name: demo.name 
  //   };

  //   const dialogRef = this.dialog.open(DemoSettingsComponent, dialogConfig);
  // }

  // openDemoInfo(demo: Demo) {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.width = "1000px";
  //   dialogConfig.height = "750px";
  //   dialogConfig.data = {
  //     demo,
  //   };

  //   const dialogRef = this.dialog.open(DemoInfoComponent, dialogConfig);
  // }

}
