import { UserStudyCurrentDataService } from '../../../user_study/service/user-study-data.service';
import { Component, Inject, OnInit } from "@angular/core";
import { Demo } from "src/app/interface/demo";
import { filter, take } from "rxjs/operators";
import { LogEvent, TimeLoggerService } from "../../../service/logger/time-logger.service";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeneralSettings } from 'src/app/project/domain/general-settings';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: "app-demo-finished",
  standalone: true,
  imports: [
    CurrencyPipe,
  ],
  templateUrl: "./demo-finished.component.html",
  styleUrls: ["./demo-finished.component.css"],
})
export class DemoFinishedComponent implements OnInit {

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

    // this.userStudyCurrentDataService.getSelectedObject()
    //   .pipe(filter(d => !!d), take(1))
    //   .subscribe(d => {
    //     d.payment = this.payment;
    //     this.userStudyCurrentDataService.updateObject(d);
    //   })
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
