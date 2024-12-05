import { LineChartData } from '../../../../user_study/service/user-study-data.service';
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { UserStudyData } from "src/app/interface/user-study/user-study-store";
import { USUser } from "src/app/interface/user-study/user-study-user";
import { DataPoint, UserStudyDataService } from "src/app/user_study/service/user-study-data.service";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TimeLoggerDataComponent } from '../time-logger-data/time-logger-data.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: "app-individual-run-user-data",
  standalone: true,
  imports: [
    MatCardModule,
    NgxChartsModule,
  ],
  templateUrl: "./individual-run-user-data.component.html",
  styleUrls: ["./individual-run-user-data.component.css"],
})
export class IndividualRunUserDataComponent implements OnInit {

  private ngUnsubscribe$: Subject<any> = new Subject();

  view: any[] = [1000, 400];

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
  utilityTimeData: LineChartData[];

  constructor(private userStudyDataService: UserStudyDataService) {}


  ngOnInit(): void {

    combineLatest(([this.selectedDemoId$, this.users$])).pipe(
      takeUntilDestroyed(),
      filter(([id, users]) => !!id && !!users)
    ).subscribe(async ([id, users]) => {
      this.iterationStepsData = await this.userStudyDataService.getUtilityPerIterationStep(id, users[0]);
      this.utilityTimeData = await this.userStudyDataService.getMaxUtilityOverTime(id, users[0]);
      console.log(this.iterationStepsData);
    });
  }

}
