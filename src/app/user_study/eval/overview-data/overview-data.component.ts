import { USUser } from '../../domain/user-study-user';
import { UserStudyDataService, DataPoint, LineChartData } from '../../service/user-study-data.service';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, Subject } from "rxjs";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: "app-overview-data",
  standalone: true,
  imports: [
    NgxChartsModule,
    MatCardModule,
  ],
  templateUrl: "./overview-data.component.html",
  styleUrls: ["./overview-data.component.css"],
})
export class OverviewDataComponent implements OnInit {
  showPlots = true;

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;

  colorScheme = {
    domain: ["#02496f"],
  };

  users$ = new BehaviorSubject<USUser[]>([]);
  selectedDemoId$ = new BehaviorSubject<string>(null);

  @Input()
  set demoId(id: string) {
    this.selectedDemoId$.next(id);
  }

  @Input()
  set users(users: USUser[]) {
    this.users$.next(users);
  }

  iterationStepsData: DataPoint[];
  questionsData: DataPoint[];
  utilityData: DataPoint[];
  utilityTimeData: LineChartData[];

  constructor(
    private userStudyDataService: UserStudyDataService
  ) {}

  ngOnInit(): void {

    combineLatest(([this.selectedDemoId$, this.users$])).pipe(
      takeUntilDestroyed(),
      filter(([id, users]) => !!id && !!users && users.length > 0)
    ).subscribe(async ([id, users]) => {
      this.iterationStepsData = await this.userStudyDataService.getIterationStepsPerUser(id, users);
      this.questionsData = await this.userStudyDataService.getQuestionsPerUser(id, users);
      this.utilityData = await this.userStudyDataService.getUtilityPerUser(id, users);
      this.utilityTimeData = await this.userStudyDataService.getAverageMaxUtilityOverTime(id, users);
      window.setTimeout(() => (this.showPlots = true), 200);
    });
  }


}
