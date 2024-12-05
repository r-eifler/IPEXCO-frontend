import { Component, DestroyRef, effect, EventEmitter, inject, input, Input, OnChanges, OnInit, output, Output, SimpleChanges } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ExplanationInterfaceType, GeneralSettings, PropertyCreationInterfaceType } from "../../domain/general-settings";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { concatMap, switchMap } from "rxjs/operators";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";


@Component({
  selector: "app-settings",
  standalone: true,
  imports: [
    MatLabel,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    NgIf,
  ],
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {

  destroyRef = inject(DestroyRef)
  
  settingsForm: FormGroup;

  settings = input.required<GeneralSettings>();
  isProject = input<boolean>(false);

  update = output<GeneralSettings>();

  ExplanationTypes = ExplanationInterfaceType;
  PropertyCreationTypes = PropertyCreationInterfaceType;

  initialized = false;

  constructor() {
    this.settingsForm = new FormGroup({
      maxRuns: new FormControl([
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      allowQuestions: new FormControl(),
      provideRelaxationExplanations: new FormControl(),
      introTask: new FormControl(),
      public: new FormControl(),
      usePlanPropertyValues: new FormControl(),
      useConstraints: new FormControl(),
      explanationInterfaceType: new FormControl(),
      propertyCreationInterfaceType: new FormControl(),
      globalExplanation: new FormControl(),
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
      showPaymentScore: new FormControl(),
      minPayment: new FormControl(),
      maxPayment: new FormControl(),
      paymentSteps: new FormControl(),
    });

    effect(() => this.initForm(this.settings()))
  }


  initForm(settings: GeneralSettings): void {
    if(!settings){
      return;
    }

    this.settingsForm.controls.maxRuns.setValue(settings.maxRuns);

    this.settingsForm.controls.allowQuestions.setValue(settings.allowQuestions);

    this.settingsForm.controls.introTask.setValue(settings.introTask);
    this.settingsForm.controls.public.setValue(settings.public);

    this.settingsForm.controls.usePlanPropertyValues.setValue(settings.usePlanPropertyUtility);

    this.settingsForm.controls.explanationInterfaceType.setValue(settings.explanationInterfaceType);
    this.settingsForm.controls.propertyCreationInterfaceType.setValue(settings.propertyCreationInterfaceType);
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

    this.settingsForm.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.onSave();
      console.log('Saved')
    });

    this.initialized = true
  }

  onSave() {

    // console.log(this.settingsForm.controls.explanationInterfaceType.value)

    let paymentInfo = {
      max: this.settingsForm.controls.maxPayment.value,
      min: this.settingsForm.controls.minPayment.value,
      steps: this.settingsForm.controls.paymentSteps.value,
    }
     
    let newSettings: GeneralSettings = {
      _id: undefined,
      maxRuns: parseInt(this.settingsForm.controls.maxRuns.value),
      allowQuestions: this.settingsForm.controls.allowQuestions.value,
      introTask: this.settingsForm.controls.introTask.value,
      public: this.settingsForm.controls.public.value,
      usePlanPropertyUtility: this.settingsForm.controls.usePlanPropertyValues.value,
      explanationInterfaceType: this.settingsForm.controls.explanationInterfaceType.value,
      propertyCreationInterfaceType: this.settingsForm.controls.propertyCreationInterfaceType.value,
      globalExplanation: this.settingsForm.controls.globalExplanation.value,
      useTimer: this.settingsForm.controls.useTimer.value,
      measureTime: this.settingsForm.controls.measureTime.value,
      maxTime: this.settingsForm.controls.maxTime.value * 60000,
      computePlanAutomatically: this.settingsForm.controls.computePlanAutomatically.value,
      computeDependenciesAutomatically: this.settingsForm.controls.computeDependenciesAutomatically.value,
      checkMaxUtility: this.settingsForm.controls.checkMaxUtility.value,
      showPaymentInfo: this.settingsForm.controls.showPaymentScore.value,
      paymentInfo,
    }

    // console.log(newSettings);
    this.update.emit(newSettings);
  }
}
