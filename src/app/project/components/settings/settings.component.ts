import { Component, computed, DestroyRef, effect, inject, input, output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ExplanationInterfaceType, GeneralSettings, PropertyCreationInterfaceType } from "../../domain/general-settings";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { NgIf } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { Explainer, Planner } from "src/app/global_specification/domain/services";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { AgentType, OutputSchema, Prompt, PromptType } from "src/app/global_specification/domain/prompt";


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
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule
    ],
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent {

  destroyRef = inject(DestroyRef)

  settings = input.required<GeneralSettings>();
  isDemo = input<boolean>(false);
  planners = input.required<Planner[]>();
  explainer = input.required<Explainer[]>();
  prompts = input.required<Prompt[]>();
  outputSchemas = input.required<OutputSchema[]>();

  systemPrompts = computed(() => this.prompts()?.filter(p => p.type == PromptType.SYSTEM));
  goalTransInstructionPrompts = computed(() => this.prompts()?.filter(p => p.type == PromptType.INSTRUCTION_AND_EXAMPLES && p.agent == AgentType.GOAL_TRANSLATOR));
  goalTransDataPrompts = computed(() => this.prompts()?.filter(p => p.type == PromptType.INPUT_DATA && p.agent == AgentType.GOAL_TRANSLATOR));
  questionClassInstructionPrompts = computed(() => this.prompts()?.filter(p => p.type == PromptType.INSTRUCTION_AND_EXAMPLES && p.agent == AgentType.QUESTION_CLASSIFIER));
  questionClassDataPrompts = computed(() => this.prompts()?.filter(p => p.type == PromptType.INPUT_DATA && p.agent == AgentType.QUESTION_CLASSIFIER));
  explanationTransInstructionPrompts = computed(() => this.prompts()?.filter(p => p.type == PromptType.INSTRUCTION_AND_EXAMPLES && p.agent == AgentType.EXPLANATION_TRANSLATOR));
  explanationTransDataPrompts = computed(() => this.prompts()?.filter(p => p.type == PromptType.INPUT_DATA && p.agent == AgentType.EXPLANATION_TRANSLATOR));

  explanationTransOutputSchemas = computed(() => this.outputSchemas()?.filter(p => p.agent == AgentType.EXPLANATION_TRANSLATOR));
  goalTransOutputSchemas = computed(() => this.outputSchemas()?.filter(p => p.agent == AgentType.GOAL_TRANSLATOR));
  questionClassOutputSchemas = computed(() => this.outputSchemas()?.filter(p => p.agent == AgentType.QUESTION_CLASSIFIER));

  update = output<GeneralSettings>();

  ExplanationTypes = ExplanationInterfaceType;
  PropertyCreationTypes = PropertyCreationInterfaceType;

  fb = inject(FormBuilder);

  form = this.fb.group({
    main: this.fb.group({
      public: this.fb.control<boolean>(false, Validators.required),
      maxRuns: this.fb.control<number | null>(100),
      usePlanPropertyUtility: this.fb.control<boolean>(false, Validators.required),
    }),
    services: this.fb.group({
      computePlanAutomatically: this.fb.control<boolean>(false, Validators.required),
      computeExplanationsAutomatically: this.fb.control<boolean>(false, Validators.required),
      planners: this.fb.control<string[]>([], Validators.required),
      explainer: this.fb.control<string[]>([], Validators.required),
    }),
    interfaces: this.fb.group({
      propertyCreationInterfaceType: this.fb.control<PropertyCreationInterfaceType>(PropertyCreationInterfaceType.TEMPLATE_BASED, Validators.required),
      explanationInterfaceType: this.fb.control<ExplanationInterfaceType>(ExplanationInterfaceType.TEMPLATE_QUESTION_ANSWER, Validators.required),
    }),
    llmConfig: this.fb.group({
      model:  this.fb.control<string>('gpt-4o-mini', Validators.required),
      temperature:  this.fb.control<number>(0, [Validators.required, Validators.min(0), Validators.max(2)]),
      maxCompletionTokens: this.fb.control<number | null>(null, Validators.required),
      prompts: this.fb.group({
        system: this.fb.control<string>(null),
        goalTransInstructions: this.fb.control<string>(null),
        goalTransData: this.fb.control<string>(null),
        questionClassInstructions: this.fb.control<string>(null),
        questionClassData: this.fb.control<string>(null),
        explanationTransInstruction: this.fb.control<string>(null),
        explanationTransData: this.fb.control<string>(null),
      }),
      outputSchemas:  this.fb.group({
        goalTrans: this.fb.control<string>(null),
        questionClass: this.fb.control<string>(null),
        explanationTrans: this.fb.control<string>(null),
      }),
    }),
    userStudy: this.fb.group({
          introTask: this.fb.control<boolean>(false, Validators.required),
          checkMaxUtility: this.fb.control<boolean>(false, Validators.required),
          showPaymentInfo: this.fb.control<boolean>(false, Validators.required),
          paymentInfo: this.fb.group({
            min: this.fb.control<number>(0, Validators.required),
            max: this.fb.control<number>(0, Validators.required),
            steps: this.fb.control<string>('', Validators.required),
          }),
    })
  })

  constructor() {

    // effect(() => this.initForm(this.settings()))

  }


  initForm(settings: GeneralSettings): void {
    if(!settings){
      return;
    }

    this.form.controls.main.controls.maxRuns.setValue(settings.main.maxRuns);
    this.form.controls.main.controls.public.setValue(settings.main.public);
    this.form.controls.main.controls.usePlanPropertyUtility.setValue(settings.main.usePlanPropertyUtility);

    this.form.controls.interfaces.controls.explanationInterfaceType.setValue(settings.interfaces.explanationInterfaceType);
    this.form.controls.interfaces.controls.propertyCreationInterfaceType.setValue(settings.interfaces.propertyCreationInterfaceType);

    this.form.controls.services.controls.computePlanAutomatically.setValue(settings.services.computePlanAutomatically);
    this.form.controls.services.controls.computeExplanationsAutomatically.setValue(settings.services.computeExplanationsAutomatically);
    this.form.controls.services.controls.planners.setValue(settings.services.planners);
    this.form.controls.services.controls.explainer.setValue(settings.services.explainer);

    this.form.controls.llmConfig.controls.model.setValue(settings.llmConfig.model);
    this.form.controls.llmConfig.controls.temperature.setValue(settings.llmConfig.temperature);
    this.form.controls.llmConfig.controls.maxCompletionTokens.setValue(settings.llmConfig.maxCompletionTokens);

    //TODO
    this.form.controls.llmConfig.controls.prompts.controls.system.setValue(this.systemPrompts()?.find(p => settings.llmConfig.prompts.includes(p._id))._id)
    //TODO other prompt types
    // TODO output schemas

    this.form.controls.userStudy.controls.introTask.setValue(settings.userStudy.introTask);
    this.form.controls.userStudy.controls.checkMaxUtility.setValue(settings.userStudy.checkMaxUtility);
    this.form.controls.userStudy.controls.showPaymentInfo.setValue(settings.userStudy.showPaymentInfo);
    this.form.controls.userStudy.controls.paymentInfo.controls.min.setValue(settings.userStudy.paymentInfo.min);
    this.form.controls.userStudy.controls.paymentInfo.controls.max.setValue(settings.userStudy.paymentInfo.max);
    this.form.controls.userStudy.controls.paymentInfo.controls.steps.setValue(
      settings.userStudy.paymentInfo.steps.join(';')
    );

  }

  onSave() {

    let paymentInfo = {
      max: this.form.controls.userStudy.controls.paymentInfo.controls.max.value,
      min: this.form.controls.userStudy.controls.paymentInfo.controls.min.value,
      steps: this.form.controls.userStudy.controls.paymentInfo.controls.steps.value.split(';').map(s => Number(s)),
    }

    let newSettings: GeneralSettings = {
      _id: undefined,
      main: {
        public: this.form.controls.main.controls.public.value,
        maxRuns: this.form.controls.main.controls.maxRuns.value,
        usePlanPropertyUtility: this.form.controls.main.controls.usePlanPropertyUtility.value,
      },
      services: {
          computePlanAutomatically: this.form.controls.services.controls.computePlanAutomatically.value,
          computeExplanationsAutomatically: this.form.controls.services.controls.computeExplanationsAutomatically.value,
          planners: this.form.controls.services.controls.planners.value,
          explainer: this.form.controls.services.controls.explainer.value,
      },
      interfaces: {
          explanationInterfaceType: this.form.controls.interfaces.controls.explanationInterfaceType.value,
          propertyCreationInterfaceType: this.form.controls.interfaces.controls.propertyCreationInterfaceType.value,
      },
      llmConfig: {
        model: this.form.controls.llmConfig.controls.model.value,
        temperature: this.form.controls.llmConfig.controls.temperature.value,
        maxCompletionTokens: this.form.controls.llmConfig.controls.maxCompletionTokens.value,
        prompts: [
          this.form.controls.llmConfig.controls.prompts.controls.system.value,
          this.form.controls.llmConfig.controls.prompts.controls.goalTransInstructions.value,
          this.form.controls.llmConfig.controls.prompts.controls.goalTransData.value,
          this.form.controls.llmConfig.controls.prompts.controls.questionClassInstructions.value,
          this.form.controls.llmConfig.controls.prompts.controls.questionClassData.value,
          this.form.controls.llmConfig.controls.prompts.controls.explanationTransInstruction.value,
          this.form.controls.llmConfig.controls.prompts.controls.explanationTransData.value,
        ].filter(e => !!e),
        outputSchema: [
          this.form.controls.llmConfig.controls.outputSchemas.controls.goalTrans.value,
          this.form.controls.llmConfig.controls.outputSchemas.controls.questionClass.value,
          this.form.controls.llmConfig.controls.outputSchemas.controls.explanationTrans.value,
        ]
      },
      userStudy: {
          introTask: this.form.controls.userStudy.controls.introTask.value,
          checkMaxUtility: this.form.controls.userStudy.controls.checkMaxUtility.value,
          showPaymentInfo: this.form.controls.userStudy.controls.showPaymentInfo.value,
          paymentInfo
      }
    }

    this.update.emit(newSettings);
  }
}
