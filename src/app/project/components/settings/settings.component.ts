import { Component, DestroyRef, effect, EventEmitter, inject, input, Input, OnChanges, OnInit, output, Output, SimpleChanges } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ExplanationInterfaceType, GeneralSettings, PropertyCreationInterfaceType } from "../../domain/general-settings";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { concatMap, debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { MatInputModule } from "@angular/material/input";


@Component({
    selector: "app-settings",
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
        MatInputModule,
    ],
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent {

  destroyRef = inject(DestroyRef)

  settingsForm: FormGroup;

  settings = input.required<GeneralSettings>();
  isDemo = input<boolean>(false);

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
        Validators.min(5),
        Validators.max(36000),
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

    this.settingsForm.controls.maxRuns.setValue(settings.main.maxRuns);
    this.settingsForm.controls.public.setValue(settings.main.public);
    this.settingsForm.controls.usePlanPropertyValues.setValue(settings.main.usePlanPropertyUtility);

    this.settingsForm.controls.explanationInterfaceType.setValue(settings.interfaces.explanationInterfaceType);
    this.settingsForm.controls.propertyCreationInterfaceType.setValue(settings.interfaces.propertyCreationInterfaceType);

    this.settingsForm.controls.computePlanAutomatically.setValue(settings.services.computePlanAutomatically);
    this.settingsForm.controls.computeDependenciesAutomatically.setValue(settings.services.computeExplanationsAutomatically);

    this.settingsForm.controls.introTask.setValue(settings.userStudy.introTask);
    this.settingsForm.controls.checkMaxUtility.setValue(settings.userStudy.checkMaxUtility);
    this.settingsForm.controls.showPaymentScore.setValue(settings.userStudy.showPaymentInfo);
    this.settingsForm.controls.minPayment.setValue(settings.userStudy.paymentInfo.min);
    this.settingsForm.controls.maxPayment.setValue(settings.userStudy.paymentInfo.max);
    this.settingsForm.controls.paymentSteps.setValue(settings.userStudy.paymentInfo.steps);

  }

  onSave() {

    let paymentInfo = {
      max: this.settingsForm.controls.maxPayment.value,
      min: this.settingsForm.controls.minPayment.value,
      steps: this.settingsForm.controls.paymentSteps.value,
    }

    let newSettings: GeneralSettings = {
      _id: undefined,
      main: {
        public: this.settingsForm.controls.public.value,
        maxRuns: parseInt(this.settingsForm.controls.maxRuns.value),
        usePlanPropertyUtility: this.settingsForm.controls.usePlanPropertyValues.value,
      },
      services: {
          computePlanAutomatically: this.settingsForm.controls.computePlanAutomatically.value,
          computeExplanationsAutomatically: this.settingsForm.controls.computeDependenciesAutomatically.value,
          planners: [],
          explainer: [],
      },
      interfaces: {
          explanationInterfaceType: this.settingsForm.controls.explanationInterfaceType.value,
          propertyCreationInterfaceType: this.settingsForm.controls.propertyCreationInterfaceType.value,
      },
      llmConfig: {
        model: 'gpt-4o-mini',
        temperature: 0,
        maxCompletionTokens: null,
        prompts: [],
        outputSchema: [],
      },
      userStudy: {
          introTask: this.settingsForm.controls.introTask.value,
          checkMaxUtility: this.settingsForm.controls.checkMaxUtility.value,
          showPaymentInfo: this.settingsForm.controls.showPaymentScore.value,
          paymentInfo
      }
    }

    this.update.emit(newSettings);
  }
}
