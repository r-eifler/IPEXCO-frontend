import { DemoSettingsComponent } from "./../demo-settings/demo-settings.component";
import { takeUntil } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { Demo } from "src/app/interface/demo";
import { AuthenticationService } from "../../../user/services/authentication.service";
import { DemoCreatorComponent } from "../../../project/components/demo-creator/demo-creator.component";
import { environment } from "../../../../environments/environment";
import { DemoInfoComponent } from "../demo-info/demo-info.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AskDeleteComponent } from "../../utils/ask-delete/ask-delete.component";
import { RunStatus } from "src/app/iterative_planning/domain/run";
import { MatIconModule } from "@angular/material/icon";
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-demo-selection",
  standalone: true,
  imports: [
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./demo-collection.component.html",
  styleUrls: ["./demo-collection.component.scss"],
})
export class DemoCollectionComponent implements OnInit {
  isMobile: boolean;
  private ngUnsubscribe: Subject<any> = new Subject();
  srcUrl = environment.srcURL;

  runStatus = RunStatus;
  public demos$: Observable<Demo[]>;

  constructor(
    // private demosService: DemosService,
    public userService: AuthenticationService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    // this.demos$ = demosService.getList();
  }

  ngOnInit(): void {

    // this.demosService.findCollection();
  }



  openDeleteDialog(demo: Demo): void {
    const dialogRef = this.dialog.open(AskDeleteComponent, {
      data: {name: "Delete Demo", text: "Are you sure you want to delete demo: " + demo.name + "?"},
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   if(result){
    //     this.demosService.deleteObject(demo)
    //   }
    // });
  }

  async cancelDemo(demo: Demo): Promise<void> {
    // const canceled = await this.demosService.cancelDemo(demo);
    // if (canceled) {
    //   this.snackBar.open("Demo canceled successfully!", "close", {
    //     duration: 2000,
    //   });
    // } else {
    //   this.snackBar.open("Cancel demo failed!", "close", { duration: 2000 });
    // }
  }

  update(demo: Demo): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "1500px";
    dialogConfig.height = "1000px";
    dialogConfig.data = {
      update: true,
      projectId: demo._id,
      demo,
    };

    const dialogRef = this.dialog.open(DemoCreatorComponent, dialogConfig);
  }

  openDemo(demo: Demo): void {

    this.router.navigate(["../demos/" + demo._id], {
      relativeTo: this.activatedRoute,
    });
  }

  openSettings(demo: Demo): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "1000px";
    dialogConfig.height = "750px";
    dialogConfig.data = {
      demo: demo, 
      name: demo.name 
    };

    const dialogRef = this.dialog.open(DemoSettingsComponent, dialogConfig);
  }

  openDemoInfo(demo: Demo) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "1000px";
    dialogConfig.height = "750px";
    dialogConfig.data = {
      demo,
    };

    const dialogRef = this.dialog.open(DemoInfoComponent, dialogConfig);
  }

  myDemo(demo: Demo): boolean {

    // if (this.userService.getUser()) {
    //   return this.userService.getUser()._id === demo.user;
    // }
    return false;
  }
}
