import { UserStudyCurrentDataService } from './../../../service/user-study/user-study-data.service';
import { GeneralSettings } from 'src/app/interface/settings/general-settings';
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Demo } from "src/app/interface/demo";
import { Subject } from "rxjs";
import { filter, take } from "rxjs/operators";
import { LogEvent, TimeLoggerService } from "../../../service/logger/time-logger.service";


@Component({
  selector: "app-demo-finished",
  templateUrl: "./demo-finished.component.html",
  styleUrls: ["./demo-finished.component.css"],
})
export class DemoFinishedComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();

  demo: Demo;
  timesUp = false;
  maxAchievedUtility: number;
  maxUtility: number;
  payment: number;

  settings: GeneralSettings;

  constructor(
    private timeLogger: TimeLoggerService,
    private userStudyCurrentDataService: UserStudyCurrentDataService,
    public dialogRef: MatDialogRef<DemoFinishedComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.timesUp = data.timesUp;
    this.maxUtility = data.maxUtility;
    this.maxAchievedUtility = data.maxAchievedUtility;
    this.payment = data.payment;
    this.demo = data.demo;

    this.settings = this.demo.settings
  }

  async ngOnInit() {
    console.log("Init demo finished ...")

    this.userStudyCurrentDataService.getSelectedObject()
      .pipe(filter(d => !!d), take(1))
      .subscribe(d => {
        d.payment = this.payment;
        this.userStudyCurrentDataService.updateObject(d);
      })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  continueDemo(){
    this.dialogRef.close(false)
  }

  finishDemo(){
    this.timeLogger.log(LogEvent.END_DEMO,
      {
        demoId: this.demo._id,
        max_utility: this.maxAchievedUtility,
        payment: this.payment
    });

    this.dialogRef.close(true)
  }
}
