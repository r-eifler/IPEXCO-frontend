import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { defaultGeneralSetting, ExplanationInterfaceType, GeneralSettings } from 'src/app/project/domain/general-settings';
import { ActionCardComponent } from 'src/app/shared/components/action-card/action-card/action-card.component';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { ChatModule } from 'src/app/shared/components/chat/chat.module';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { PlanPropertyPanelComponent } from 'src/app/shared/components/plan-property-panel/plan-property-panel.component';
import { GoalType, PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { PlanningTask } from 'src/app/shared/domain/planning-task';
import { ExplanationRunStatus, QuestionType } from '../../domain/explanation/explanations';
import { questionFactory } from '../../domain/explanation/question-factory';
import { StructuredText } from '../../domain/interface/explanation-message';
import { computeCurrentMaxUtility, IterationStep, StepStatus } from '../../domain/iteration_step';
import { PlanRunStatus } from '../../domain/plan';
import { IterationStepCardComponent } from '../iteration-step-card/iteration-step-card.component';
import { StepsListHeroComponent } from '../steps-list-hero/steps-list-hero.component';
import { computeMaxPossibleUtility, Demo, DemoRunStatus } from 'src/app/shared/domain/demo';

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
    InfoComponent,
    BreadcrumbModule
  ],
  templateUrl: './user-manual.component.html',
  styleUrl: './user-manual.component.scss'
})
export class UserManualComponent {

  settings = input<GeneralSettings | null>(null);

  templatesManual = computed(() => 
    this.settings() ? this.settings()?.interfaces.explanationInterfaceType === ExplanationInterfaceType.TEMPLATE_QUESTION_ANSWER : true
  );
  LLMManual = computed(
    () => this.settings() ? this.settings()?.interfaces.explanationInterfaceType === ExplanationInterfaceType.LLM_CHAT : true
  );

  sampleDemo: Demo = {
    _id: '1',
    projectId: '',
    status: DemoRunStatus.finished,
    name: '',
    public: false,
    settings: defaultGeneralSetting,
    globalExplanation: {
      status: ExplanationRunStatus.finished,
      MUGS: [],
      MGCS: [['2', '5']],
      createdAt: new Date()
    },
    itemType: 'demo-project',
    updated: '',
    user: '',
    domain: '',
    description: '',
    instanceInfo: '',
    baseTask: {
      name: '',
      model: {
        objects: []
      }
    },
    summaryImage: null
  }

  samplePlanProperties: PlanProperty[] = [
    {
      _id: '1',
      name: 'Go shopping',
      type: GoalType.LTL,
      definition: null,
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
      definition: null,
      formula: '',
      project: '',
      isUsed: false,
      globalHardGoal: false,
      utility: 2,
      color: '#f07575',
      icon: 'directions_car',
      class: '',
      naturalLanguageDescription: 'Load the groceries at the supermarket into your car and drive home and unload the groceries. The groceries require one unite of space in your car.'
    },
    {
      _id: '3',
      name: 'Do fitness course',
      type: GoalType.LTL,
      definition: null,
      formula: '',
      project: '',
      isUsed: false,
      globalHardGoal: false,
      utility: 2,
      color: '#668cff',
      icon: 'fitness_center',
      class: '',
      naturalLanguageDescription: 'Drive to the Fitness center and take one hours fitness course.'
    },
    {
    _id: '4',
    name: 'Visit friend',
    type: GoalType.LTL,
    definition: null,
    formula: '',
    project: '',
    isUsed: false,
    globalHardGoal: false,
    utility: 1,
    color: '#88dd88',
    icon: 'group',
    class: '',
    naturalLanguageDescription: 'Drive to friend house at 4pm and spend one hour there.'
  },
  {
    _id: '5',
    name: 'Pick up Alice from school',
    type: GoalType.LTL,
    definition: null,
    formula: '',
    project: '',
    isUsed: false,
    globalHardGoal: false,
    utility: 3,
    color: '#f4b371',
    icon: 'directions_car',
    class: '',
    naturalLanguageDescription: 'Drive to school at 2pm. Alice needs requires one unite of space in your car.'
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


  dummyTask: PlanningTask = {
    name: 'Dummy Task',
    model: {
      objects: []
    }
  }

  sampleSteps: IterationStep[] = [
    {
      _id: '1',
      name: 'Step 1',
      project: '',
      status: StepStatus.unsolvable,
      hardGoals: ['1','2','3'],
      softGoals: [],
      task: this.dummyTask,
      predecessorStep: '',
      plan: {
        status: PlanRunStatus.not_solvable,
        cost: 0,
        createdAt: new Date(),
        actions: null,
        satisfied_properties: []
      },
      user: '',
      createdAt: new Date(),
    },
    {
      _id: '2',
      name: 'Step 2',
      project: '',
      status: StepStatus.solvable,
      hardGoals: ['1','3'],
      softGoals: ['4','5'],
      task: this.dummyTask,
      predecessorStep: '',
      plan: {
        status: PlanRunStatus.plan_found,
        cost: 0,
        createdAt: new Date(),
        actions: null,
        satisfied_properties: ['1', '3', '4']
      },
      user: '',
      createdAt: new Date(),
    },
    {
      _id: '3',
      name: 'Step 3',
      project: '',
      status: StepStatus.unknown,
      hardGoals: ['1','3'],
      softGoals: [],
      task: this.dummyTask,
      predecessorStep: '',
      plan: {
        status: PlanRunStatus.running,
        cost: 0,
        createdAt: new Date(),
        actions: null,
        satisfied_properties: []
      },
      user: '',
      createdAt: new Date(),
    },
    {
      _id: '4',
      name: 'Step 4',
      project: '',
      status: StepStatus.unknown,
      hardGoals: ['1', '3'],
      softGoals: [],
      task: this.dummyTask,
      predecessorStep: '',
      plan: {
        status: PlanRunStatus.canceled,
        cost: 0,
        createdAt: new Date(),
        actions: null,
        satisfied_properties: []
      },
      user: '',
      createdAt: new Date(),
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
