import { USUser } from '../../domain/user-study-user';
import { filter } from 'rxjs/operators';
import { Component, computed, inject, input, Input, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { selectUserStudyParticipantsOfStudy } from '../../state/user-study.selector';
import { ActionType } from 'src/app/user_study_execution/domain/user-action';

export interface DataPoint {
    name: string,
    value: number
  }

@Component({
  selector: "app-overview-data",
  standalone: true,
  imports: [
    NgxChartsModule,
    MatCardModule,
  ],
  templateUrl: "./overview-data.component.html",
  styleUrls: ["./overview-data.component.scss"],
})
export class OverviewDataComponent implements OnInit {

  private store = inject(Store);

  selectedParticipants = input<string[]>([]);
  participants = toSignal(this.store.select(selectUserStudyParticipantsOfStudy));

  showPlots = true;

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;

  colorScheme = {
    domain: ["#3711b2"],
  };


  iterationStepsData = computed(() => 
    this.participants()?.filter(p => this.selectedParticipants().includes(p.user)).map(p => ({
      name: p.user, 
      value: p.timeLog.filter(a => a.type == 'CREATE_ITERATION_STEP').length
    }))
  )


  // questionsData: DataPoint[];
  // utilityData: DataPoint[];
  // utilityTimeData: LineChartData[];


  ngOnInit(): void {

    // combineLatest(([this.selectedDemoId$, this.users$])).pipe(
    //   takeUntilDestroyed(),
    //   filter(([id, users]) => !!id && !!users && users.length > 0)
    // ).subscribe(async ([id, users]) => {
    //   this.iterationStepsData = await this.userStudyDataService.getIterationStepsPerUser(id, users);
    //   this.questionsData = await this.userStudyDataService.getQuestionsPerUser(id, users);
    //   this.utilityData = await this.userStudyDataService.getUtilityPerUser(id, users);
    //   this.utilityTimeData = await this.userStudyDataService.getAverageMaxUtilityOverTime(id, users);
    //   window.setTimeout(() => (this.showPlots = true), 200);
    // });
  }


}
