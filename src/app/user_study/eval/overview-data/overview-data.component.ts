import { USUser } from '../../domain/user-study-user';
import { filter } from 'rxjs/operators';
import { Component, computed, inject, input, Input, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { selectUserStudyParticipantsOfStudy } from '../../state/user-study.selector';
import { ActionType, AskQuestionUserAction, PlanForIterationStepUserAction } from 'src/app/user_study_execution/domain/user-action';
import { QuestionType } from 'src/app/iterative_planning/domain/explanation/explanations';

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

  showPlots = computed(() => this.selectedParticipants()?.length > 0 && this.demoId())

  iterationStepsData = computed(() => 
    this.selectedParticipants()?.map(p => ({
      name: p.user, 
      value: p.timeLog.filter(a => a.type == ActionType.CREATE_ITERATION_STEP && a.data.demoId == this.demoId()).length
    }))
  )


  questionsData = computed(() => 
    this.selectedParticipants()?.map(p => ({
      name: p.user, 
      value: p.timeLog.filter(a => a.type == ActionType.ASK_QUESTION && a.data.demoId == this.demoId()).length
    }))
  )

  utilityData = computed(() => 
    this.selectedParticipants()?.map(p => ({
      name: p.user, 
      value: p.timeLog.filter(a => a.type == ActionType.PLAN_FOR_ITERATION_STEP && a.data.demoId == this.demoId()).
      map((a: PlanForIterationStepUserAction) => a.data.utility ? a.data.utility : 0).reduce((p,c) => Math.max(p,c), 0)
    }))
  )

  utilityTimeData = computed(() =>{
    if(this.selectedParticipants() == null || this.selectedParticipants()?.length == 0){
      return [];
    }

    const minTime = 0;
    const maxTime = 600;
    const step = 60;
    let maxAverageUtility = [{name: 'Utility', series: []}]

    const utilitiesOverTime = this.selectedParticipants()?.map(p => (
      p.timeLog.filter(a => a.type == ActionType.PLAN_FOR_ITERATION_STEP && a.data.demoId == this.demoId()).
      map((a: PlanForIterationStepUserAction) => ({
        time: ((new Date(a.timeStamp)).getTime() - ( new Date(p.timeLog.filter(a => a.type == ActionType.START_DEMO)[0].timeStamp)).getTime()) / 1000, 
        utility: a.data.utility ? a.data.utility : 0}
      ))
    ));

    for(let time = minTime; time <= maxTime; time += step){
      const maxUtilitiesUpTo = utilitiesOverTime.map(us => us.reduce(
        (p,c) => c.time <= time ? Math.max(p,c.utility) : p, 0)
      )
      maxAverageUtility[0].series.push({name: time.toString(), value: average(maxUtilitiesUpTo)});
    }
    return maxAverageUtility 
  })


  questionTypeData = computed(() => {
      let data = {};
      Object.values(QuestionType).forEach(k => data[k] = {name: k, value: 0})
      this.selectedParticipants()?.forEach(p => (
        p.timeLog.filter(a => a.type == ActionType.ASK_QUESTION && a.data.demoId == this.demoId()).forEach(
          (q: AskQuestionUserAction) => data[q.data.questionType].value += 1
        )
      ))

      return Object.values(data);
    }
  )

}

function average(values: number[]): number{
  return values?.reduce((p,c) => p + c, 0) / values?.length
}