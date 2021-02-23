import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Demo} from 'src/app/interface/demo';
import {ExecutionSettingsService} from '../../../service/settings/execution-settings.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TimeLoggerService} from '../../../service/logger/time-logger.service';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-demo-finished',
  templateUrl: './demo-finished.component.html',
  styleUrls: ['./demo-finished.component.css']
})
export class DemoFinishedComponent implements OnInit, OnDestroy {

  private loggerId: number;
  private ngUnsubscribe: Subject<any> = new Subject();

  demo: Demo;
  timesUp = false;
  maxAchievedUtility: number;
  maxUtility: number;
  payment: number;

  constructor(
    private timeLogger: TimeLoggerService,
    public settingsService: ExecutionSettingsService,
    public dialogRef: MatDialogRef<DemoFinishedComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.timesUp = data.timesUp;
    this.maxUtility = data.maxUtility;
    this.maxAchievedUtility = data.maxAchievedUtility;
    this.payment = data.payment;
    this.demo = data.demo;
  }

  async ngOnInit() {
    this.loggerId = this.timeLogger.register('finished-demo');
    this.timeLogger.addInfo(this.loggerId, 'demoId: ' + this.demo._id);
    this.timeLogger.addInfo(this.loggerId, 'max utility: ' + this.maxAchievedUtility);
    const pipe = new CurrencyPipe('en-US', 'GBP');
    this.timeLogger.addInfo(this.loggerId, 'payment: ' + (pipe.transform(this.payment, 'GBP', 'symbol', '1.2-2')));
    this.settingsService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  backToDemoOverview() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.timeLogger.deregister(this.loggerId);
  }

}
