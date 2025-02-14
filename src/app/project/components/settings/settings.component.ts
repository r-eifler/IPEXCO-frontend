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
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { AgentType, OutputSchema, Prompt, PromptType } from "src/app/global_specification/domain/prompt";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { Service, ServiceType } from "src/app/global_specification/domain/services";


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
        MatSelectModule,
        MatCheckboxModule
    ],
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent {

  destroyRef = inject(DestroyRef)

  settings = input.required<GeneralSettings>();
  isDemo = input<boolean>(false);
  services = input.required<Service[]>();
  prompts = input.required<Prompt[]>();
  outputSchemas = input.required<OutputSchema[]>();

  planners = computed(() => this.services()?.filter(s => s.type == ServiceType.PLANNER));
  explainer = computed(() => this.services()?.filter(s => s.type == ServiceType.EXPLAINER));
  propertyChecker = computed(() => this.services()?.filter(s => s.type == ServiceType.PROPERTY_CHECKER));
  tester = computed(() => this.services()?.filter(s => s.type == ServiceType.TESTER));
  verifier = computed(() => this.services()?.filter(s => s.type == ServiceType.VERIFIER));

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
      planners: this.fb.control<string[]>([], {validators: [Validators.required], nonNullable: true}),
      explainer: this.fb.control<string[]>([], {validators: [Validators.required], nonNullable: true}),
      propertyChecker: this.fb.control<string[]>([], {validators: [Validators.required], nonNullable: true}),
      tester: this.fb.control<string[]>([]),
      verifier: this.fb.control<string[]>([]),
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
        system: this.fb.control<string | null>(null),
        goalTransInstructions: this.fb.control<string | null>(null),
        goalTransData: this.fb.control<string | null>(null),
        questionClassInstructions: this.fb.control<string | null>(null),
        questionClassData: this.fb.control<string | null>(null),
        explanationTransInstruction: this.fb.control<string | null>(null),
        explanationTransData: this.fb.control<string | null>(null),
      }),
      outputSchemas:  this.fb.group({
        goalTrans: this.fb.control<string | null>(null),
        questionClass: this.fb.control<string | null>(null),
        explanationTrans: this.fb.control<string | null>(null),
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

    effect(() => {
    const settings = this.settings();
    if (settings == null || settings == undefined){
      return;
    }
		try{
			this.form.controls.main.controls.maxRuns.setValue(settings.main.maxRuns);
			this.form.controls.main.controls.public.setValue(settings.main.public);
			this.form.controls.main.controls.usePlanPropertyUtility.setValue(settings.main.usePlanPropertyUtility);
		
			this.form.controls.interfaces.controls.explanationInterfaceType.setValue(settings.interfaces.explanationInterfaceType);
			this.form.controls.interfaces.controls.propertyCreationInterfaceType.setValue(settings.interfaces.propertyCreationInterfaceType);
		
			this.form.controls.services.controls.computePlanAutomatically.setValue(settings.services.computePlanAutomatically);
			this.form.controls.services.controls.computeExplanationsAutomatically.setValue(settings.services.computeExplanationsAutomatically);
			this.form.controls.services.controls.planners.setValue(
				this.planners().filter(s => settings.services.services.includes(s._id)).map(s => s._id)
			);
			this.form.controls.services.controls.explainer.setValue(
				this.explainer().filter(s => settings.services.services.includes(s._id)).map(s => s._id)
			);
			this.form.controls.services.controls.propertyChecker.setValue(
				this.propertyChecker().filter(s => settings.services.services.includes(s._id)).map(s => s._id)
			);
			this.form.controls.services.controls.tester.setValue(
				this.tester().filter(s => settings.services.services.includes(s._id)).map(s => s._id)
			);
			this.form.controls.services.controls.verifier.setValue(
				this.verifier().filter(s => settings.services.services.includes(s._id)).map(s => s._id)
			);

		
			this.form.controls.llmConfig.controls.model.setValue(settings.llmConfig.model);
			this.form.controls.llmConfig.controls.temperature.setValue(settings.llmConfig.temperature);
			this.form.controls.llmConfig.controls.maxCompletionTokens.setValue(settings.llmConfig.maxCompletionTokens);
  
			if(settings.llmConfig.prompts && settings.llmConfig.prompts.length > 0){

				const systemPrompt = this.systemPrompts()?.find(p => settings.llmConfig.prompts.includes(p._id))

				const goalTransDataPrompt = this.goalTransDataPrompts()?.find(p => settings.llmConfig.prompts.includes(p._id))
				const goalTransInstructionPrompt = this.goalTransInstructionPrompts()?.find(p => settings.llmConfig.prompts.includes(p._id))

				const questionClassDataPrompt = this.questionClassDataPrompts()?.find(p => settings.llmConfig.prompts.includes(p._id))
				const questionClassInstructionPrompt = this.questionClassInstructionPrompts()?.find(p => settings.llmConfig.prompts.includes(p._id))

				const explanationTransDataPrompt = this.explanationTransDataPrompts()?.find(p => settings.llmConfig.prompts.includes(p._id))
				const explanationTransInstructionPrompt = this.explanationTransInstructionPrompts()?.find(p => settings.llmConfig.prompts.includes(p._id))



				this.form.controls.llmConfig.controls.prompts.controls.system.setValue(systemPrompt?._id ?? null);

				this.form.controls.llmConfig.controls.prompts.controls.goalTransData.setValue(goalTransDataPrompt?._id ?? null);
				this.form.controls.llmConfig.controls.prompts.controls.goalTransInstructions.setValue(goalTransInstructionPrompt?._id ?? null);

				this.form.controls.llmConfig.controls.prompts.controls.questionClassData.setValue(questionClassDataPrompt?._id ?? null);
				this.form.controls.llmConfig.controls.prompts.controls.questionClassInstructions.setValue(questionClassInstructionPrompt?._id ?? null);

				this.form.controls.llmConfig.controls.prompts.controls.explanationTransData.setValue(explanationTransDataPrompt?._id ?? null);
				this.form.controls.llmConfig.controls.prompts.controls.explanationTransInstruction.setValue(explanationTransInstructionPrompt?._id ?? null);
			}

			if(settings.llmConfig.outputSchema && settings.llmConfig.outputSchema.length > 0){

				const goalTransOutputSchema = this.goalTransOutputSchemas()?.find(p => settings.llmConfig.outputSchema.includes(p._id))
				const questionClassOutputSchema = this.questionClassOutputSchemas()?.find(p => settings.llmConfig.outputSchema.includes(p._id))
				const explanationTransOutputSchema = this.explanationTransOutputSchemas()?.find(p => settings.llmConfig.outputSchema.includes(p._id))

				this.form.controls.llmConfig.controls.outputSchemas.controls.goalTrans.setValue(goalTransOutputSchema?._id ?? null);
				this.form.controls.llmConfig.controls.outputSchemas.controls.questionClass.setValue(questionClassOutputSchema?._id ?? null);
				this.form.controls.llmConfig.controls.outputSchemas.controls.explanationTrans.setValue(explanationTransOutputSchema?._id ?? null);
			}
		
			this.form.controls.userStudy.controls.introTask.setValue(settings.userStudy.introTask);
			this.form.controls.userStudy.controls.checkMaxUtility.setValue(settings.userStudy.checkMaxUtility);
			this.form.controls.userStudy.controls.showPaymentInfo.setValue(settings.userStudy.showPaymentInfo);
      const paymentInfo = settings.userStudy.paymentInfo;
      if(paymentInfo != undefined){
        this.form.controls.userStudy.controls.paymentInfo.controls.min.setValue(paymentInfo.min);
        this.form.controls.userStudy.controls.paymentInfo.controls.max.setValue(paymentInfo.max);
        this.form.controls.userStudy.controls.paymentInfo.controls.steps.setValue(
          paymentInfo.steps.join(';')
			);
      }
		}
		catch(e: any){
			console.log('Could not initialize settings!')
		}
	})

  }

  onSave() {

    let paymentInfo = {
      max: this.form.controls.userStudy.controls.paymentInfo.controls.max.value ?? 0,
      min: this.form.controls.userStudy.controls.paymentInfo.controls.min.value ?? 1,
      steps: this.form.controls.userStudy.controls.paymentInfo.controls.steps.value 
	  	? this.form.controls.userStudy.controls.paymentInfo.controls.steps.value.split(';').map(s => Number(s))
		: [1],
    }

    let newSettings: GeneralSettings = {
      main: {
        public: this.form.controls.main.controls.public.value ?? false,
        maxRuns: this.form.controls.main.controls.maxRuns.value,
        usePlanPropertyUtility: this.form.controls.main.controls.usePlanPropertyUtility.value ?? true,
      },
      services: {
          	computePlanAutomatically: this.form.controls.services.controls.computePlanAutomatically.value ?? true,
          	computeExplanationsAutomatically: this.form.controls.services.controls.computeExplanationsAutomatically.value ?? true,
          	services: [
        		  ...this.form.controls.services.controls.planners.value ,
            	...this.form.controls.services.controls.explainer.value,
              ...this.form.controls.services.controls.propertyChecker.value,
              ...(this.form.controls.services.controls.tester.value ?? []),
              ...(this.form.controls.services.controls.verifier.value ?? []),
          	].filter(e => e !== null)
      },
      interfaces: {
          explanationInterfaceType: this.form.controls.interfaces.controls.explanationInterfaceType.value ?? ExplanationInterfaceType.TEMPLATE_QUESTION_ANSWER,
          propertyCreationInterfaceType: this.form.controls.interfaces.controls.propertyCreationInterfaceType.value ?? PropertyCreationInterfaceType.TEMPLATE_BASED,
      },
      llmConfig: {
        model: this.form.controls.llmConfig.controls.model.value ?? '',
        temperature: this.form.controls.llmConfig.controls.temperature.value ?? 0,
        maxCompletionTokens: this.form.controls.llmConfig.controls.maxCompletionTokens.value,
        prompts: [
          this.form.controls.llmConfig.controls.prompts.controls.system.value,
          this.form.controls.llmConfig.controls.prompts.controls.goalTransInstructions.value,
          this.form.controls.llmConfig.controls.prompts.controls.goalTransData.value,
          this.form.controls.llmConfig.controls.prompts.controls.questionClassInstructions.value,
          this.form.controls.llmConfig.controls.prompts.controls.questionClassData.value,
          this.form.controls.llmConfig.controls.prompts.controls.explanationTransInstruction.value,
          this.form.controls.llmConfig.controls.prompts.controls.explanationTransData.value,
        ].filter(e => e !== null),
        outputSchema: [
          this.form.controls.llmConfig.controls.outputSchemas.controls.goalTrans.value,
          this.form.controls.llmConfig.controls.outputSchemas.controls.questionClass.value,
          this.form.controls.llmConfig.controls.outputSchemas.controls.explanationTrans.value,
        ].filter(e => e !== null),
      },
      userStudy: {
          introTask: this.form.controls.userStudy.controls.introTask.value ?? false,
          checkMaxUtility: this.form.controls.userStudy.controls.checkMaxUtility.value ?? true,
          showPaymentInfo: this.form.controls.userStudy.controls.showPaymentInfo.value ?? false,
          paymentInfo
      }
    }

	console.log(newSettings);

    this.update.emit(newSettings);
  }
}
