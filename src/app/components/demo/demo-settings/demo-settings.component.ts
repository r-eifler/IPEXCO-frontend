import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {ExecutionSettings} from 'src/app/interface/settings/execution-settings';
import {ExecutionSettingsService} from 'src/app/service/settings/execution-settings.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-demo-settings',
  templateUrl: './demo-settings.component.html',
  styleUrls: ['./demo-settings.component.css']
})
export class DemoSettingsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  demoSettingsForm: FormGroup;

  name: string;
  settings: ExecutionSettings;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<DemoSettingsComponent>,
    private settingsService: ExecutionSettingsService) {

      this.name = data.name;
      this.settings = data.settings;
      if (! this.settings.paymentInfo) {
        this.settings.paymentInfo = {min: 0, max: 0, steps: []};
      }
      if (! this.settings.introTask) {
        this.settings.introTask = false;
      }
      this.demoSettingsForm = new FormGroup({
        maxRuns: new FormControl(this.settings.maxRuns,
          [Validators.required, Validators.min(1), Validators.max(100)]),
        allowQuestions: new FormControl(this.settings.allowQuestions),
        maxQuestionSize: new FormControl(
           this.settings.maxQuestionSize.toString(),
          [Validators.required, Validators.min(1), Validators.max(3)]),
        public: new FormControl(this.settings.public),
        introTask: new FormControl(this.settings.introTask),
        usePlanPropertyValues: new FormControl(this.settings.usePlanPropertyValues),
        useTimer: new FormControl(this.settings.useTimer),
        measureTime: new FormControl(this.settings.measureTime),
        maxTime: new FormControl(this.settings.maxTime / 60000,
          [ Validators.required, Validators.min(0.05), Validators.max(60) ]),
        checkMaxUtility: new FormControl(this.settings.checkMaxUtility),
        showAnimation: new FormControl(this.settings.showAnimation),
        minPayment: new FormControl(
          this.settings.paymentInfo?.min,
          [Validators.required, Validators.min(0), Validators.max(100)]),
        maxPayment: new FormControl(
          this.settings.paymentInfo?.max,
          [Validators.required, Validators.min(0), Validators.max(100)]),
        paymentSteps: new FormControl(this.settings.paymentInfo?.steps.join(',')),
      });

      this.demoSettingsForm.controls.maxQuestionSize.enable();
    }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSave() {
    this.settings.maxRuns = this.demoSettingsForm.controls.maxRuns.value;
    this.settings.allowQuestions = this.demoSettingsForm.controls.allowQuestions.value;
    this.settings.maxQuestionSize = +this.demoSettingsForm.controls.maxQuestionSize.value;
    this.settings.public = this.demoSettingsForm.controls.public.value;
    this.settings.introTask = this.demoSettingsForm.controls.introTask.value;
    this.settings.usePlanPropertyValues = this.demoSettingsForm.controls.usePlanPropertyValues.value;
    this.settings.useTimer = this.demoSettingsForm.controls.useTimer.value;
    this.settings.measureTime = this.demoSettingsForm.controls.measureTime.value;
    this.settings.maxTime = this.demoSettingsForm.controls.maxTime.value * 60000;
    this.settings.checkMaxUtility = this.demoSettingsForm.controls.checkMaxUtility.value;
    this.settings.showAnimation = this.demoSettingsForm.controls.showAnimation.value;
    this.settings.paymentInfo.min = this.demoSettingsForm.controls.minPayment.value;
    this.settings.paymentInfo.max = this.demoSettingsForm.controls.maxPayment.value;
    this.settings.paymentInfo.steps = this.demoSettingsForm.controls.paymentSteps.value.split(',').map(s => s as number);

    this.settingsService.updateSettings(this.settings);

    this.bottomSheetRef.dismiss();
  }

}
