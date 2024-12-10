import { Component, Input, OnInit } from "@angular/core";
import { MatCard, MatCardModule } from "@angular/material/card";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { BehaviorSubject, combineLatest, Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { USUser } from "src/app/user_study/domain/user-study-user";
import { UserStudyDataService } from "src/app/user_study/service/user-study-data.service";

@Component({
  selector: "app-time-logger-data",
  standalone: true,
  imports: [
    NgxChartsModule,
    MatCardModule,
  ],
  templateUrl: "./time-logger-data.component.html",
  styleUrls: ["./time-logger-data.component.css"],
})
export class TimeLoggerDataComponent implements OnInit {
  private ngUnsubscribe$: Subject<any> = new Subject();

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

  timeLogData: any[];
  iterationStepTimeData: any[];

  constructor(
    private userStudyDataService: UserStudyDataService
  ) {}

  ngOnInit(): void {

    combineLatest(([this.selectedDemoId$, this.users$])).pipe(
      takeUntil(this.ngUnsubscribe$),
      filter(([id, users]) => !!id && !!users)
    ).subscribe(async ([id, users]) => {
      this.iterationStepTimeData = await this.userStudyDataService.getProcessingTimePerUser(id, users);
      this.timeLogData = await this.userStudyDataService.getProcessingTimeLogPerUser(id, users);
      // window.setTimeout(() => (this.showPlots = true), 200);
    });

  }


  getAvgTimeLogData() {
    const dataMap = new Map<string, number>();
    //TODO
    // for (const data of this.dataEntries) {
    //   if (!data.user.timeLog) {
    //     continue;
    //   }
    //   const logData: LogEntry[] = JSON.parse(data.user.timeLog);

    //   for (const entry of logData) {
    //     if (!entry.start || !entry.end) {
    //       continue;
    //     }
    //     const startDate = new Date(entry.start);
    //     const endDate = new Date(entry.end);
    //     const timeDiff = endDate.getTime() - startDate.getTime();
    //     if (!dataMap.has(entry.componentName)) {
    //       dataMap.set(entry.componentName, 0);
    //     }
    //     dataMap.set(
    //       entry.componentName,
    //       dataMap.get(entry.componentName) + timeDiff
    //     );
    //   }
    // }

    // this.avgTimeLogData = [];
    // for (const entry of dataMap.entries()) {
    //   this.avgTimeLogData.push({
    //     name: entry[0],
    //     value: entry[1],
    //   });
    // }
  }
}
