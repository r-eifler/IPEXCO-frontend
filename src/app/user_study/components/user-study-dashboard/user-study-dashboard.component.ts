import { Component, computed, inject } from '@angular/core';
import { UserStudyDashboardCardComponent } from '../user-study-dashboard-card/user-study-dashboard-card.component';
import { Store } from '@ngrx/store';
import { selectUserStudyParticipantsOfStudy } from '../../state/user-study.selector';
import { filter, map } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActionType } from 'src/app/user_study_execution/domain/user-action';

@Component({
  selector: 'app-user-study-dashboard',
  standalone: true,
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

  numParticipants = computed(() => this.participants()?.length);
  numAcceptedParticipants = computed(() => this.participants()?.filter(p => p.accepted).length)


  averageTime = computed(() => {
    if(this.participants() == null || this.participants == undefined){
      return undefined;
    }
    const times = this.participants()?.map(p => p.finishedAt.getTime() - p.createdAt.getTime());
    console.log(times.map(t => new Date(t)));
    console.log('Average: ' + (times?.reduce((p,c) => p + c, 0) / times?.length))
    const duration =  new Date (times?.reduce((p,c) => p + c, 0) / times?.length);
    console.log(duration);
    return duration;
  })

  averageIterationSteps = computed(() => {
    const numIterSteps = this.participants()?.map(p => p.timeLog.filter(a => a.type == ActionType.CREATE_ITERATION_STEP).length);
    return numIterSteps?.reduce((p,c) => p + c, 0) / numIterSteps?.length;
  })

  averageQuestions = computed(() => {
    const questions = this.participants()?.map(p => p.timeLog.filter(a => a.type == ActionType.ASK_QUESTION).length);
    return questions?.reduce((p,c) => p + c, 0) / questions?.length;
  })

}
