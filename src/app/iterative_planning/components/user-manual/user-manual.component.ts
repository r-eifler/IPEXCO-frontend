import { Component, computed, input, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { ExplanationInterfaceType, GeneralSettings } from 'src/app/project/domain/general-settings';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { computeCurrentMaxUtility, IterationStep, StepStatus } from '../../domain/iteration_step';
import { GoalType, PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { PlanPropertyPanelComponent } from 'src/app/shared/components/plan-property-panel/plan-property-panel.component';
import { IterationStepCardComponent } from '../iteration-step-card/iteration-step-card.component';
import { PlanRunStatus } from '../../domain/plan';
import { MatButtonModule } from '@angular/material/button';
import { ActionCardComponent } from 'src/app/shared/components/action-card/action-card/action-card.component';
import { Demo, DemoRunStatus, computeMaxPossibleUtility } from 'src/app/project/domain/demo';
import { ExplanationRunStatus, QuestionType } from '../../domain/explanation/explanations';
import { StepsListHeroComponent } from '../steps-list-hero/steps-list-hero.component';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { ChatModule } from 'src/app/shared/components/chat/chat.module';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';
import { StructuredText } from '../../domain/interface/explanation-message';
import { questionFactory } from '../../domain/explanation/question-factory';

type AvailableQuestion = {
  message: StructuredText;
  questionType: QuestionType;
}

@Component({
  selector: 'app-user-manual',
  imports: [
    MatTabsModule,
    PageModule,
    MatIconModule,
    MatListModule,
    PlanPropertyPanelComponent,
    IterationStepCardComponent,
    MatButtonModule,
    ActionCardComponent,
    StepsListHeroComponent,
    LabelModule,
    ChatModule,
    InfoComponent
  ],
  templateUrl: './user-manual.component.html',
  styleUrl: './user-manual.component.scss'
})
export class UserManualComponent {

  settings: Signal<GeneralSettings> = input(null);

  templatesManual = computed(() => 
    this.settings() ? this.settings()?.explanationInterfaceType === ExplanationInterfaceType.TEMPLATE_QUESTION_ANSWER : true
  );
  LLMManual = computed(
    () => this.settings() ? this.settings()?.explanationInterfaceType === ExplanationInterfaceType.LLM_CHAT : true
  );

  sampleDemo: Demo = {
    _id: '1',
    projectId: '',
    status: DemoRunStatus.finished,
    completion: 0,
    name: '',
    public: false,
    domainSpecification: undefined,
    settings: undefined,
    globalExplanation: {
      status: ExplanationRunStatus.finished,
      MUGS: [],
      MGCS: [['2','5']]
    }
  }

  samplePlanProperties: PlanProperty[] = [
    {
      _id: '1',
      name: 'Go shopping',
      type: GoalType.LTL,
      formula: '',
      project: '',
      isUsed: false,
      globalHardGoal: true,
      utility: 3,
      color: '#f07575',
      icon: 'shopping_cart',
      class: '',
      naturalLanguageDescription: 'Drive to the supermarket and spend 1 hour shopping.'
    },
    {
      _id: '2',
      name: 'Bring groceries home',
      type: GoalType.LTL,
      formula: '',
      project: '',
      isUsed: false,
      globalHardGoal: false,
      utility: 2,
      color: '#f07575',
      icon: 'directions_car',
      class: '',
      naturalLanguageDescription: 'Load the groceries at the supermarket into your car and drive home and unload the groceries. The groceries require on unite of space in your car.'
    },
    {
      _id: '3',
      name: 'Do fitness course',
      type: GoalType.LTL,
      formula: '',
      project: '',
      isUsed: false,
      globalHardGoal: false,
      utility: 2,
      color: '#668cff',
      icon: 'fitness_center',
      class: '',
      naturalLanguageDescription: 'Drive to the Fitness center and take a one hours fitness course.'
    },
    {
    _id: '4',
    name: 'Visit friend',
    type: GoalType.LTL,
    formula: '',
    project: '',
    isUsed: false,
    globalHardGoal: false,
    utility: 1,
    color: '#88dd88',
    icon: 'group',
    class: '',
    naturalLanguageDescription: 'Drive to friend house at 4pm a spend one hour there.'
  },
  {
    _id: '5',
    name: 'Pick up Alice from school',
    type: GoalType.LTL,
    formula: '',
    project: '',
    isUsed: false,
    globalHardGoal: false,
    utility: 3,
    color: '#f4b371',
    icon: 'directions_car',
    class: '',
    naturalLanguageDescription: 'Drive to school at 2pm. Alice needs requires on unite of space in your car.'
  },
  ]

  samplePlanPropertiesMap = {
    '1': this.samplePlanProperties[0],
    '2': this.samplePlanProperties[1],
    '3': this.samplePlanProperties[2],
    '4': this.samplePlanProperties[3],
    '5': this.samplePlanProperties[4],
  }

  unsolvableQuestionTypes = [QuestionType.HOW_PLAN, QuestionType.WHY_PLAN]
  unsolvableQuestions = this.unsolvableQuestionTypes.map(t => ({message: questionFactory(t)(undefined), questionType: t}));
  solvableQuestionTypes = [QuestionType.CAN_PROPERTY, QuestionType.WHAT_IF_PROPERTY, QuestionType.WHY_NOT_PROPERTY, QuestionType.HOW_PROPERTY]
  solvableQuestions: AvailableQuestion[] = this.solvableQuestionTypes.map(t => ({message: questionFactory(t)(this.samplePlanProperties[4].name), questionType: t}));

  sampleSteps: IterationStep[] = [
    {
      _id: '1',
      name: 'Step 1',
      project: '',
      status: StepStatus.unsolvable,
      hardGoals: ['1','2','3'],
      softGoals: [],
      task: undefined,
      predecessorStep: '',
      plan: {
        status: PlanRunStatus.not_solvable,
        cost: 0
      }
    },
    {
      _id: '2',
      name: 'Step 2',
      project: '',
      status: StepStatus.solvable,
      hardGoals: ['1','3'],
      softGoals: ['4','5'],
      task: undefined,
      predecessorStep: '',
      plan: {
        status: PlanRunStatus.plan_found,
        cost: 0,
        satisfied_properties: ['1', '3', '4']
      }
    },
    {
      _id: '3',
      name: 'Step 3',
      project: '',
      status: StepStatus.unknown,
      hardGoals: ['1','3'],
      softGoals: [],
      task: undefined,
      predecessorStep: '',
      plan: {
        status: PlanRunStatus.running,
        cost: 0,
      }
    },
    {
      _id: '4',
      name: 'Step 4',
      project: '',
      status: StepStatus.unknown,
      hardGoals: ['1','3'],
      softGoals: [],
      task: undefined,
      predecessorStep: '',
      plan: {
        status: PlanRunStatus.canceled,
        cost: 0,
      }
    }
  ];

  maxOverallUtility = computeMaxPossibleUtility(this.sampleDemo, this.samplePlanProperties);
  currentMaxUtility = computeCurrentMaxUtility(this.sampleSteps, this.samplePlanPropertiesMap);


  userMessage: string = '';

  sentMessage(): boolean {
    return this.userMessage !== '';
  }

  onUserMessage(request: string) {
    this.userMessage = request;
  }
}
