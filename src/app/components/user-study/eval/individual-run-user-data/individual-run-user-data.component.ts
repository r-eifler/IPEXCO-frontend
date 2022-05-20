import { LineChartData } from './../../../../service/user-study/user-study-data.service';
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { UserStudyData } from "src/app/interface/user-study/user-study-store";
import { USUser } from "src/app/interface/user-study/user-study-user";
import { DataPoint, UserStudyDataService } from "src/app/service/user-study/user-study-data.service";
import { IterationStepsService } from "../../../../service/planner-runs/iteration-steps.service";

@Component({
  selector: "app-individual-run-user-data",
  templateUrl: "./individual-run-user-data.component.html",
  styleUrls: ["./individual-run-user-data.component.css"],
})
export class IndividualRunUserDataComponent implements OnInit, OnDestroy {

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


  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  ngOnInit(): void {

    combineLatest(([this.selectedDemoId$, this.users$])).pipe(
      takeUntil(this.ngUnsubscribe$),
      filter(([id, users]) => !!id && !!users)
    ).subscribe(async ([id, users]) => {
      this.iterationStepsData = await this.userStudyDataService.getUtilityPerIterationStep(id, users[0]);
      this.utilityTimeData = await this.userStudyDataService.getMaxUtilityOverTime(id, users[0]);
      console.log(this.iterationStepsData);
    });
  }

}
