import { Component, computed, inject, input } from '@angular/core';
import { UserStudyDashboardCardComponent } from '../user-study-dashboard-card/user-study-dashboard-card.component';
import { Store } from '@ngrx/store';
import { selectUserStudyParticipantsOfStudy } from '../../state/user-study.selector';
import { filter, map } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActionType, PlanForIterationStepUserAction } from 'src/app/user_study_execution/domain/user-action';

@Component({
    selector: 'app-user-study-dashboard',
    imports: [
        UserStudyDashboardCardComponent,
        DatePipe
    ],
    templateUrl: './user-study-dashboard.component.html',
    styleUrl: './user-study-dashboard.component.scss'
})
export class UserStudyDashboardComponent {

  store = inject(Store);
  participants = toSignal(this.store.select(selectUserStudyParticipantsOfStudy));
  acceptedParticipants = computed(() => this.participants()?.filter(p => p.accepted))

  demoId = input.required<string>();
  demoSelected = computed(() => !! this.demoId())

  numParticipants = computed(() => this.participants()?.length ?? 0);
  numAcceptedParticipants = computed(() => this.participants() ? this.participants()?.filter(p => p.accepted).length : 0)


  averageTime = computed(() => {
    if(this.acceptedParticipants() == null || this.participants() == undefined || this.participants().length == 0){
      return undefined;
    }
    const times = this.participants()?.map(p => p.finished ? p.finishedAt.getTime() - p.createdAt.getTime(): null);
    const duration =  new Date (times?.reduce((p,c) => p + c, 0) / times?.length);
    return duration;
  })

  averageIterationSteps = computed(() => {
    const numIterSteps = this.acceptedParticipants()?.map(p => 
      p.timeLog.filter(a => a.type == ActionType.CREATE_ITERATION_STEP && a.data.demoId == this.demoId()).length
    );
    return average(numIterSteps).toFixed(2);
  })

  averageQuestions = computed(() => {
    const questions = this.acceptedParticipants()?.map(p => 
      p.timeLog.filter(a => a.type == ActionType.ASK_QUESTION && a.data.demoId == this.demoId()).length
    );
    return average(questions).toFixed(2);
  })

  averageMaxUtility = computed(() => {
    if(this.acceptedParticipants() == null){
      return null;
    }
    const utilitiesPerParticipant = this.acceptedParticipants()?.
      map(p => 
        p.timeLog.filter(a => a.type == ActionType.PLAN_FOR_ITERATION_STEP && a.data.demoId == this.demoId()).
        map((a: PlanForIterationStepUserAction) => a.data.utility ? a.data.utility : 0)
    );
    const maxUtilities = utilitiesPerParticipant.map(us => us.reduce((p,c) => Math.max(p,c), 0));
    return average(maxUtilities).toFixed(2);
  })

}


function average(values: number[]): number{
  return values?.reduce((p,c) => p + c, 0) / values?.length
}