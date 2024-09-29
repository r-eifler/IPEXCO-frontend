import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ExplanationInterfaceType, GeneralSettings } from "src/app/interface/settings/general-settings";


@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit, OnChanges {

  settingsForm: UntypedFormGroup;

  @Input() isProject: boolean;
  @Input() settings: GeneralSettings;

  @Output() updatedSettings = new EventEmitter<GeneralSettings>();

  ExplanationTypes = ExplanationInterfaceType;

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
      explanationInterface: new UntypedFormControl(),
      globalExplanation: new UntypedFormControl(),
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

    this.settingsForm.controls.explanationInterface.setValue(settings.explanationInterface);
    this.settingsForm.controls.globalExplanation.setValue(settings.globalExplanation);

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

    let paymentInfo = {
      max: this.settingsForm.controls.maxPayment.value,
      min: this.settingsForm.controls.minPayment.value,
      steps: this.settingsForm.controls.paymentSteps.value,
    }
     
    let newSettings: GeneralSettings = {
      _id: undefined,
      maxRuns: parseInt(this.settingsForm.controls.maxRuns.value),  
      allowQuestions: this.settingsForm.controls.allowQuestions.value,
      provideRelaxationExplanations: this.settingsForm.controls.provideRelaxationExplanations.value,
      introTask:  this.settingsForm.controls.introTask.value,
      public: this.settingsForm.controls.public.value,
      usePlanPropertyValues: this.settingsForm.controls.usePlanPropertyValues.value,
      useConstraints: this.settingsForm.controls.useConstraints.value,
      explanationInterface: this.settingsForm.controls.explanationInterface.value,
      globalExplanation: this.settingsForm.controls.globalExplanation.value,
      useTimer: this.settingsForm.controls.useTimer.value,
      measureTime: this.settingsForm.controls.measureTime.value,
      maxTime: this.settingsForm.controls.maxTime.value * 60000,
      computePlanAutomatically: this.settingsForm.controls.computePlanAutomatically.value,
      computeDependenciesAutomatically: this.settingsForm.controls.computeDependenciesAutomatically.value,
      checkMaxUtility: this.settingsForm.controls.checkMaxUtility.value,
      showPaymentInfo: this.settingsForm.controls.showPaymentScore.value,
      paymentInfo,
      showAnimation: false
    }

    console.log(newSettings);
    this.updatedSettings.next(newSettings);
  }
}
