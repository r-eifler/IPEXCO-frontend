import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { GeneralSettings } from "src/app/interface/settings/general-settings";
import { Project } from "src/app/interface/project";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit, OnChanges {
  private ngUnsubscribe: Subject<any> = new Subject();

  settingsForm: UntypedFormGroup;

  @Input() isProject: boolean;
  @Input() settings: GeneralSettings;

  @Output() updatedSettings = new EventEmitter<GeneralSettings>();

  constructor() {
    this.settingsForm = new UntypedFormGroup({
      maxRuns: new UntypedFormControl([
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      allowQuestions: new UntypedFormControl(),
      provideRelaxationExplanations: new UntypedFormControl(),
      introTask: new UntypedFormControl(),
      public: new UntypedFormControl(),
      usePlanPropertyValues: new UntypedFormControl(),
      useConstraints: new UntypedFormControl(),
      useTimer: new UntypedFormControl(),
      measureTime: new UntypedFormControl(),
      maxTime: new UntypedFormControl([
        Validators.required,
        Validators.min(0.05),
        Validators.max(60),
      ]),
      checkMaxUtility: new UntypedFormControl(),
      computePlanAutomatically: new UntypedFormControl(),
      computeDependenciesAutomatically: new UntypedFormControl(),
      showPaymentScore: new UntypedFormControl(),
      minPayment: new UntypedFormControl(),
      maxPayment: new UntypedFormControl(),
      paymentSteps: new UntypedFormControl(),
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.settings);
    if(this.settings)
      this.initForm(this.settings);
  }

  ngOnInit(): void {
    console.log(this.settings);
    if(this.settings)
      this.initForm(this.settings);
  }

  initForm(settings: GeneralSettings): void {
    this.settingsForm.controls.maxRuns.setValue(settings.maxRuns);

    this.settingsForm.controls.allowQuestions.setValue(settings.allowQuestions);
    this.settingsForm.controls.provideRelaxationExplanations.setValue(settings.provideRelaxationExplanations);

    this.settingsForm.controls.introTask.setValue(settings.introTask);
    this.settingsForm.controls.public.setValue(settings.public);

    this.settingsForm.controls.usePlanPropertyValues.setValue(settings.usePlanPropertyValues);
    this.settingsForm.controls.useConstraints.setValue(settings.useConstraints);

    this.settingsForm.controls.useTimer.setValue(settings.useTimer);
    this.settingsForm.controls.measureTime.setValue(settings.measureTime);
    this.settingsForm.controls.maxTime.setValue(settings.maxTime / 6000);

    this.settingsForm.controls.checkMaxUtility.setValue(settings.checkMaxUtility);

    this.settingsForm.controls.computePlanAutomatically.setValue(settings.computePlanAutomatically);
    this.settingsForm.controls.computeDependenciesAutomatically.setValue(settings.computeDependenciesAutomatically);

    this.settingsForm.controls.showPaymentScore.setValue(settings.showPaymentInfo);
    this.settingsForm.controls.minPayment.setValue(settings.paymentInfo.min);
    this.settingsForm.controls.maxPayment.setValue(settings.paymentInfo.max);
    this.settingsForm.controls.paymentSteps.setValue(settings.paymentInfo.steps);
  }

  onSave() {
    this.settings.maxRuns = parseInt(this.settingsForm.controls.maxRuns.value);

    this.settings.allowQuestions =this.settingsForm.controls.allowQuestions.value;
    this.settings.provideRelaxationExplanations =this.settingsForm.controls.provideRelaxationExplanations.value;

    this.settings.introTask = this.settingsForm.controls.introTask.value;
    this.settings.public = this.settingsForm.controls.public.value;

    this.settings.usePlanPropertyValues =this.settingsForm.controls.usePlanPropertyValues.value;
    this.settings.useConstraints =this.settingsForm.controls.useConstraints.value;

    this.settings.useTimer = this.settingsForm.controls.useTimer.value;
    this.settings.measureTime = this.settingsForm.controls.measureTime.value;
    this.settings.maxTime = this.settingsForm.controls.maxTime.value * 60000;

    this.settings.computePlanAutomatically =this.settingsForm.controls.computePlanAutomatically.value;
    this.settings.computeDependenciesAutomatically =this.settingsForm.controls.computeDependenciesAutomatically.value;

    this.settings.checkMaxUtility = this.settingsForm.controls.checkMaxUtility.value;
    this.settings.showPaymentInfo = this.settingsForm.controls.showPaymentScore.value;
    this.settings.paymentInfo.max = this.settingsForm.controls.maxPayment.value;
    this.settings.paymentInfo.min = this.settingsForm.controls.minPayment.value;
    this.settings.paymentInfo.steps = this.settingsForm.controls.paymentSteps.value;

    this.updatedSettings.next(this.settings);
  }
}
