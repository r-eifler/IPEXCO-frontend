import { USUser } from './../../../../interface/user-study/user-study-user';
import { UserStudyDataService, DataPoint } from './../../../../service/user-study/user-study-data.service';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { IterationStep } from 'src/app/interface/run';
import { Component, Input, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, Subject } from "rxjs";
import { UserStudyData, UserStudyDemoData } from "src/app/interface/user-study/user-study-store";

@Component({
  selector: "app-overview-data",
  templateUrl: "./overview-data.component.html",
  styleUrls: ["./overview-data.component.css"],
})
export class OverviewDataComponent implements OnInit {
  private ngUnsubscribe$: Subject<any> = new Subject();
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

  constructor(
    private userStudyDataService: UserStudyDataService
  ) {}

  ngOnInit(): void {

    combineLatest(([this.selectedDemoId$, this.users$])).pipe(
      takeUntil(this.ngUnsubscribe$),
      filter(([id, users]) => !!id && !!users)
    ).subscribe(async ([id, users]) => {
      this.iterationStepsData = await this.userStudyDataService.getIterationStepsPerUser(id, users);
      window.setTimeout(() => (this.showPlots = true), 200);
    });
  }

}
