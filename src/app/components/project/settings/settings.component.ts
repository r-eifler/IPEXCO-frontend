import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { ExecutionSettings } from "src/app/interface/settings/execution-settings";
import { Project } from "src/app/interface/project";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();

  settingsForm: FormGroup;

  @Input() name: string;
  @Input() settings: ExecutionSettings;

  @Output() updatedSettings = new EventEmitter<ExecutionSettings>();

  constructor() {
    this.settingsForm = new FormGroup({
      maxRuns: new FormControl([
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      allowQuestions: new FormControl(),
      provideRelaxationExplanations: new FormControl(),
      maxQuestionSize: new FormControl([
        Validators.required,
        Validators.min(1),
        Validators.max(3),
      ]),
      introTask: new FormControl(),
      public: new FormControl(),
      usePlanPropertyValues: new FormControl(),
      useTimer: new FormControl(),
      measureTime: new FormControl(),
      maxTime: new FormControl([
        Validators.required,
        Validators.min(0.05),
        Validators.max(60),
      ]),
      checkMaxUtility: new FormControl(),
      computePlanAutomatically: new FormControl(),
      computeDependenciesAutomatically: new FormControl(),
    });
  }

  ngOnInit(): void {
    console.log(this.settings);
    this.initForm();
  }

  initForm(): void {
    this.settingsForm.controls.maxRuns.setValue(this.settings.maxRuns);
    this.settingsForm.controls.allowQuestions.setValue(
      this.settings.allowQuestions
    );
    this.settingsForm.controls.provideRelaxationExplanations.setValue(
      this.settings.provideRelaxationExplanations
    );
    this.settingsForm.controls.maxQuestionSize.setValue(
      this.settings.maxQuestionSize
    );
    this.settingsForm.controls.introTask.setValue(this.settings.introTask);
    this.settingsForm.controls.public.setValue(this.settings.public);
    this.settingsForm.controls.usePlanPropertyValues.setValue(
      this.settings.usePlanPropertyValues
    );
    this.settingsForm.controls.useTimer.setValue(this.settings.useTimer);
    this.settingsForm.controls.measureTime.setValue(this.settings.measureTime);
    this.settingsForm.controls.maxTime.setValue(this.settings.maxTime);
    this.settingsForm.controls.checkMaxUtility.setValue(
      this.settings.checkMaxUtility
    );
    this.settingsForm.controls.computePlanAutomatically.setValue(
      this.settings.computePlanAutomatically
    );
    this.settingsForm.controls.computeDependenciesAutomatically.setValue(
      this.settings.computeDependenciesAutomatically
    );

    this.settingsForm.controls.maxQuestionSize.enable();
  }

  onSave() {
    this.settings.public = this.settingsForm.controls.public.value;
    this.settings.maxRuns = parseInt(this.settingsForm.controls.maxRuns.value);
    this.settings.allowQuestions =
      this.settingsForm.controls.allowQuestions.value;
    this.settings.provideRelaxationExplanations =
      this.settingsForm.controls.provideRelaxationExplanations.value;
    this.settings.maxQuestionSize =
      +this.settingsForm.controls.maxQuestionSize.value;
    this.settings.introTask = this.settingsForm.controls.introTask.value;
    this.settings.usePlanPropertyValues =
      this.settingsForm.controls.usePlanPropertyValues.value;
    this.settings.useTimer = this.settingsForm.controls.useTimer.value;
    this.settings.measureTime = this.settingsForm.controls.measureTime.value;
    this.settings.maxTime = this.settingsForm.controls.maxTime.value * 60000;
    this.settings.computePlanAutomatically =
      this.settingsForm.controls.computePlanAutomatically.value;
    this.settings.computeDependenciesAutomatically =
      this.settingsForm.controls.computeDependenciesAutomatically.value;

    this.updatedSettings.next(this.settings);
  }
}
