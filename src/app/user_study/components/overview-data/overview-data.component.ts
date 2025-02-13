import { Component, computed, inject, input } from "@angular/core";
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { QuestionType } from 'src/app/iterative_planning/domain/explanation/explanations';
import { ActionType, AskQuestionUserAction, CreateIterationStepUserAction, PlanForIterationStepUserAction, StartDemoUserAction } from 'src/app/user_study_execution/domain/user-action';
import { selectUserStudyParticipantsOfStudy } from '../../state/user-study.selector';

export interface DataPoint {
    name: string,
    value: number
  }

@Component({
    selector: "app-overview-data",
    imports: [
        NgxChartsModule,
        MatCardModule,
    ],
    templateUrl: "./overview-data.component.html",
    styleUrls: ["./overview-data.component.scss"]
})
export class OverviewDataComponent {

  private store = inject(Store);

  selectedParticipantsId = input<string[]>([]);
  demoId = input.required<string>();

  participants = toSignal(this.store.select(selectUserStudyParticipantsOfStudy));


  view: any[] = ['100%', 400];

  // options
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;

  colorScheme = {
    domain: ["#3711b2"],
  };

  // colorSchemeQuestionTypes = {
  //   domain : ["#8f7eff", "#5b44d5", "#4326bd", "2c009d"],
  // };

  selectedParticipants = computed(() => this.participants()?.filter(p => this.selectedParticipantsId().includes(p.user)))

  showPlots = computed(() => {
    const selectedParticipants = this.selectedParticipants();
    return  selectedParticipants != undefined && 
    selectedParticipants.length > 0 && this.demoId()
  });

  iterationStepsData = computed(() => 
    this.selectedParticipants()?.map(p => ({
      name: p.user, 
      value: p.timeLog.filter(a => a.type == ActionType.CREATE_ITERATION_STEP).
      map(a => a as CreateIterationStepUserAction).
      filter(a => a.data.demoId == this.demoId()).length
    }))
  );


  questionsData = computed(() => 
    this.selectedParticipants()?.map(p => ({
      name: p.user, 
      value: p.timeLog.filter(a => a.type == ActionType.ASK_QUESTION).
      map(a => a as AskQuestionUserAction).
      filter(a => a.data.demoId == this.demoId()).length
    }))
  );

  utilityData = computed(() => 
    this.selectedParticipants()?.map(p => ({
      name: p.user, 
      value: p.timeLog.
      filter(a => a.type == ActionType.PLAN_FOR_ITERATION_STEP).
      map(a => a as PlanForIterationStepUserAction).
      filter(a => a.data.demoId == this.demoId()).
      map((a: PlanForIterationStepUserAction) => a.data.utility ? a.data.utility : 0).reduce((p,c) => Math.max(p,c), 0)
    }))
  );

  utilityTimeData = computed(() =>{
    if(this.selectedParticipants() == null || this.selectedParticipants()?.length == 0){
      return [];
    }

    const minTime = 0;
    const maxTime =1200;
    const step = 15;
    let maxAverageUtility:{
      name: string, 
      series: {
        name: string,
        value: number
      }[]
    }[] = [{name: 'Utility', series: []}]

    const utilitiesOverTime = this.selectedParticipants()?.map(p => {

        const startTime = p.timeLog.
        filter(a => a.type == ActionType.START_DEMO).
        map(a => a as StartDemoUserAction).
        filter(a => a.data.demoId === this.demoId())[0].timeStamp;

        if(startTime === undefined){
          return undefined;
        }

        const planActions = p.timeLog.
        filter(a => a.type == ActionType.PLAN_FOR_ITERATION_STEP).
        map(a => a as PlanForIterationStepUserAction).
        filter(a => a.data.demoId == this.demoId())

        return planActions.map(a => a.timeStamp?.getTime() ? {
          time: a.timeStamp?.getTime() - startTime.getTime(),
          utility: a.data.utility ? a.data.utility : 0
        } : null).filter(e => !!e)
    }).filter(e => e !== undefined);

    if(utilitiesOverTime === undefined){
      return undefined;
    }

    for(let time = minTime; time <= maxTime; time += step){
      const maxUtilitiesUpTo = utilitiesOverTime.map(us => us.reduce(
        (p,c) => c.time <= time ? Math.max(p,c.utility) : p, 0)
      )
      maxAverageUtility[0].series.push({name: time.toString(), value: average(maxUtilitiesUpTo)});
    }
    return maxAverageUtility 
  })


  questionTypeData = computed(() => {
      // TODO ask Merlin
      type questionTypeMap = { [key in QuestionType]?: {name: QuestionType, value: number} };
      let data: questionTypeMap = {};
      Object.values(QuestionType).forEach(k => {data[k] = {name: k, value: 0}});

      this.selectedParticipants()?.forEach(p => (
        p.timeLog.filter(a => a.type == ActionType.ASK_QUESTION).
        map(a => a as AskQuestionUserAction).
        filter(a => a.data.demoId == this.demoId()).forEach( a => {
          const key = a.data.questionType;
          if(data[k] === undefined){
            return;
          }
          // q.data.questionType !== undefined && data[q.data.questionType] !== undefined && data[q.data.questionType]?.value !== undefined ? 
          // data[q.data.questionType].value += 1 : 
          // true
        })
      ))

      return Object.values(data);
    }
  )

}

function average(values: number[]): number{
  return values?.reduce((p,c) => p + c, 0) / values?.length
}